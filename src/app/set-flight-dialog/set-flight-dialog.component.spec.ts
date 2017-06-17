import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SetFlightDialogComponent} from './set-flight-dialog.component';

describe('SetFlightDialogComponent', () => {
    let component: SetFlightDialogComponent;
    let fixture: ComponentFixture<SetFlightDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SetFlightDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SetFlightDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
