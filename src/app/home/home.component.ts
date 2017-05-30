import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {DataService} from '../common/data.service';
import {IUser} from '../common/data-model';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {Router} from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    moduleId: module.id
})
export class HomeComponent implements OnInit {

    currentUser$: FirebaseObjectObservable<IUser>;
    currentUser: IUser|null;

    constructor(public authService: AuthService,
                public dataService: DataService,
                private router: Router) {

        this.currentUser = null;
        authService.authState$.subscribe(authUser => {
            if (authUser != null) {
                this.currentUser$ = dataService.getUser(authUser.uid);
                this.currentUser$.subscribe(user => {
                    this.currentUser = user;
                });
            }
        });
    }

    ngOnInit() { }

    signInWithGoogle(): void {
        this.authService.signInWithGoogle()
            .then(() => this.postSignIn());
    }

    private postSignIn(): void {
        this.router.navigate(['/home']);
    }
}
