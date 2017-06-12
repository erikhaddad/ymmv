import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-flights-stats',
  templateUrl: './user-flights-stats.component.html',
  styleUrls: ['./user-flights-stats.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserFlightsStatsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
