import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Airport, Flight, IAirline, IAirport, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import * as _ from 'lodash';
import {LayoutService} from '../common/layout.service';

@Component({
    selector: 'app-user-flights-boarding-passes',
    templateUrl: './user-flights-boarding-passes.component.html',
    styleUrls: ['./user-flights-boarding-passes.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserFlightsBoardingPassesComponent implements OnInit {

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

    constructor(public dataService: DataService,
                public authService: AuthService,
                public layoutService: LayoutService,
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
        this.layoutService.sectionId = 'user-flights-boarding-passes';
        this.layoutService.handleShowToolbar(true);
        // this.layoutService.handleShowNav(true);
        this.layoutService.handleShowFab(false);

        this.paramSubscription = this.route.params.subscribe(params => {
            this.userId = params['userId'];

            this.user$ = this.dataService.getUser(this.userId);
            this.user$.subscribe(user => {
                this.user = user;

                this.layoutService.handleShowFab(this.authUser.id === this.user.id);
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
}
