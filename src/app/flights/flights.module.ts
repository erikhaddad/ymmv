import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {FlightsComponent} from './flights.component';

@NgModule({
    declarations: [
        FlightsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', pathMatch: 'full', component: FlightsComponent}
        ])
    ]
})
export class FlightsModule {
}
