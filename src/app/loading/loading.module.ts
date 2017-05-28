import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
    selector: 'app-loading',
    template: '<h3>Loading...</h3>'
})
export class LoadingComponent {}

@NgModule({
    declarations: [LoadingComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'loading', component: LoadingComponent}
        ])
    ]
})
export class LoadingModule {}
