import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {FormControl} from '@angular/forms';

import {IAirport} from '../common/data-model';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-mileage-calculator',
    templateUrl: './mileage-calculator.component.html',
    styleUrls: ['./mileage-calculator.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
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


    stateCtrl: FormControl;
    filteredStates: any;

    states = [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
    ];

    constructor() {
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

        this.calculatedMiles = 0;

        this.stateCtrl = new FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    ngOnInit() {

    }

    filterStates(val: string) {
        return val ? this.states.filter(s => new RegExp(`^${val}`, 'gi').test(s))
            : this.states;
    }
}
