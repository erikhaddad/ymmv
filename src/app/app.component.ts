import {Component, ViewEncapsulation} from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {IUser} from './common/data-model';
import {AuthService} from './auth/auth.service';
import {DataService} from './common/data.service';
import {LayoutService} from './common/layout.service';

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
            id: 'overview',
            title: 'Overview',
            icon: 'language',
            sectionId: 'user-flights-overview'
        },
        {
            id: 'stats',
            title: 'Stats',
            icon: 'bar_chart',
            sectionId: 'user-flights-stats'
        },
        {
            id: 'map',
            title: 'Map',
            icon: 'map',
            sectionId: 'user-flights-map'
        },
        {
            id: 'boarding-passes',
            title: 'Passes',
            icon: 'receipt',
            sectionId: 'user-flights-boarding-passes'
        },
        {
            id: 'table',
            title: 'Table',
            icon: 'table_chart',
            sectionId: 'user-flights-table'
        }
    ];

    showToolbar: boolean;
    showNav: boolean;
    showFab: boolean;

    constructor(public authService: AuthService,
                public dataService: DataService,
                public layoutService: LayoutService,
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

        /** LAYOUT **/
        this.showToolbar = layoutService.toolbarShowState;
        this.layoutService.showToolbarAnnounced$.subscribe(
            show => {
                this.showToolbar = show;
            });
        this.showNav = layoutService.navShowState;
        this.layoutService.showNavAnnounced$.subscribe(
            show => {
                this.showNav = show;
            });
        this.showFab = layoutService.fabShowState;
        this.layoutService.showFabAnnounced$.subscribe(
            show => {
                this.showFab = show;
            });

        /** ICONS **/
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
