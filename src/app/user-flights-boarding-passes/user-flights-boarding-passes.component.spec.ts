import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightsBoardingPassesComponent } from './user-flights-boarding-passes.component';

describe('UserFlightsBoardingPassesComponent', () => {
  let component: UserFlightsBoardingPassesComponent;
  let fixture: ComponentFixture<UserFlightsBoardingPassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFlightsBoardingPassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightsBoardingPassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
