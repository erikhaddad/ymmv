import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightsComponent } from './user-flights.component';

describe('UserFlightsComponent', () => {
  let component: UserFlightsComponent;
  let fixture: ComponentFixture<UserFlightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFlightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
