import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {HomeComponent} from './home.component';
import {MaterialModule} from '../material/material.module';
import {DataService} from '../common/data.service';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
    declarations: [
        HomeComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '/home', component: HomeComponent},
            {path: '', pathMatch: 'full', component: HomeComponent}
        ]),
        MaterialModule,
        FlexLayoutModule
    ],
    providers: [
        DataService
    ]
})
export class HomeModule {

}

export {DataService};
