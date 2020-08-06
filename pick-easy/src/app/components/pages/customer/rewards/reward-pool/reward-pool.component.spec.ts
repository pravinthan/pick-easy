import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardPoolComponent } from './reward-pool.component';

describe('RewardPoolComponent', () => {
  let component: RewardPoolComponent;
  let fixture: ComponentFixture<RewardPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardPoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
