import { Component, OnInit } from '@angular/core';
import { Restaurant } from "../../shared/models/restaurant.model";


@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent {
  restaurants: Restaurant[] = [
    {
      _id: "11",
      name: "Kinton Ramen",
      description: "This is Kinton Ramen",
      rating: 1,
      cost: 1,
      cuisine: "Japanese",
    },
    {
      _id: "12",
      name: "Panda Express",
      description: "This is panda express",
      rating: 3,
      cost: 2,
      cuisine: "Chinese",
    },
    {
      _id: "13",
      name: "KFC",
      description: "This is kfc",
      rating: 4,
      cost: 3,
      cuisine: "American",
    },
  ];
}
