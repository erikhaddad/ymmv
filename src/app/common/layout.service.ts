import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LayoutService {

    private _sectionId = 'Overview';

    private _navExpandedState: boolean;
    private _navShowState: boolean;
    private _darkThemeState: boolean;

    // Observable boolean sources
    private expandedAnnouncedSource = new Subject<boolean>();
    private showAnnouncedSource = new Subject<boolean>();
    private darkThemeAnnouncedSource = new Subject<boolean>();

    // Observable boolean streams
    expandedAnnounced$ = this.expandedAnnouncedSource.asObservable();
    showAnnounced$ = this.showAnnouncedSource.asObservable();
    darkThemeAnnounced$ = this.darkThemeAnnouncedSource.asObservable();

    constructor() {
        this._navExpandedState = true;
        this._navShowState = true;
        this._darkThemeState = true;
    }

    // Service message commands
    handleExpandedNav(expanded: boolean) {
        this.navExpandedState = expanded;
        this.expandedAnnouncedSource.next(expanded);
    }

    handleShowNav(show: boolean) {
        this.navShowState = show;
        this.showAnnouncedSource.next(show);
    }

    // Getters and setters
    get sectionId(): string {
        return this._sectionId;
    }

    set sectionId(value: string) {
        this._sectionId = value;
    }

    // nav expanded state
    get navExpandedState(): boolean {
        return this._navExpandedState;
    }

    set navExpandedState(value: boolean) {
        this._navExpandedState = value;
    }

    // nav show state
    get navShowState(): boolean {
        return this._navShowState;
    }

    set navShowState(value: boolean) {
        this._navShowState = value;
    }

    // dark theme state
    get darkThemeState(): boolean {
        return this._darkThemeState;
    }

    set darkThemeState(value: boolean) {
        this._darkThemeState = value;
    }
}
