import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LayoutService {

    private _sectionId = 'Home';

    private _toolbarShowState: boolean;
    private _navShowState: boolean;
    private _fabShowState: boolean;

    // Observable boolean sources
    private showNavAnnouncedSource = new Subject<boolean>();
    private showToolbarAnnouncedSource = new Subject<boolean>();
    private showFabAnnouncedSource = new Subject<boolean>();

    // Observable boolean streams
    showToolbarAnnounced$ = this.showToolbarAnnouncedSource.asObservable();
    showNavAnnounced$ = this.showNavAnnouncedSource.asObservable();
    showFabAnnounced$ = this.showFabAnnouncedSource.asObservable();

    constructor() {
        this._toolbarShowState = false;
        this._navShowState = false;
        this._fabShowState = false;
    }

    // Service message commands
    handleShowToolbar(show: boolean) {
        this.toolbarShowState = show;
        this.showToolbarAnnouncedSource.next(show);
    }
    handleShowNav(show: boolean) {
        this.navShowState = show;
        this.showNavAnnouncedSource.next(show);
    }
    handleShowFab(show: boolean) {
        this.fabShowState = show;
        this.showFabAnnouncedSource.next(show);
    }

    // section id
    get sectionId(): string {
        return this._sectionId;
    }

    set sectionId(value: string) {
        this._sectionId = value;
    }

    // toolbar state
    get toolbarShowState(): boolean {
        return this._toolbarShowState;
    }

    set toolbarShowState(value: boolean) {
        this._toolbarShowState = value;
    }

    // nav show state
    get navShowState(): boolean {
        return this._navShowState;
    }

    set navShowState(value: boolean) {
        this._navShowState = value;
    }

    // floating action button state
    get fabShowState(): boolean {
        return this._fabShowState;
    }

    set fabShowState(value: boolean) {
        this._fabShowState = value;
    }

}
