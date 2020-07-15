import { Component, ViewChild, Inject, ElementRef } from "@angular/core";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  RestaurantAchievement,
  Restaurant,
} from "src/app/shared/models/restaurant.model";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatSelect } from "@angular/material/select";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-achievement-configurator",
  templateUrl: "./achievement-configurator.component.html",
  styleUrls: ["./achievement-configurator.component.css"],
})
export class AchievementConfiguratorComponent {
  @ViewChild("templatePicker") templatePicker: MatSelect;
  templates: AchievementTemplate[];
  achievements: RestaurantAchievement[] = [];
  restaurant: Restaurant;

  constructor(
    private templateService: TemplateService,
    private restaurantService: RestaurantService,
    @Inject(NOTYF) private notyf: Notyf,
    @Inject(DOCUMENT) public document: Document,
    private elem: ElementRef
  ) {
    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    this.restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => {
        this.restaurant = restaurant;
        this.achievements = restaurant.achievements;
      });
  }

  addAchievement(templateNumber: number) {
    let template = this.getTemplateByNumber(templateNumber);

    if (!template.repeatable) {
      this.templatePicker.options.find(
        (option) => option.value == templateNumber
      ).disabled = true;
    }

    this.achievements.push({
      templateNumber,
      numberOfTickets: 1,
      variables: Array<string>(template.variables.length).fill(""),
    });

    this.templatePicker.writeValue(null);
  }

  getTemplateByNumber(templateNumber: number): AchievementTemplate {
    return this.templates.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  getFirstAchievementByTemplateNumber(
    templateNumber: number
  ): RestaurantAchievement {
    return this.achievements.find(
      (achievement) => achievement.templateNumber == templateNumber
    );
  }

  removeAchievement(achievement: RestaurantAchievement, index: number) {
    this.achievements.splice(index, 1);

    if (!this.getTemplateByNumber(achievement.templateNumber).repeatable) {
      this.templatePicker.options.find(
        (option) => option.value == achievement.templateNumber
      ).disabled = false;
    }
  }

  saveAchievements() {
    if (this.elem.nativeElement.querySelectorAll(".ng-invalid").length > 0) {
      this.notyf.error("Invalid input(s)");
      return;
    }

    this.restaurantService
      .updateAchievements(
        this.restaurant._id,
        this.restaurant.numberOfTicketsForReward,
        this.achievements
      )
      .toPromise()
      .then(() => this.notyf.success("Saved successfully!"))
      .catch(() => this.notyf.error("An error occurred while saving"));
  }
}
