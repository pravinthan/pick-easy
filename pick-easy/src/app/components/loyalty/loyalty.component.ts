import { Component, OnInit } from '@angular/core';
import { restuarant } from "./restuarants";
import { RESTUARANTS  } from './mock-restuarants';
@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.css']
})
export class LoyaltyComponent implements OnInit {

  constructor() { }
  restuarants:any[] = RESTUARANTS;
  ngOnInit(): void {
  }

}
