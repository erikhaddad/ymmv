import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MileageCalculatorComponent} from './mileage-calculator.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material/material.module';

import {NguiMapModule} from '@ngui/map';
import {environment} from '../../environments/environment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
    declarations: [
        MileageCalculatorComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'mileage-calculator', component: MileageCalculatorComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.google.apiKey})
    ]
})
export class MileageCalculatorModule {
}
