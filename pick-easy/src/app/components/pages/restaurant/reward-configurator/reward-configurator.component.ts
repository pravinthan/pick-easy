import { Component, ViewChild, Inject, ElementRef } from "@angular/core";
import { RewardTemplate } from "src/app/shared/models/reward-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  Restaurant,
  RestaurantReward,
} from "src/app/shared/models/restaurant.model";
import { MatSelect } from "@angular/material/select";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";
import { FormControl, Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: "app-reward-configurator",
  templateUrl: "./reward-configurator.component.html",
  styleUrls: ["./reward-configurator.component.css"]
})
export class RewardConfiguratorComponent {
  @ViewChild("templatePicker") templatePicker: MatSelect;
  templates: RewardTemplate[];
  rewards: RestaurantReward[] = [];
  myRestaurant: Restaurant;
  levels: string[];
  percentControl: FormControl;
  numberControl: FormControl;

  constructor(
    private templateService: TemplateService,
    private restaurantService: RestaurantService,
    @Inject(NOTYF) private notyf: Notyf,
    private elem: ElementRef) {
      this.templateService
        .getRewardTemplates()
        .toPromise()
        .then((templates) => (this.templates = templates));
      this.restaurantService
        .getOwnRestaurant()
        .toPromise()
        .then((restaurant) => {
          this.myRestaurant = restaurant;
          this.rewards = restaurant.rewards;
      });
      this.levels = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
      this.percentControl = new FormControl("", [Validators.max(100), Validators.min(1)]);
      this.numberControl =  new FormControl("", [Validators.min(1)]);
    }

    getFormattedReward(reward: RestaurantReward) {
      const template = this.getTemplateByNumber(reward.templateNumber);
      // Splits content by "<...>" where ... is any chars
      const text = template.content.split('<').map(str => str.substring(str.indexOf('>') + 1));
      let formattedReward = "";
      for (let i = 0; i < text.length; i++)
        formattedReward += text[i] + (reward.variables[i] ? reward.variables[i] : "");
      return formattedReward;
    }

    getTemplateByNumber(templateNumber: number): RewardTemplate {
      return this.templates.find(
        (template) => template.templateNumber == templateNumber
      );
    }

    addReward(templateNumber: number) {
      const template = this.getTemplateByNumber(templateNumber);
      this.rewards?.push({
        templateNumber,
        variables: Array<string>(template.variables.length).fill(""),
        level: this.levels[0]
      });
      this.templatePicker.writeValue(null);
    }

    deleteReward(index: number) {
      typeof index == 'number' && this.rewards.splice(index, 1);
    }

    saveRewards() {
      if (this.elem.nativeElement.querySelectorAll(".ng-invalid").length > 0) {
        this.notyf.error("Invalid input(s)");
        return;
      }
      this.restaurantService
      .updateRewards(
        this.myRestaurant._id,
        this.rewards,
      )
      .toPromise()
      .then(() => this.notyf.success("Saved successfully!"))
      .catch(() => this.notyf.error("An error occurred while saving"));
    }
}