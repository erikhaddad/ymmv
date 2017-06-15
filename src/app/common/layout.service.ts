import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

const SCREEN_MOBILE = 'screen and (max-width: 600px)';

@Injectable()
export class LayoutService implements OnInit, OnDestroy {

    activeMediaQuery: string;
    watcher: Subscription;

    private _sectionId = 'Home';

    private _toolbarShowState: boolean;
    private _navShowState: boolean;
    private _fabShowState: boolean;
    private _mobileWidthState: boolean;

    // Observable boolean sources
    private showNavAnnouncedSource = new Subject<boolean>();
    private showToolbarAnnouncedSource = new Subject<boolean>();
    private showFabAnnouncedSource = new Subject<boolean>();
    private widthMobileAnnouncedSource = new Subject<boolean>();

    // Observable boolean streams
    showToolbarAnnounced$ = this.showToolbarAnnouncedSource.asObservable();
    showNavAnnounced$ = this.showNavAnnouncedSource.asObservable();
    showFabAnnounced$ = this.showFabAnnouncedSource.asObservable();
    widthMobileAnnounced$ = this.widthMobileAnnouncedSource.asObservable();

    constructor(public media: ObservableMedia) {
        this.activeMediaQuery = '';
        this.watcher = media.subscribe((change: MediaChange) => {
            this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
            if (change.mqAlias === 'xs' || change.mqAlias === 'sm') {
                this._mobileWidthState = true;
            }
        });

        this._toolbarShowState = false;
        this._navShowState = false;
        this._fabShowState = false;
    }

    ngOnInit() {
        if (this.media.isActive('xs') && this.media.isActive(SCREEN_MOBILE)) {
            this._mobileWidthState = true;
        }
    }

    ngOnDestroy() {
        this.watcher.unsubscribe();
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
    handleWidthMobile(isMobile: boolean) {
        this.mobileWidthState = isMobile;
        this.widthMobileAnnouncedSource.next(isMobile);
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

    get mobileWidthState(): boolean {
        return this._mobileWidthState;
    }

    set mobileWidthState(value: boolean) {
        this._mobileWidthState = value;
    }
}
