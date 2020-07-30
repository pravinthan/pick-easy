import { Component, ViewChild, Inject, ElementRef } from "@angular/core";
import { RewardTemplate } from "src/app/shared/models/reward-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  Restaurant,
  RestaurantReward,
  RestaurantRewardLevel,
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

  constructor(
    private templateService: TemplateService,
    private restaurantService: RestaurantService,
    @Inject(NOTYF) private notyf: Notyf,
    private elem: ElementRef
  ) {
    this.templateService
      .getRewardTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    this.restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => {
        this.restaurant = restaurant;
        this.rewards = restaurant.rewards;
      });
  }

  getTemplateByNumber(templateNumber: number): RewardTemplate {
    return this.templates.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  addReward(templateNumber: number) {
    const template = this.getTemplateByNumber(templateNumber);

    this.rewards.push({
      templateNumber,
      variables: Array<string>(template.variables.length).fill(""),
      level: "Bronze",
    });

    this.templatePicker.writeValue(null);
  }

  deleteReward(index: number) {
    this.rewards.splice(index, 1);
  }

  saveRewards() {
    if (this.elem.nativeElement.querySelectorAll(".ng-invalid").length > 0) {
      this.notyf.error("Invalid input(s)");
      return;
    }

    this.restaurantService
      .updateRewards(this.restaurant._id, this.rewards)
      .toPromise()
      .then(() => this.notyf.success("Saved successfully!"))
      .catch(() => this.notyf.error("An error occurred while saving"));
  }

  filterRewardsByLevel(level: RestaurantRewardLevel) {
    return this.rewards?.filter((reward) => reward.level == level);
  }

  filterLevelsByRewards() {
    return this.levels.filter((level) =>
      this.rewards?.find((reward) => reward.level == level)
    );
  }

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
