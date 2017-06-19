import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NgServiceWorker, ServiceWorkerModule} from '@angular/service-worker';

import * as hammerjs from 'hammerjs';

import {environment} from '../environments/environment';

import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MaterialModule} from './material/material.module';

import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';

import {NguiMapModule} from '@ngui/map';

import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {RouterModule} from '@angular/router';

import {SignInModule} from './sign-in/sign-in.module';
import {UserFlightsModule} from './user-flights/user-flights.module';
import {MileageCalculatorModule} from './mileage-calculator/mileage-calculator.module';
import {LayoutService} from './common/layout.service';
import {SetFlightDialogComponent} from './set-flight-dialog/set-flight-dialog.component';
import {LoadingModule} from './loading/loading.module';

@NgModule({
    declarations: [
        AppComponent,
        SetFlightDialogComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ymmv'}),
        // Application routing
        RouterModule.forRoot([
            {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
            {path: 'loading', loadChildren: 'app/loading/loading.module#LoadingModule'},
            {path: 'mileage-calculator', loadChildren: 'app/mileage-calculator/mileage-calculator.module#MileageCalculatorModule'},
            {path: 'user/:userId', loadChildren: 'app/user-flights/user-flights.module#UserFlightsModule'},
            {path: '', redirectTo: '/home', pathMatch: 'full'}
        ]),
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        ServiceWorkerModule,
        BrowserAnimationsModule,

        MaterialModule,
        FlexLayoutModule,

        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,

        AuthModule,

        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.google.apiKey}),

        LoadingModule,
        SignInModule,
        UserFlightsModule,
        MileageCalculatorModule
    ],
    providers: [LayoutService],
    bootstrap: [AppComponent],
    entryComponents: [SetFlightDialogComponent]
})

export class AppModule {
    constructor(sw: NgServiceWorker) {
        sw.registerForPush({
            'applicationServerKey': environment.webpush
        }).subscribe(sub => {
            console.log('push subscription info', sub.toJSON()); // subscription object, to store in Firebase
        });

        sw.push.subscribe(msg => {
            console.log('got push message', msg);
        });
    }
}
