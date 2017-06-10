import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Flight, IAirline, IAirport, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-user-flights',
    templateUrl: './user-flights.component.html',
    styleUrls: ['./user-flights.component.scss'],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class UserFlightsComponent implements OnInit {

    paramSubscription: any;
    userId: string;
    user$: FirebaseObjectObservable<IUser>;
    user: IUser;

    authUserId: string;
    authUser$: FirebaseObjectObservable<IUser>;
    authUser: IUser;

    airlines$: FirebaseListObservable<IAirline[]>;
    airlines: IAirline[];

    airports$: FirebaseListObservable<IAirport[]>;
    airports: IAirport[];

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

        this.airports$ = dataService.airports;
        this.airports$.subscribe(airports => {
            this.airports = airports;
        });
        this.airlines$ = dataService.airlines;
        this.airlines$.subscribe(airlines => {
            this.airlines = airlines;
        });

        authService.authState$.subscribe(authUser => {
            this.authUserId = authUser.uid;

            this.authUser$ = dataService.getUser(this.authUserId);
            this.authUser$.subscribe(user => {
                this.authUser = user;
            });
        });
    }

    ngOnInit() {
        this.paramSubscription = this.route.params.subscribe(params => {
            this.userId = params['userId'];

            this.user$ = this.dataService.getUser(this.userId);
            this.user$.subscribe(user => {
                this.user = user;
            });

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

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code});
    }

    getAirlineByCode(code: string): IAirline {
        return _.find(this.airlines, {'iata': code});
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
