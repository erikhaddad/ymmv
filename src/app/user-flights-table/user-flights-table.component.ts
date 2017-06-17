import {
    Component, EventEmitter, OnInit,
    AfterViewInit, Output, ViewEncapsulation, ViewChild, OnDestroy
} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Airport, Flight, IAirline, IAirport, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/takeUntil';

import * as _ from 'lodash';
import * as moment from 'moment';

import {LayoutService} from '../common/layout.service';
import {DatatableSortType, IDatatableSortEvent, MdDataTableComponent} from 'ng2-md-datatable';

@Component({
    selector: 'app-user-flights-table',
    templateUrl: './user-flights-table.component.html',
    styleUrls: ['./user-flights-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserFlightsTableComponent implements OnInit, AfterViewInit, OnDestroy {

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

    currentSortBy: string | undefined;
    currentSortType = DatatableSortType.None;
    @ViewChild(MdDataTableComponent) datatable: MdDataTableComponent;

    private unmount$: Subject<void> = new Subject<void>();

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
        this.layoutService.handleSectionId('user-flights-table');
        this.layoutService.handleShowToolbar(true);
        // this.layoutService.handleShowNav(true);
        // this.layoutService.handleShowFab(false);

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

                        this.userFlights = _.orderBy(flights, (flight) => {
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

    ngAfterViewInit() {
        if (this.userFlights) {
            Observable.from(this.datatable.sortChange)
                .takeUntil(this.unmount$)
                .subscribe((e: IDatatableSortEvent) => this.sortFlights(e.sortBy, e.sortType));
        }
    }

    ngOnDestroy() {
        this.unmount$.next();
        this.unmount$.complete();
    }

    sortFlights(sortBy: string, sortType: DatatableSortType) {
        this.userFlights = _.orderBy(this.userFlights, sortBy, (sortType === 2) ? 'desc' : 'asc');
    }

    editFlight(flight: IFlight, evt: Event) {

    }

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code});
    }

    getAirlineByCode(code: string): IAirline {
        return _.find(this.airlines, {'iata': code});
    }

    getFormattedDate(datetime: string) {
        // return moment(datetime).format('ddd, MMM D, YYYY');
        return moment(datetime).format('MMM D, YYYY');
    }

    getFormattedTime(datetime: string) {
        return moment(datetime).format('HH:mm');
    }
}
