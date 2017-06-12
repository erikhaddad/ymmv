import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightsMapComponent } from './user-flights-map.component';

describe('UserFlightsMapComponent', () => {
  let component: UserFlightsMapComponent;
  let fixture: ComponentFixture<UserFlightsMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFlightsMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
