import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFlightsTableComponent } from './user-flights-table.component';

describe('UserFlightsTableComponent', () => {
  let component: UserFlightsTableComponent;
  let fixture: ComponentFixture<UserFlightsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFlightsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFlightsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
