import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightsStatsComponent } from './user-flights-stats.component';

describe('UserFlightsStatsComponent', () => {
  let component: UserFlightsStatsComponent;
  let fixture: ComponentFixture<UserFlightsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFlightsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
