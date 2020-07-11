import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRestaurantComponent } from './my-restaurant.component';

describe('MyRestaurantComponent', () => {
  let component: MyRestaurantComponent;
  let fixture: ComponentFixture<MyRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
