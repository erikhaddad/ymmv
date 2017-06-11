import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NgServiceWorker, ServiceWorkerModule} from '@angular/service-worker';

// import 'hammerjs';

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
import { SetFlightComponent } from './set-flight/set-flight.component';

@NgModule({
    declarations: [
        AppComponent,
        SetFlightComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ymmv'}),
        // Application routing
        RouterModule.forRoot([
            {path: 'home', pathMatch: 'full', loadChildren: 'app/home/home.module#HomeModule'},
            {path: 'flights/:userId', loadChildren: 'app/user-flights/user-flights.module#UserFlightsModule'}
        ]),
        HttpModule,
        FormsModule,
        ServiceWorkerModule,
        MaterialModule,
        FlexLayoutModule,
        BrowserAnimationsModule,

        AuthModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        AngularFireAuthModule,

        NguiMapModule.forRoot({apiUrl: 'https://maps.google.com/maps/api/js?key=' + environment.google.apiKey}),

        SignInModule,
        UserFlightsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor(sw: NgServiceWorker) {
        sw.registerForPush({
            applicationServerKey: environment.google.messaging
        }).subscribe(sub => {
            console.log(sub.toJSON());
        });

        sw.push.subscribe(msg => {
            console.log('got push message', msg);
        });
    }
}
