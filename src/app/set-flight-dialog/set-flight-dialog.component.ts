import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {IAirport, Flight, IAirline, IUser} from '../common/data-model';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {MdDialogRef} from '@angular/material';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {DataService} from '../common/data.service';

import * as _ from 'lodash';
import * as moment from 'moment';

import {AuthService} from '../auth/auth.service';

@Component({
    selector: 'app-set-flight-dialog',
    templateUrl: './set-flight-dialog.component.html',
    styleUrls: ['./set-flight-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SetFlightDialogComponent implements OnInit {

    thisFlight: Flight;

    authUserId: string;
    authUser$: FirebaseObjectObservable<IUser>;
    authUser: IUser;

    airports$: FirebaseListObservable<IAirport[]>;
    airports: IAirport[];
    filteredAirports: any;

    airlines$: FirebaseListObservable<IAirline[]>;
    airlines: IAirline[];
    filteredAirlines: any;

    originHintText: string;
    destinationHintText: string;
    airlineHintText: string;
    dateFormatHintText: string;
    timeFormatHintText: string;

    seatClasses: string[];
    selectedSeatClass: string;
    purposes: string[];
    selectedPurpose: string;

    setFlightForm: FormGroup;
    airportCtrl: FormControl;

    constructor(public dataService: DataService,
                public authService: AuthService,
                public dialogRef: MdDialogRef<SetFlightDialogComponent>,
                private fb: FormBuilder) {

        this.thisFlight = new Flight();

        this.seatClasses = ['First', 'Business', 'Premium', 'Economy'];
        this.purposes = ['Business', 'Pleasure', 'Mixed'];

        this.originHintText = '(e.g. SFO)';
        this.destinationHintText = '(e.g. JFK)';
        this.airlineHintText = '(e.g. UA)';
        this.dateFormatHintText = 'MM/DD/YYYY';
        this.timeFormatHintText = 'hh:mm aa';

        this.airports = [];
        this.airports$ = dataService.airports;
        this.airports$.subscribe(airports => {
            this.airports = _.orderBy(airports, 'name', 'asc');
        });

        this.airlines = [];
        this.airlines$ = dataService.airlines;
        this.airlines$.subscribe(airlines => {
            this.airlines = _.orderBy(airlines, 'name', 'asc');
        });

        this.createForm();

        this.airportCtrl = new FormControl();
        this.filteredAirports = this.airportCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterAirports(name));

        authService.authState$.subscribe(authUser => {
            this.authUserId = authUser.uid;

            this.authUser$ = dataService.getUser(this.authUserId);
            this.authUser$.subscribe(user => {
                this.authUser = user;
            });
        });
    }

    ngOnInit() {

    }

    close(evt: Event) {
        this.dialogRef.close(this.thisFlight);
    }

    done(evt: Event) {
        this.onSubmit(evt);
    }

    airportMatcher(control: FormControl, key: string): {[key: string]: boolean} {
        const airportCode = control.value;

        if (airportCode.length === 0) {
            if (key === 'originAirport') {
                this.originHintText = '(e.g. SFO)';
            } else if (key === 'destination') {
                this.destinationHintText = '(e.g. JFK)';
            }

            return null;
        }

        if (airportCode.length < 3) {
            if (key === 'originAirport') {
                this.originHintText = 'Not long enough';
            } else if (key === 'destination') {
                this.destinationHintText = 'Not long enough';
            }

            return null;
        }

        const airport = this.getAirportByCode(airportCode);

        if (airport) {
            if (key === 'originAirport') {
                this.originHintText = airport.name;
            } else if (key === 'destination') {
                this.destinationHintText = airport.name;
            }

            return null;
        } else {
            if (key === 'originAirport') {
                this.originHintText = 'Airport not found';
            } else if (key === 'destination') {
                this.destinationHintText = 'Airport not found';
            }

            return { nomatch: true };
        }
    }

    airlineMatcher(control: FormControl, key: string): {[key: string]: boolean} {
        const airlineCode = control.value;

        if (airlineCode.length === 0) {
            this.airlineHintText = '(e.g. UA)';

            return null;
        }

        if (airlineCode.length < 2) {
            this.airlineHintText = 'Not long enough';

            return null;
        }

        const airline = this.getAirlineByCode(airlineCode);

        if (airline) {
            this.airlineHintText = airline.name;

            return null;
        } else {
            this.originHintText = 'Airline not found';

            return { nomatch: true };
        }
    }

    createForm() {
        this.setFlightForm = this.fb.group({
            originAirport: ['',
                [
                    Validators.required,
                    Validators.minLength(3),
                    (formControl: FormControl) => {
                        return this.airportMatcher(formControl, 'originAirport');
                    }
                ]
            ],
            originDate: ['', [Validators.required]],
            originTime: ['', [Validators.required]],

            destinationAirport: ['',
                [
                    Validators.required,
                    Validators.minLength(3),
                    (formControl: FormControl) => {
                        return this.airportMatcher(formControl, 'destination');
                    }
                ]
            ],
            destinationDate: ['', [Validators.required]],
            destinationTime: ['', [Validators.required]],

            airline: ['',
                [
                    Validators.required,
                    Validators.minLength(2),
                    (formControl: FormControl) => {
                        return this.airlineMatcher(formControl, 'airline');
                    }
                ]
            ],
            flightNumber: ['', [Validators.required]],

            miles: ['', [Validators.required]],
            cost: ['', [Validators.required]],
            seatClass: ['', [Validators.required]],
            purpose: ['', [Validators.required]]
        });
    }

    onSubmit(evt: Event) {
        const originAirportCode = this.setFlightForm.get('originAirport').value,
            originDate = this.setFlightForm.get('originDate').value,
            originTime = this.setFlightForm.get('originTime').value,
            destinationAirportCode = this.setFlightForm.get('destinationAirport').value,
            destinationDate = this.setFlightForm.get('destinationDate').value,
            destinationTime = this.setFlightForm.get('destinationTime').value,
            airlineCode = this.setFlightForm.get('airline').value,
            flightNumber = this.setFlightForm.get('flightNumber').value,
            miles = this.setFlightForm.get('miles').value,
            cost = this.setFlightForm.get('cost').value,
            seatClass = this.setFlightForm.get('seatClass').value,
            purpose = this.setFlightForm.get('purpose').value;

        const originObj = this.getAirportByCode(originAirportCode),
            destinationObj = this.getAirportByCode(destinationAirportCode);

        // Example: 2017-03-21T21:15:00+02:00
        const originTimezoneOffsetMins = Number(originObj.timezone) * 60;
        const destinationTimezoneOffsetMins = Number(destinationObj.timezone) * 60;
        const datetimeFormat = 'YYYY-MM-DDTHH:mm:ssZZ';

        const originDateFormatted = moment(originDate).format('YYYY-MM-DD'),
            originTimeFormatted = originTime + ':00',
            destinationDateFormatted = moment(originDate).format('YYYY-MM-DD'),
            destinationTimeFormatted = destinationTime + ':00';

        const compOrigin = originDateFormatted + 'T' + originTimeFormatted + 'Z',
            compDestination = destinationDateFormatted + 'T' + destinationTimeFormatted + 'Z';

        const originDatetimeFormatted = moment(compOrigin)
            .utcOffset(originTimezoneOffsetMins, true)
            .format(datetimeFormat);

        const destinationDatetimeFormatted = moment(compDestination)
            .utcOffset(destinationTimezoneOffsetMins, true)
            .format(datetimeFormat);

        this.thisFlight.departure = {
            airport: originAirportCode.toUpperCase(),
            datetime: originDatetimeFormatted
        };
        this.thisFlight.arrival = {
            airport: destinationAirportCode.toUpperCase(),
            datetime: destinationDatetimeFormatted
        };
        this.thisFlight.airline = airlineCode.toUpperCase();
        this.thisFlight.flightNumber = parseInt(flightNumber, 0);
        this.thisFlight.miles = parseInt(miles, 0);
        this.thisFlight.cost = parseInt(cost, 0);
        this.thisFlight.seatClass = seatClass;
        this.thisFlight.purpose = purpose;

        // this.dataService.createUserFlight(this.authUser.id, this.thisFlight);

        // console.log('created this new flight', this.thisFlight);

        this.dialogRef.close(this.thisFlight);
    }

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code ? code.toUpperCase() : ''});
    }

    getAirlineByCode(code: string): IAirline {
        return _.find(this.airlines, {'iata': code ? code.toUpperCase() : ''});
    }

    filterAirports(val: string) {
        return val ? this.airports.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
            : this.airports;
    }

    filterAirlines(val: string) {
        return val ? this.airlines.filter(s => new RegExp(`^${val}`, 'gi').test(s.name))
            : this.airlines;
    }

    displayFn(airport: IAirport): string {
        return airport ? airport.name : null;
    }
}
