import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {AuthService} from '../auth/auth.service';
import {IAirport, IAirline, ICountry, IFare, IUser, IFlight, User, Flight} from './data-model';

import * as firebase from 'firebase';

@Injectable()
export class DataService {
    private airlinesPath: string;
    private airportsPath: string;
    private countriesPath: string;
    private faresPath: string;
    private loyaltyPath: string;
    private mealsPath: string;
    private userFlightsPath: string;
    private usersPath: string;

    constructor(private afd: AngularFireDatabase, private auth: AuthService) {
        this.airlinesPath = '/airlines';
        this.airportsPath = '/airports';
        this.countriesPath = '/countries';
        this.faresPath = '/fares';
        this.loyaltyPath = '/loyalty';
        this.mealsPath = '/meals';
        this.usersPath = '/users';
        this.userFlightsPath = '/user-flights';
    }

    get users(): FirebaseListObservable<IUser[]> {
        return this.afd.list(this.usersPath);
    }

    get airlines(): FirebaseListObservable<IAirline[]> {
        return this.afd.list(this.airlinesPath);
    }

    get airports(): FirebaseListObservable<IAirport[]> {
        return this.afd.list(this.airportsPath);
    }

    get loyalty(): FirebaseListObservable<any[]> {
        return this.afd.list(this.loyaltyPath);
    }

    get meals(): FirebaseObjectObservable<any> {
        return this.afd.object(this.mealsPath);
    }

    get countries(): FirebaseListObservable<ICountry[]> {
        return this.afd.list(this.countriesPath);
    }

    get fares(): FirebaseListObservable<IFare[]> {
        return this.afd.list(this.faresPath);
    }

    getUserFlights(id: string): FirebaseListObservable<IFlight[]> {
        return this.afd.list(`${this.userFlightsPath}/${id}`);
    }

    /*
    getAirlineByCode(code: string): any {
        return this.afd.object(`${this.airlinesPath}/${code}`).take(1);
    }

    getAirportByCode(code: string): any {
        return this.afd.object(`${this.airportsPath}/${code}`).take(1);
    }
    */

    /** USERS **/
    createUser(user: User): firebase.Promise<any> {
        return this.afd.list(this.usersPath).push(user);
    }
    getUser(userId: string): FirebaseObjectObservable<IUser> {
        return this.afd.object(this.usersPath + '/' + userId);
    }
    removeUser(user: IUser): firebase.Promise<any> {
        return this.afd.list(this.usersPath).remove(user.$key);
    }
    updateUser(user: IUser): firebase.Promise<any> {
        const path = this.usersPath + '/' + user.$key;
        console.log('user update path', path);
        console.log('user update value', user);
        return this.afd.list(this.usersPath).update(user.$key, user);
    }

    /** FLIGHTS **/
    createUserFlight(id: string, flight: Flight): firebase.Promise<any> {
        return this.afd.list(`${this.userFlightsPath}/${id}`).push(flight);
    }
}
