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
  // Class-level variables
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
    // Get the achievement templates
    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));

    // Get the restaurant staff's restaurant object
    this.restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => {
        this.restaurant = restaurant;
        this.achievements = restaurant.achievements;
      });
  }

  /* Function that adds an achievement to the achievements array given that its not repeatable */
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

  /* Function that gets the template object given its template number */
  getTemplateByNumber(templateNumber: number): AchievementTemplate {
    return this.templates.find(
      (template) => template.templateNumber == templateNumber
    );
  }

  /* Function that gets the first restaurant achievement object given its template number */
  getFirstAchievementByTemplateNumber(
    templateNumber: number
  ): RestaurantAchievement {
    return this.achievements.find(
      (achievement) => achievement.templateNumber == templateNumber
    );
  }

  /* Function that removes an achievement from the achievement array given itself and its index */
  removeAchievement(achievement: RestaurantAchievement, index: number) {
    this.achievements.splice(index, 1);

    if (!this.getTemplateByNumber(achievement.templateNumber).repeatable) {
      this.templatePicker.options.find(
        (option) => option.value == achievement.templateNumber
      ).disabled = false;
    }
  }

  /* Function that validates and saves the achievements */
  saveAchievements() {
    if (this.elem.nativeElement.querySelectorAll(".ng-invalid").length > 0) {
      this.notyf.error("Invalid input(s)");
      return;
    }

    this.restaurantService
      .updateAchievements(
        this.restaurant._id,
        this.restaurant.numberOfTicketsForRedemption,
        this.achievements
      )
      .toPromise()
      .then(() => this.notyf.success("Saved successfully!"))
      .catch(() => this.notyf.error("An error occurred while saving"));
  }

  /* Function that filters the achievements array by the given template number */
  filterAchievementsByTemplate(templateNumber: number) {
    return this.achievements?.filter(
      (achievement) => achievement.templateNumber == templateNumber
    );
  }

  /* Function that returns the templates that are only used by the achievements array */
  filterTemplatesByAchievements() {
    return this.templates?.filter((template) =>
      this.achievements?.find(
        (achievement) => achievement.templateNumber == template.templateNumber
      )
    );
  }

  /* Function that returns the index of a given achievement given its index and its template number */
  calculateIndex(templateNumber: number, index: number) {
    this.achievements.sort((a, b) => a.templateNumber - b.templateNumber);
    for (let i = 0; i < templateNumber; i++) {
      index += this.filterAchievementsByTemplate(i).length;
    }
    return index;
  }
}
