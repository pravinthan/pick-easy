import { Component, Inject } from "@angular/core";
import {
  Restaurant,
  RestaurantReward,
  RestaurantRewardLevel,
} from "src/app/shared/models/restaurant.model";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RewardTemplate } from "src/app/shared/models/reward-template.model";
import { TemplateService } from "src/app/shared/template.service";

@Component({
  selector: "app-reward-pool",
  templateUrl: "./reward-pool.component.html",
  styleUrls: ["./reward-pool.component.css"],
})
export class RewardPoolComponent {
  templates: RewardTemplate[];
  levels: RestaurantRewardLevel[] = [
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
  ];

  constructor(
    private templateService: TemplateService,
    @Inject(MAT_DIALOG_DATA)
    public data: { restaurant: Restaurant; level: RestaurantRewardLevel }
  ) {
    this.templateService
      .getRewardTemplates()
      .toPromise()
      .then((templates) => {
        this.templates = templates;
      });
  }

  /* Returns the reward template given a template number */
  getTemplateByNumber(templateNumber: number): RewardTemplate {
    return this.templates?.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  /* Given a restaurant reward, converts it to text by replacing the variable with a string */
  restaurantRewardToText(restaurantReward: RestaurantReward) {
    let rewardWithVariables = this.getTemplateByNumber(
      restaurantReward.templateNumber
    )?.value;
    for (const achievementVariable of restaurantReward.variables) {
      rewardWithVariables = rewardWithVariables?.replace(
        ":variable",
        achievementVariable
      );
    }

    return rewardWithVariables;
  }

  /* Given a level, returns a list of rewards of only that level */
  filterRewardsByLevel(level: RestaurantRewardLevel) {
    return this.data.restaurant.rewards?.filter(
      (reward) => reward.level == level
    );
  }

  /* Returns list of levels only in the rewards of the restaurant. E.g. if there are no
     diamond rewards created then the list won't return diamond */
  filterLevelsByRewards() {
    return this.levels.filter((level) =>
      this.data.restaurant.rewards?.find((reward) => reward.level == level)
    );
  }

  /* Given a customer level and a reward level, returns true if customerLevel is "greater than
     or equal to" reward level. E.g. withinLevel("Bronze", "Silver") => False */
  withinLevel(
    customerLevel: RestaurantRewardLevel,
    rewardLevel: RestaurantRewardLevel
  ) {
    if (rewardLevel == "Bronze") return true;
    if (!customerLevel) return false;
    if (rewardLevel == "Silver")
      return customerLevel == "Bronze" ? false : true;
    if (rewardLevel == "Gold")
      return customerLevel == "Bronze" || customerLevel == "Silver"
        ? false
        : true;
    if (rewardLevel == "Platinum")
      return customerLevel == "Platinum" || customerLevel == "Diamond"
        ? true
        : false;
    if (rewardLevel == "Diamond")
      return customerLevel == "Diamond" ? true : false;
  }
}
