import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-flights-boarding-passes',
  templateUrl: './user-flights-boarding-passes.component.html',
  styleUrls: ['./user-flights-boarding-passes.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserFlightsBoardingPassesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
