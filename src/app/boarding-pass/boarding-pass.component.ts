import {Component, Input, OnInit} from '@angular/core';

import * as moment from 'moment';
import {IAirport, IFlight, IUser} from '../common/data-model';

@Component({
    selector: 'app-boarding-pass',
    templateUrl: './boarding-pass.component.html',
    styleUrls: ['./boarding-pass.component.scss']
})
export class BoardingPassComponent implements OnInit {

    @Input() flight = null as IFlight;   // HACK: see https://github.com/angular/angular-cli/issues/2034
    @Input() user = null as IUser;   // HACK: see https://github.com/angular/angular-cli/issues/2034
    @Input() departure = null as IAirport;   // HACK: see https://github.com/angular/angular-cli/issues/2034
    @Input() arrival = null as IAirport;   // HACK: see https://github.com/angular/angular-cli/issues/2034

    constructor() {

    }

    ngOnInit() {
    }

    getFormattedDate(datetime: string) {
        return moment(datetime).format('ddd, MMM D, YYYY');
    }

    getFormattedTime(datetime: string) {
        return moment(datetime).format('HH:mm');
    }
}
