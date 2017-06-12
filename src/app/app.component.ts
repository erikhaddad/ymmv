import {Component, ViewEncapsulation} from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {IUser} from './common/data-model';
import {AuthService} from './auth/auth.service';
import {DataService} from './common/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class AppComponent {

    authUser$: FirebaseObjectObservable<IUser>;
    authUser: IUser|null;

    currentPage: string;

    navItems = [
        {
            id: 'stats',
            title: 'Stats',
            icon: 'bar_chart'
        },
        {
            id: 'map',
            title: 'Map',
            icon: 'map'
        },
        {
            id: 'passes',
            title: 'Passes',
            icon: 'receipt'
        },
        {
            id: 'table',
            title: 'Table',
            icon: 'table_chart'
        },
        {
            id: 'calculator',
            title: 'Calculator',
            icon: 'functions'
        }
    ];

    constructor(public authService: AuthService,
                public dataService: DataService,
                iconRegistry: MdIconRegistry,
                sanitizer: DomSanitizer) {

        this.currentPage = 'stats';

        this.authUser = null;
        authService.authState$.subscribe(authUser => {
            if (authUser != null) {
                this.authUser$ = dataService.getUser(authUser.uid);
                this.authUser$.subscribe(user => {
                    this.authUser = user;
                });
            }
        });

        iconRegistry.addSvgIcon(
            'google',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/google.svg'));

        iconRegistry.addSvgIcon(
            'facebook',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/facebook.svg'));

        iconRegistry.addSvgIcon(
            'twitter',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/twitter.svg'));

        iconRegistry.addSvgIcon(
            'github',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/auth/github.svg'));

        iconRegistry.addSvgIcon(
            'avatar_disabled',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/avatar_disabled.svg'));

        iconRegistry.addSvgIcon(
            'avatar_anonymous',
            sanitizer.bypassSecurityTrustResourceUrl('assets/icons/avatar_anonymous.svg'));
    }
}
