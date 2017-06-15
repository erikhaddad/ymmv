import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../common/data.service';
import {FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Airport, Flight, IAirline, IAirport, ICountry, IFlight, IUser} from '../common/data-model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import {LayoutService} from '../common/layout.service';

@Component({
    selector: 'app-user-flights-stats',
    templateUrl: './user-flights-stats.component.html',
    styleUrls: ['./user-flights-stats.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UserFlightsStatsComponent implements OnInit {

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

    countries$: FirebaseListObservable<ICountry[]>;
    countries: ICountry[];

    userFlights$: FirebaseListObservable<IFlight[]>;
    userFlights: IFlight[];

    isDataPopulated = false;

    loaded = {
        segments: false,
        airlines: false,
        airports: false,
        analysis: false
    };

    analysis = {
        sums: {
            airports: 0,
            airlines: 0,
            days: 0,
            miles: 0,
            cost: 0,
            domestic: 0,
            international: 0,

            segments: 0
        },
        discrete: {
            airports: [],
            airlines: [],
            days: [],
            countries: [],
            cities: [],
            cost: []
        },
        distribution: {
            airports: {},
            origins: {},
            destinations: {},
            airlines: {},
            days: {},
            cost: {},
            miles: {},
            cities: {},
            countries: {}
        },
        ranks: {
            segmentMilesDescending: [],
            segmentCostAscending: [],
            segmentCostDescending: [],
            airlineMilesDescending: []
        },
        marginOfError: []
    };


    public lineChartDataHeader: Array<any> = [
        {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
    ];
    public lineChartOptionsHeader: any = {
        responsive: true,
        showLines: true,
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                display: false,
                gridLines: {
                    display: false
                }
            }],
            yAxes: [{
                display: false,
                gridLines: {
                    display: false
                }
            }]
        }
    };
    public lineChartColorsHeader: Array<any> = [
        { // orange
            backgroundColor: 'rgba(255, 152, 0, 0.2)',
            borderColor: 'rgba(255, 152, 0,1)',
            pointBackgroundColor: 'rgba(255, 152, 0,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 152, 0, 0.8)'
        },
        { // blue
            backgroundColor: 'rgba(0,139,243,0.2)',
            borderColor: 'rgba(0,139,243,1)',
            pointBackgroundColor: 'rgba(0,139,243,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0,139,243,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLabelsHeader: Array<any> = ['', '', '', '', '', '', ''];
    public lineChartLegend = true;
    public lineChartType = 'line';

    geochart = {};

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
        this.countries$ = dataService.countries;
        this.countries$.subscribe(countries => {
            this.countries = countries;
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
        this.layoutService.sectionId = 'user-flights-stats';
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
                        this.userFlights = _.orderBy(flights, function (flight) {
                            return flight.departure.datetime;
                        });
                    } else {
                        this.userFlights = [];
                    }
                    console.log('user flights', this.userFlights);

                    this.calculateTotals();
                    this.populateCharts();
                    this.populateMaps();
                });
            } else {
                this.router.navigate(['/home']);
            }
        });
    }

    getAirportByCode(code: string): IAirport {
        return _.find(this.airports, {'code': code});
    }

    getAirlineByCode(code: string): IAirline {
        return _.find(this.airlines, {'iata': code});
    }

    getCountryByCode(code: string): ICountry {
        return _.find(this.countries, {'code': code});
    }

    resetAnalysis () {
        this.analysis = {
            sums: {
                airports: 0,
                airlines: 0,
                days: 0,
                miles: 0,
                cost: 0,
                domestic: 0,
                international: 0,

                segments: 0
            },
            discrete: {
                airports: [],
                airlines: [],
                days: [],
                countries: [],
                cities: [],
                cost: []
            },
            distribution: {
                airports: {},
                origins: {},
                destinations: {},
                airlines: {},
                days: {},
                cost: {},
                miles: {},
                cities: {},
                countries: {}
            },
            ranks: {
                segmentMilesDescending: [],
                segmentCostAscending: [],
                segmentCostDescending: [],
                airlineMilesDescending: []
            },
            marginOfError: []
        };
    }

    calculateTotals () {
        this.resetAnalysis();

        _.forEach(this.userFlights, (flight, key) => {

            /** ORIGIN **/
            if (!_.includes(this.analysis.discrete.airports, flight.departure.airport)) {
                this.analysis.discrete.airports.push(flight.departure.airport);
                this.analysis.distribution.airports[flight.departure.airport] = 1;
            } else {
                this.analysis.distribution.airports[flight.departure.airport]++;
            }
            if (typeof this.analysis.distribution.origins[flight.departure.airport] === 'undefined') {
                this.analysis.distribution.origins[flight.departure.airport] = 1;
            } else {
                this.analysis.distribution.origins[flight.departure.airport]++;
            }

            /** DESTINATION **/
            if (!_.includes(this.analysis.discrete.airports, flight.arrival.airport)) {
                this.analysis.discrete.airports.push(flight.arrival.airport);
                this.analysis.distribution.airports[flight.arrival.airport] = 1;
            } else {
                this.analysis.distribution.airports[flight.arrival.airport]++;
            }
            if (typeof this.analysis.distribution.destinations[flight.arrival.airport] === 'undefined') {
                this.analysis.distribution.destinations[flight.arrival.airport] = 1;
            } else {
                this.analysis.distribution.destinations[flight.arrival.airport]++;
            }

            /** AIRLINE **/
            if (!_.includes(this.analysis.discrete.airlines, flight.airline)) {
                this.analysis.discrete.airlines.push(flight.airline);
                this.analysis.distribution.airlines[flight.airline] = 1;
            } else {
                this.analysis.distribution.airlines[flight.airline]++;
            }

            /** DATE **/
            const segmentDate = moment(flight.arrival.datetime);
            const segmentDateFormatted = segmentDate.format('YYYY-MM-DD');
            if (!_.includes(this.analysis.discrete.days, segmentDate)) {
                this.analysis.discrete.days.push(segmentDate);
            }
            if (typeof this.analysis.distribution.days[segmentDateFormatted] === 'undefined') {
                this.analysis.distribution.days[segmentDateFormatted] = 1;
            } else {
                this.analysis.distribution.days[segmentDateFormatted]++;
            }

            /** MILES **/
            this.analysis.sums.miles += (!!flight.miles ? flight.miles : 0);
            if (typeof this.analysis.distribution.miles[flight.airline] === 'undefined') {
                this.analysis.distribution.miles[flight.airline] = (!!flight.miles ? flight.miles : 0);
            } else {
                this.analysis.distribution.miles[flight.airline] += (!!flight.miles ? flight.miles : 0);
            }
            // console.log(this.analysis.distribution.miles[flight.airline]);

            /** COST **/
            this.analysis.sums.cost += (!!flight.cost ? flight.cost : 0);
            if (!_.includes(this.analysis.discrete.cost, flight.cost)) {
                this.analysis.discrete.cost.push(flight.cost);
            }
            if (typeof this.analysis.distribution.cost[flight.airline] === 'undefined') {
                this.analysis.distribution.cost[flight.airline] = (!!flight.cost ? flight.cost : 0);
            } else {
                this.analysis.distribution.cost[flight.airline] += (!!flight.cost ? flight.cost : 0);
            }

            /** SEGMENTS **/
            this.analysis.sums.segments++;

            /** CITIES AND COUNTRIES **/
            const originAirport = this.getAirportByCode(flight.departure.airport);
            const destinationAirport = this.getAirportByCode(flight.arrival.airport);

            if (originAirport && destinationAirport) {
                if (originAirport.country_code !== destinationAirport.country_code) {
                    this.analysis.sums.international++;
                } else {
                    this.analysis.sums.domestic++;
                }
            }

            if (originAirport) {
                // City
                if (!_.includes(this.analysis.discrete.cities, originAirport.city)) {
                    this.analysis.discrete.cities.push(originAirport.city);
                }
                // Country
                if (!_.includes(this.analysis.discrete.countries, originAirport.country_code)) {
                    this.analysis.discrete.countries.push(originAirport.country_code);
                }
            }
            if (destinationAirport) {
                // City
                if (!_.includes(this.analysis.discrete.cities, destinationAirport.city)) {
                    this.analysis.discrete.cities.push(destinationAirport.city);
                }
                if (typeof this.analysis.distribution.cities[destinationAirport.city] === 'undefined') {
                    this.analysis.distribution.cities[destinationAirport.city] = 1;
                } else {
                    this.analysis.distribution.cities[destinationAirport.city]++;
                }

                // Country
                if (!_.includes(this.analysis.discrete.countries, destinationAirport.country_code)) {
                    this.analysis.discrete.countries.push(destinationAirport.country_code);
                }

                if (typeof this.analysis.distribution.countries[destinationAirport.country_code] === 'undefined') {
                    this.analysis.distribution.countries[destinationAirport.country_code] = 1;
                } else {
                    this.analysis.distribution.countries[destinationAirport.country_code]++;
                }
            }

        });

        this.analysis.sums.airports = this.analysis.discrete.airports.length;
        this.analysis.sums.airlines = this.analysis.discrete.airlines.length;
        this.analysis.sums.days = this.analysis.discrete.days.length;

        this.analysis.ranks.segmentMilesDescending = this.getSortedArrayFromObjectProp(this.userFlights, 'miles', true);
        this.analysis.ranks.segmentCostAscending = this.getSortedArray(this.analysis.discrete.cost, false);
        this.analysis.ranks.segmentCostDescending = this.getSortedArray(this.analysis.discrete.cost, true);
        this.analysis.ranks.airlineMilesDescending = this.getSortedArrayFromObject(this.analysis.distribution.miles,
                                                                                    'airline', 'miles', true);

        console.log('analysis', this.analysis);
        console.log('analysis distribution', this.analysis.distribution);
        console.log('analysis ranks', this.analysis.ranks);

        this.loaded.analysis = true;

        console.log('sorted segments by miles', this.getSortedArrayFromObjectProp(this.userFlights, 'miles', true));

        console.log('sorted airlines by miles', this.getSortedArrayFromObject(this.analysis.distribution.miles, 'airline', 'miles', true));

        console.log('analysis.ranks.segmentMilesDescending[0]', this.analysis.ranks.segmentMilesDescending[0]);
    }

    getSortedArray (arr, reverse) {
        const newArray = _.clone(arr);

        if (reverse) {
            newArray.sort(function (a, b) {
                if (a < b) {
                    return 1;
                }
                if (b < a) {
                    return -1;
                }
                return 0;
            });
        } else {
            newArray.sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (b < a) {
                    return 1;
                }
                return 0;
            });
        }

        return newArray;
    }

    getSortedArrayFromObject (obj, keyName, valueName, reverse) {
        let arr = _.map(obj, function (value, index) {
            const newObj = {};

            newObj[keyName] = index;
            newObj[valueName] = value;

            return newObj;
        });


        if (reverse) {
            arr.sort(function (a, b) {
                if (a[valueName] < b[valueName]) {
                    return 1;
                }
                if (b[valueName] < a[valueName]) {
                    return -1;
                }
                return 0;
            });
        } else {
            arr = arr.sort();
        }

        return arr;
    }

    getSortedArrayFromObjectProp (obj, prop, reverse) {
        let arr = _.map(obj, function (value, index) {
            return [value];
        });

        arr = _.sortBy(arr, prop);

        if (reverse) {
            arr.sort(function (a, b) {
                if (a[prop] < b[prop]) {
                    return 1;
                }
                if (b[prop] < a[prop]) {
                    return -1;
                }
                return 0;
            });
        }

        return arr;
    }

    populateMaps () {
        const chart1 = {
            chartType: '',
            dataTable: [],
            options: {},
            formatters: {}
        };
        chart1.chartType = 'GeoChart';

        chart1.dataTable = [
            ['Locale', 'Count', 'Percent']
        ];

        _.forEach(this.analysis.distribution.countries, (value, key) => {
            const country = this.getCountryByCode(key);
            if (typeof country !== 'undefined') {
                chart1.dataTable.push([country.name, value, (value / this.userFlights.length) * 100]);
            } else {
                console.warn('Could not find country by code', key);
            }
        });

        chart1.options = {
            width: 600,
            height: 400,
            margin: '0 auto',
            chartArea: {left: 10, top: 10, bottom: 0, height: '100%'},
            colorAxis: {colors: ['#aec7e8', '#1f77b4']},
            displayMode: 'regions',

            legend: false
        };

        chart1.formatters = {
            number : [{
                columnNum: 1,
                // pattern: "$ #,##0.00"
                pattern: '#'
            }]
        };

        this.geochart = chart1;
    }

    populateCharts () {

    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}
