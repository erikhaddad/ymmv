import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';

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

    selectedOriginAirportCode: string;
    selectedOriginAirportArr: string[];
    selectedOriginAirportObj: IAirport;
    selectedOriginDateObj: Date;
    selectedOriginHelperText: string;

    selectedDestinationAirportCode: string;
    selectedDestinationAirportArr: string[];
    selectedDestinationAirportObj: IAirport;
    selectedDestinationDateObj: Date;
    selectedDestinationHelperText: string;

    selectedAirlineCode: string;
    selectedAirlineObj: IAirport;
    selectedAirlineHelperText: string;

    calculatedMiles: number;

    mapConfig = {
        type: 'roadmap', // roadmap, satellite, hybrid, terrain
        zoom: 2,
        center: '37.775, -122.434',
        markers: [], // array of models to display
        polylines: [] // array of lines to display
    };

    airportCtrl: FormControl;
    filteredAirports: any;

    airports$: FirebaseListObservable<IAirport[]>;
    airports: IAirport[];

    constructor(public dataService: DataService) {
        this.selectedOriginAirportCode = '';
        this.selectedOriginAirportArr = [null, null, null];
        this.selectedOriginAirportObj = null;
        this.selectedOriginDateObj = new Date();
        this.selectedOriginHelperText = '3 letter airport code';

        this.selectedDestinationAirportCode = '';
        this.selectedDestinationAirportArr = [null, null, null];
        this.selectedDestinationAirportObj = null;
        this.selectedDestinationDateObj = new Date();
        this.selectedDestinationHelperText = '3 letter airport code';

        this.selectedAirlineCode = '';
        this.selectedAirlineObj = null;
        this.selectedAirlineHelperText = 'Airline and flight number';

        this.airports$ = dataService.airports;
        this.airports$.subscribe(airports => {
            this.airports = _.orderBy(airports, 'name', 'asc');
        });

        this.calculatedMiles = 0;

        this.airportCtrl = new FormControl();
        this.filteredAirports = this.airportCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterAirports(name));
    }

    ngOnInit() {

    }

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code});
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

    private calculateSegmentMiles(origin, destination) {
        const originObj = this.getAirportByCode(origin),
            destinationObj = this.getAirportByCode(destination);

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
