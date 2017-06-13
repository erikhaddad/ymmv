import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {IAirport} from '../common/data-model';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {FirebaseListObservable} from 'angularfire2/database';
import {DataService} from '../common/data.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-mileage-calculator',
    templateUrl: './mileage-calculator.component.html',
    styleUrls: ['./mileage-calculator.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class MileageCalculatorComponent implements OnInit {

    originHintText: string;
    destinationHintText: string;

    calculatedMiles: number;

    mapConfig = {
        type: 'roadmap', // roadmap, satellite, hybrid, terrain
        zoom: 2,
        center: '37.775, -122.434',
        markers: [], // array of models to display
        polylines: [] // array of lines to display
    };

    airportsForm: FormGroup;

    airportCtrl: FormControl;
    filteredAirports: any;

    airports$: FirebaseListObservable<IAirport[]>;
    airports: IAirport[];

    constructor(public dataService: DataService, private fb: FormBuilder) {

        this.originHintText = '(e.g. SFO)';
        this.destinationHintText = '(e.g. JFK)';

        this.airports = [];
        this.airports$ = dataService.airports;
        this.airports$.subscribe(airports => {
            this.airports = _.orderBy(airports, 'name', 'asc');

        });

        this.calculatedMiles = 0;

        this.createForm();

        this.airportCtrl = new FormControl();
        this.filteredAirports = this.airportCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterAirports(name));
    }

    airportMatcher(control: FormControl, key: string): {[key: string]: boolean} {
        const airportCode = control.value;

        if (airportCode.length === 0) {
            if (key === 'origin') {
                this.originHintText = '(e.g. SFO)';
            } else if (key === 'destination') {
                this.destinationHintText = '(e.g. JFK)';
            }

            return null;
        }

        if (airportCode.length < 3) {
            if (key === 'origin') {
                this.originHintText = 'Not long enough';
            } else if (key === 'destination') {
                this.destinationHintText = 'Not long enough';
            }

            return null;
        }

        const airport = this.getAirportByCode(airportCode);

        if (airport) {
            if (key === 'origin') {
                this.originHintText = airport.name;
            } else if (key === 'destination') {
                this.destinationHintText = airport.name;
            }

            return null;
        } else {
            if (key === 'origin') {
                this.originHintText = 'Airport not found';
            } else if (key === 'destination') {
                this.destinationHintText = 'Airport not found';
            }

            return { nomatch: true };
        }
    }

    createForm() {
        this.airportsForm = this.fb.group({
            origin: ['',
                [
                    Validators.required,
                    Validators.minLength(3),
                    (formControl: FormControl) => {
                        return this.airportMatcher(formControl, 'origin');
                    }
                ]
            ],
            destination: ['',
                [
                    Validators.required,
                    Validators.minLength(3),
                    (formControl: FormControl) => {
                        return this.airportMatcher(formControl, 'destination');
                    }
                ]
            ],
        });
    }

    onSubmit(evt: Event) {
        const originAirportCode = this.airportsForm.get('origin').value,
            destinationAirportCode = this.airportsForm.get('destination').value;

        const originObj = this.getAirportByCode(originAirportCode),
            destinationObj = this.getAirportByCode(destinationAirportCode);

        if (originObj && destinationObj) {
            const originLatitude = Number.parseFloat(originObj.latitude),
                originLongitude = Number.parseFloat(originObj.longitude),
                destinationLatitude = Number.parseFloat(destinationObj.latitude),
                destinationLongitude = Number.parseFloat(destinationObj.longitude);

            this.calculatedMiles = this.calculateSegmentMiles(originObj, destinationObj);

            this.mapConfig.markers = [
                {
                    id: 'origin-' + originAirportCode,
                    position: {
                        lat: originLatitude,
                        lng: originLongitude
                    },
                    showWindow: false,
                    title: originObj.city + ', ' + originObj.country,
                    animation: 0
                },
                {
                    id: 'destination-' + destinationAirportCode,
                    position: {
                        lat: destinationLatitude,
                        lng: destinationLongitude
                    },
                    showWindow: false,
                    title: destinationObj.city + ', ' + destinationObj.country,
                    animation: 0
                }
            ];

            this.mapConfig.polylines = [
                {
                    id: 'calculated-path',
                    paths: [
                        {
                            lat: originLatitude,
                            lng: originLongitude
                        },
                        {
                            lat: destinationLatitude,
                            lng: destinationLongitude
                        }
                    ],
                    stroke: {
                        // color: "#039be5",
                        color: '#ffab40',
                        opacity: 0.5,
                        weight: 2
                    },
                    editable: false,
                    geodesic: true,
                    visible: true
                }
            ];
        }
    }

    onClick(evt: Event) {
        console.log('click');
    }

    ngOnInit() {

    }

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code ? code.toUpperCase() : ''});
    }

    filterAirports(val: string) {
        return val ? this.airports.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
            : this.airports;
    }

    displayFn(airport: IAirport): string {
        return airport ? airport.name : null;
    }


    private toRadians(coord) {
        return coord * Math.PI / 180;
    }

    private calculateDistance(lat1, lat2, lon1, lon2) {
        const latOne = this.toRadians(lat1),
            latTwo = this.toRadians(lat2),
            lonChange = this.toRadians(lon2 - lon1),
            R = 3959; // mi

        return Math.round(Math.acos(Math.sin(latOne) * Math.sin(latTwo) + Math.cos(latOne) * Math.cos(latTwo) * Math.cos(lonChange)) * R);
    }

    private calculateSegmentMiles(originObj, destinationObj) {
        let estimation = null;
        if (!!originObj && !!destinationObj) {
            estimation = this.calculateDistance(originObj.latitude, destinationObj.latitude,
                originObj.longitude, destinationObj.longitude);
        }

        return estimation || 0;
    }


    onMapReady(map) {
        /*
         this.addRandomMarkers();

         console.log('map', map);
         console.log('markers', map.markers);  // to get all markers as an array
         */
    }

    onIdle(event) {
        // console.log('map', event.target);
    }

    onMarkerInit(marker) {
        // console.log('marker', marker);
    }

    onPolylineInit(polyline) {
        // console.log('polyline', polyline);
    }

    onMapClick(event) {
        // this.positions.push(event.latLng);
        event.target.panTo(event.latLng);
    }

    myCallbackFunction(evt: Event) {
        console.log(evt);
    }
}
