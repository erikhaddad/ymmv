import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-flights-table',
  templateUrl: './user-flights-table.component.html',
  styleUrls: ['./user-flights-table.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserFlightsTableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
