import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetFlightComponent } from './set-flight.component';

describe('SetFlightComponent', () => {
  let component: SetFlightComponent;
  let fixture: ComponentFixture<SetFlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetFlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
