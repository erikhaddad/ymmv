import {Component, OnInit} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Flight, IAirline, IAirport, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-user-flights',
    templateUrl: './user-flights.component.html',
    styleUrls: ['./user-flights.component.scss'],
    moduleId: module.id
})
export class UserFlightsComponent implements OnInit {

    userId: string;
    paramSubscription: any;

    currentUser$: FirebaseObjectObservable<IUser>;
    currentUser: IUser;

    newFlight: Flight;

    userFlights$: FirebaseListObservable<IFlight[]>;
    userFlights: IFlight[];

    positions: number[][];

    mapConfig = {
        type: 'roadmap', // roadmap, satellite, hybrid, terrain
        zoom: 1,
        center: '37.775, -122.434'
    };

    constructor(public dataService: DataService,
                public authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {

        this.userFlights = [];
        this.newFlight = new Flight();

        authService.authState$.subscribe(authUser => {
            this.currentUser$ = dataService.getUser(authUser.uid);
            this.currentUser$.subscribe(user => {
                this.currentUser = user;
            });
        });
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.userId = params['userId'];

            this.currentUser$ = this.dataService.getUser(this.userId);

            if (typeof this.userId !== 'undefined') {
                this.userFlights$ = this.dataService.getUserFlights(this.userId);

                this.userFlights$.subscribe(flights => {
                    console.log('returned flights', flights);

                    if (flights) {
                        this.userFlights = _.orderBy(flights, 'timestamp', 'asc');
                    } else {
                        this.userFlights = [];
                    }
                    console.log('user flights', this.userFlights);
                });
            } else {
                this.router.navigate(['/home']);
            }
        });
    }

    addRandomMarkers() {
        let randomLat: number, randomLng: number;
        this.positions = [];
        for (let i = 0 ; i < 9; i++) {
            randomLat = Math.ceil(Math.random() * 45);
            randomLng = Math.ceil(Math.random() * 45);

            if (i % 2 === 0) {
                randomLat *= -1;
            }
            if (i % 2 === 1) {
                randomLng *= -1;
            }

            this.positions.push([randomLat, randomLng]);
        }
    }

    editFlight(flight: IFlight, evt: Event) {

    }

    getAirportByCode (code:string): IAirport {
        return this.dataService.getAirportByCode(code);
    }

    getAirlineByCode (code): IAirline {
        return this.dataService.getAirlineByCode(code);
    }

    getFormattedDate (datetime) {
        return moment(datetime).format('ddd, D MMM YYYY');
    }

    getFormattedTime (datetime) {
        return moment(datetime).format('HH:mm');
    }

    getUserProfile () {
        return this.dataService.getUser(this.userId);
    }


    private toRadians(coord) {
        return coord * Math.PI / 180;
    }

    private calculateDistance (lat1, lat2, lon1, lon2) {
        const latOne = this.toRadians(lat1),
            latTwo = this.toRadians(lat2),
            lonChange = this.toRadians(lon2 - lon1),
            R = 3959; // mi

        return Math.round(Math.acos(Math.sin(latOne) * Math.sin(latTwo) + Math.cos(latOne) * Math.cos(latTwo) * Math.cos(lonChange)) * R);
    }

    private calculateSegmentMiles (origin, destination) {
        const originObj = this.dataService.getAirportByCode(origin),
            destinationObj = this.dataService.getAirportByCode(destination);

        let estimation = null;
        if (!!originObj && !!destinationObj) {
            estimation = this.calculateDistance(originObj.latitude, destinationObj.latitude,
                originObj.longitude, destinationObj.longitude);
        }

        return estimation || 0;
    }



    onMapReady(map) {
        this.addRandomMarkers();

        console.log('map', map);
        console.log('markers', map.markers);  // to get all markers as an array
    }
    onIdle(event) {
        console.log('map', event.target);
    }
    onMarkerInit(marker) {
        console.log('marker', marker);
    }
    onMapClick(event) {
        this.positions.push(event.latLng);
        event.target.panTo(event.latLng);
    }
}
