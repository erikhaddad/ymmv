export interface IAirline {
    $key?: string;

    iata: string;
    name: string;
}
export class Airline implements IAirline {
    iata: string;
    name: string;
}

export interface IAirport {
    $key?: string;

    id: string;
    code: string;
    name: string;
    latitude: string;
    longitude: string;
    timezone: string;
    dst_indicator: string;
    city: string;
    country: string;
    country_code: string;
    region: string;
    listing_display: string;
    pseudonyms: string;
}
export class Airport implements IAirport {
    id: string;
    code: string;
    name: string;
    latitude: string;
    longitude: string;
    timezone: string;
    dst_indicator: string;
    city: string;
    country: string;
    country_code: string;
    region: string;
    listing_display: string;
    pseudonyms: string;
}


export interface ICountry {
    $key?: string;

    code: string;
    name: string;
}
export class Country implements ICountry {
    code: string;
    name: string;
}

export interface IFare {
    $key?: string;

    award: string;
    code: string;
    description: string;
    order: string;
    pqm: string;
    pqs: string;
}
export class Fare implements IFare {
    award: string;
    code: string;
    description: string;
    order: string;
    pqm: string;
    pqs: string;
}

export interface IAirportLite {
    airport: string;
    datetime: string;
}

export interface IFlight {
    $key?: string;

    airline: string;

    departure: IAirportLite;
    arrival: IAirportLite;

    miles: number; // 4321
    cost: number; // 123
    flightNumber: number; // 59

    seatClass: string;
    purpose: string; // business or pleasure or mixed
}
export class Flight implements IFlight {
    airline: string;

    departure: IAirportLite;
    arrival: IAirportLite;

    miles: number; // 4321
    cost: number; // 123
    flightNumber: number; // 59

    seatClass: string;
    purpose: string; // business or pleasure or mixed
}


export interface IUser {
    $key?: string; // user-id
    id: string; // The id of the user.
    name: string; // The display name of the user.
    email: string; // Email address of the user.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long user has been away
    notifications: INotification[];
    preferences: IUserPreferences;
}
export class User implements IUser {
    id: string; // The id of the user.
    name: string; // The display name of the user.
    email: string; // Email address of the user.
    avatar: string; // URL of avatar image
    createdAt: string; // Online or how long user has been away
    notifications: Notification[];
    preferences: IUserPreferences;
}

export enum Languages {
    English = 0,
    Spanish = 1,
    Portuguese = 2,
    German = 3
}

export interface ILanguage {
    id: number;
    abbreviation: string;
    name: string;
}

export enum Themes {
    Light = 0,
    Dark = 1
}

export interface IUserPreferences {
    language: number;
    moderate: boolean;
    theme: number;
}

export interface INotification {
    $key?: string;
    fromUserId: string;
}
export class Notification implements INotification {
    fromUserId: string;
}

export interface IUserStatsTotals {
    airlines: number;
    airports: number;
    cost: number;
    days: number;
    domestic: number;
    international: number;
    miles: number;
    flights: number;
}
