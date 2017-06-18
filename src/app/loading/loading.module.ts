import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoadingComponent} from './loading.component';

@NgModule({
    declarations: [LoadingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'loading', component: LoadingComponent},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        FlexLayoutModule
    ]
})
export class LoadingModule {}
