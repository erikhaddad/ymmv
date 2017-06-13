import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Airport, Flight, IAirline, IAirport, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import * as _ from 'lodash';

@Component({
    selector: 'app-user-flights-map',
    templateUrl: './user-flights-map.component.html',
    styleUrls: ['./user-flights-map.component.scss'],
    moduleId: module.id
})
export class UserFlightsMapComponent implements OnInit {

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

    userFlights$: FirebaseListObservable<IFlight[]>;
    userFlights: IFlight[];

    positions: number[][];

    mapConfig = {
        type: 'roadmap', // roadmap, satellite, hybrid, terrain
        zoom: 3,
        center: '37.775, -122.434',
        markers: [], // array of models to display
        polylines: [] // array of lines to display
    };


    constructor(public dataService: DataService,
                public authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {

        this.userFlights = [];

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
                        // this.userFlights = _.orderBy(flights, 'timestamp', 'asc');

                        this.userFlights = _.orderBy(flights, function (flight) {
                            return flight.departure.datetime;
                        });
                    } else {
                        this.userFlights = [];
                    }
                    console.log('user flights', this.userFlights);

                    this.populateMap();
                });
            } else {
                this.router.navigate(['/home']);
            }
        });
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

    populateMap() {
        const that = this;
        _.forEach(this.userFlights, function (flight, key) {
            // console.log(flight);

            const airportOrigin = that.getAirportByCode(flight.departure.airport),
                airportDestination = that.getAirportByCode(flight.arrival.airport);

            // console.log(airportOrigin);
            if (airportOrigin != null) {
                const originLatitude = Number.parseFloat(airportOrigin.latitude),
                    originLongitude = Number.parseFloat(airportOrigin.longitude);

                that.mapConfig.markers.push(
                    {
                        id: key + '-origin',
                        position: {
                            lat: originLatitude,
                            lng: originLongitude
                        },
                        showWindow: false,
                        title: airportOrigin.city + ', ' + airportOrigin.country,
                        animation: 0
                    }
                );
            }

            if (airportDestination != null) {
                const destinationLatitude = Number.parseFloat(airportDestination.latitude),
                    destinationLongitude = Number.parseFloat(airportDestination.longitude);

                that.mapConfig.markers.push(
                    {
                        id: key + '-destination',
                        position: {
                            lat: destinationLatitude,
                            lng: destinationLongitude
                        },
                        showWindow: false,
                        title: airportDestination.city + ', ' + airportDestination.country,
                        animation: 0
                    }
                );
            }

            if (airportOrigin != null && airportDestination != null) {
                const originLatitude = Number.parseFloat(airportOrigin.latitude),
                    originLongitude = Number.parseFloat(airportOrigin.longitude),
                    destinationLatitude = Number.parseFloat(airportDestination.latitude),
                    destinationLongitude = Number.parseFloat(airportDestination.longitude);

                that.mapConfig.polylines.push(
                    {
                        id: key + '-path',
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
                );
            }
        });
    }
}
