import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {NgServiceWorker, ServiceWorkerModule} from '@angular/service-worker';

import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'ymmv'}),
        // Application routing
        RouterModule.forRoot([
            {path: '', pathMatch: 'full', loadChildren: 'app/home/home.module#HomeModule'},
            {path: 'segments', loadChildren: 'app/flights/flights.module#FlightsModule'}
        ]),
        HttpModule,
        FormsModule,
        ServiceWorkerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(sw: NgServiceWorker) {
        sw.registerForPush({
            applicationServerKey: 'AAAAXEWvP5E:APA91bGIpagExWOIMBF_Z6sQA2ktz_Y3qVOd_JuYP4fIxYIIC95tDO7pINbiFbWYprXik-' +
                                    'QowhDwjhwXWlXg72AM87BSiiCLvh8_zp8anqNp5GXwsIGvf9EGICVn9N9GXE6PSpRRYv-S'
        }).subscribe(sub => {
            console.log(sub.toJSON());
        });

        sw.push.subscribe(msg => {
            console.log('got push message', msg);
        });
    }
}
