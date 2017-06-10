import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardingPassComponent } from './boarding-pass.component';

describe('BoardingPassComponent', () => {
  let component: BoardingPassComponent;
  let fixture: ComponentFixture<BoardingPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardingPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardingPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
