import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../common/layout.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    moduleId: module.id
})
export class LoadingComponent implements OnInit {

    constructor(public layoutService: LayoutService) {

    }

    ngOnInit() {
        this.layoutService.handleSectionId('loading');
        this.layoutService.handleShowToolbar(false);
        this.layoutService.handleShowNav(false);
        this.layoutService.handleShowFab(false);
    }
}
