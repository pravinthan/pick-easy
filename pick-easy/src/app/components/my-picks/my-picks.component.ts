import { Component, OnInit } from '@angular/core';
import { restuarant } from "./restuarants";
import { RESTUARANTS  } from './mock-restuarants';
@Component({
  selector: 'app-my-picks',
  templateUrl: './my-picks.component.html',
  styleUrls: ['./my-picks.component.css']
})
export class MyPicksComponent implements OnInit {

  constructor() { }
  restuarants:any[] = RESTUARANTS;
  ngOnInit(): void {
  }

}
