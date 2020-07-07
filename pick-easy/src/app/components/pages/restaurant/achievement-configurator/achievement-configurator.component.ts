import { Component, ViewChild } from "@angular/core";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  RestaurantAchievement,
  Restaurant,
} from "src/app/shared/models/restaurant.model";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "app-achievement-configurator",
  templateUrl: "./achievement-configurator.component.html",
  styleUrls: ["./achievement-configurator.component.css"],
})
export class AchievementConfiguratorComponent {
  @ViewChild("templatePicker") templatePicker: MatSelect;
  templates: AchievementTemplate[];
  achievements: RestaurantAchievement[] = [];
  myRestaurant: Restaurant;

  constructor(
    templateService: TemplateService,
    restaurantService: RestaurantService
  ) {
    templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => (this.myRestaurant = restaurant));
  }

  addAchievement(templateId: string) {
    let template = this.getTemplateById(templateId);

    if (!template.repeatable) {
      this.templatePicker.options.find(
        (option) => option.value == templateId
      ).disabled = true;
    }

    this.achievements.push({
      templateId,
      numberOfStamps: 0,
      variables: Array<string>(template.variables.length).fill(""),
    });
  }

  getTemplateById(templateId: string): AchievementTemplate {
    return this.templates.find((template) => template._id == templateId);
  }
}
