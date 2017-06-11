import {Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {Airport, Flight} from '../common/data-model';

@Component({
    selector: 'app-set-flight',
    templateUrl: './set-flight.component.html',
    styleUrls: ['./set-flight.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default
})
export class SetFlightComponent implements OnInit {

    thisFlight: Flight;

    selectedOriginAirportCode: string;
    selectedOriginAirportArr: string[];
    selectedOriginAirportObj: Airport;
    selectedOriginDateObj: Date;
    selectedOriginHelperText: string;

    selectedDestinationAirportCode: string;
    selectedDestinationAirportArr: string[];
    selectedDestinationAirportObj: Airport;
    selectedDestinationDateObj: Date;
    selectedDestinationHelperText: string;

    selectedAirlineCode: string;
    selectedAirlineObj: Airport;
    selectedAirlineHelperText: string;

    seatClasses: string[];
    purposes: string[];

    constructor() {
        this.thisFlight = new Flight();

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

        this.seatClasses = ['First', 'Business', 'Premium', 'Economy'];
        this.purposes = ['Business', 'Pleasure', 'Mixed'];
    }

    ngOnInit() {

    }

}
