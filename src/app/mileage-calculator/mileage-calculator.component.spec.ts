import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MileageCalculatorComponent } from './mileage-calculator.component';

describe('MileageCalculatorComponent', () => {
  let component: MileageCalculatorComponent;
  let fixture: ComponentFixture<MileageCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MileageCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MileageCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
