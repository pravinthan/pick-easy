import { Component, ViewChild, Inject, ElementRef } from "@angular/core";
import { RewardTemplate } from "src/app/shared/models/reward-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  Restaurant,
  RestaurantReward,
  RestaurantRewardLevel,
  RestaurantRewardWeight,
} from "src/app/shared/models/restaurant.model";
import { MatSelect } from "@angular/material/select";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";

@Component({
  selector: "app-reward-configurator",
  templateUrl: "./reward-configurator.component.html",
  styleUrls: ["./reward-configurator.component.css"],
})
export class RewardConfiguratorComponent {
  // Class-level variables
  @ViewChild("templatePicker") templatePicker: MatSelect;
  templates: RewardTemplate[];
  rewards: RestaurantReward[] = [];
  restaurant: Restaurant;
  levels: RestaurantRewardLevel[] = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
  ];
  rewardWeight: RestaurantRewardWeight;

  constructor(
    private templateService: TemplateService,
    private restaurantService: RestaurantService,
    @Inject(NOTYF) private notyf: Notyf,
    private elem: ElementRef
  ) {
    // Get the reward templates
    this.templateService
      .getRewardTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    // Get the restaurant staff's restaurant object
    this.restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => {
        this.restaurant = restaurant;
        this.rewards = restaurant.rewards;
        this.rewardWeight = restaurant.rewardWeight;
      });
  }

  /* Function that gets the template object given its template number */
  getTemplateByNumber(templateNumber: number): RewardTemplate {
    return this.templates?.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  /* Function returns a boolean indicating if there are rewards in this.rewards that are the given level */
  areAnyRewardsOfLevel(level: RestaurantRewardLevel) {
    return !!this.rewards?.find((reward) => reward.level == level);
  }

  /* Function that adds a reward to the rewards array given */
  addReward(templateNumber: number) {
    const template = this.getTemplateByNumber(templateNumber);

    this.rewards.push({
      templateNumber,
      variables: Array<string>(template.variables.length).fill(""),
      level: "Bronze",
    });

    this.templatePicker.writeValue(null);
  }

  /* Function that removes a reward from the rewards array given its index */
  deleteReward(index: number) {
    this.rewards.splice(index, 1);
  }

  /* Function that validates and saves the rewards */
  saveRewards() {
    if (this.elem.nativeElement.querySelectorAll(".ng-invalid").length > 0) {
      this.notyf.error("Invalid input(s)");
      return;
    }

    this.levels.forEach((level) => {
      if (!this.areAnyRewardsOfLevel(level)) {
        this.rewardWeight[level.toLowerCase()] = 0;
      }
    });

    if (
      this.rewardWeight.bronze +
        this.rewardWeight.silver +
        this.rewardWeight.gold +
        this.rewardWeight.platinum +
        this.rewardWeight.diamond !=
      100
    ) {
      this.notyf.error("Reward weights should add up to 100%");
      return;
    }

    this.restaurantService
      .updateRewards(this.restaurant._id, this.rewards)
      .toPromise()
      .then(() => {
        return this.restaurantService
          .updateRestaurantRewardWeight(this.restaurant._id, this.rewardWeight)
          .toPromise();
      })
      .then(() => this.notyf.success("Saved successfully!"))
      .catch(() => this.notyf.error("An error occurred while saving"));
  }

  /* Function that filters the rewards array by the given level */
  filterRewardsByLevel(level: RestaurantRewardLevel) {
    return this.rewards?.filter((reward) => reward.level == level);
  }

  /* Function that filters the level array to include level that exist in the rewards array */
  filterLevelsByRewards() {
    return this.levels.filter((level) =>
      this.rewards?.find((reward) => reward.level == level)
    );
  }

  /* Function that returns the index of a given reward given its index and its template number */
  calculateIndex(level: RestaurantRewardLevel, index: number) {
    this.rewards.sort(
      (a, b) => this.levels.indexOf(a.level) - this.levels.indexOf(b.level)
    );
    for (let i = 0; i < this.levels.indexOf(level); i++) {
      index += this.filterRewardsByLevel(this.levels[i]).length;
    }
    return index;
  }
}
