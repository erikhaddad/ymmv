import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {SegmentsComponent} from './segments.component';

@NgModule({
    declarations: [
        SegmentsComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: '', pathMatch: 'full', component: SegmentsComponent}
        ])
    ]
})
export class SegmentsModule {
}
