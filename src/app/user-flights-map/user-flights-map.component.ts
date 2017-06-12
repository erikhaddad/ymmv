import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-flights-map',
  templateUrl: './user-flights-map.component.html',
  styleUrls: ['./user-flights-map.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserFlightsMapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
