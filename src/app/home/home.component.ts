import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {IUser} from '../common/data-model';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {Router} from '@angular/router';
import {LayoutService} from '../common/layout.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    moduleId: module.id
})
export class HomeComponent implements OnInit {

    authUser$: FirebaseObjectObservable<IUser>;
    authUser: IUser|null;

    constructor(public authService: AuthService,
                public dataService: DataService,
                public layoutService: LayoutService,
                private router: Router) {


        this.authUser = null;
        authService.authState$.subscribe(authUser => {
            if (authUser != null) {
                this.authUser$ = dataService.getUser(authUser.uid);
                this.authUser$.subscribe(user => {
                    this.authUser = user;
                });
            }
        });
    }

    ngOnInit() {
        this.layoutService.handleSectionId('home');
        this.layoutService.handleShowToolbar(false);
        this.layoutService.handleShowNav(false);
        this.layoutService.handleShowFab(false);
    }

    signInWithGoogle(): void {
        this.authService.signInWithGoogle()
            .then(() => this.postSignIn());
    }

    private postSignIn(): void {
        this.router.navigate(['/home']);
    }
}
