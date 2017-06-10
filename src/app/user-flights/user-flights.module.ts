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
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    declarations: [
        UserFlightsComponent,
        BoardingPassComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'flights/:userId', component: UserFlightsComponent, canActivate: [AuthGuard]},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FlexLayoutModule,
        MaterialModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.google.apiKey})
    ],
    providers: [
        DataService
    ]
})
export class UserFlightsModule { }
