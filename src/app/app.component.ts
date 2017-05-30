import {Component} from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    moduleId: module.id
})
export class AppComponent {

    constructor(iconRegistry: MdIconRegistry,
                sanitizer: DomSanitizer) {

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
