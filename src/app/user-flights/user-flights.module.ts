import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {environment} from '../../environments/environment';

import {UserFlightsComponent} from './user-flights.component';
import {AuthGuard} from '../auth/auth.guard';
import {DataService} from '../common/data.service';
import {MaterialModule} from '../material/material.module';
import {NguiMapModule} from '@ngui/map';
import {BoardingPassComponent} from '../boarding-pass/boarding-pass.component';
import {UserFlightsMapComponent} from '../user-flights-map/user-flights-map.component';
import {UserFlightsStatsComponent} from '../user-flights-stats/user-flights-stats.component';
import {UserFlightsTableComponent} from '../user-flights-table/user-flights-table.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {UserFlightsBoardingPassesComponent} from '../user-flights-boarding-passes/user-flights-boarding-passes.component';
import {SetFlightComponent} from '../set-flight/set-flight.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {QRCodeModule} from 'angular2-qrcode';

@NgModule({
    declarations: [
        BoardingPassComponent,
        SetFlightComponent,
        UserFlightsComponent,
        UserFlightsBoardingPassesComponent,
        UserFlightsMapComponent,
        UserFlightsStatsComponent,
        UserFlightsTableComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'user/:userId', component: UserFlightsComponent, canActivate: [AuthGuard]},
            {path: 'user/:userId/boarding-passes', component: UserFlightsBoardingPassesComponent, canActivate: [AuthGuard]},
            {path: 'user/:userId/map', component: UserFlightsMapComponent, canActivate: [AuthGuard]},
            {path: 'user/:userId/stats', component: UserFlightsStatsComponent, canActivate: [AuthGuard]},
            {path: 'user/:userId/table', component: UserFlightsTableComponent, canActivate: [AuthGuard]},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        QRCodeModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.google.apiKey})
    ],
    providers: [
        DataService
    ]
})
export class UserFlightsModule {
}
