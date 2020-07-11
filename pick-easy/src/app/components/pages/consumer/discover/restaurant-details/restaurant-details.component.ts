import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Restaurant } from "src/app/shared/models/restaurant.model";
import { TemplateService } from "src/app/shared/template.service";
import { AchievementTemplate } from "src/app/shared/models/achievement-template.model";

@Component({
  selector: "app-restaurant-details",
  templateUrl: "./restaurant-details.component.html",
  styleUrls: ["./restaurant-details.component.css"],
})
export class RestaurantDetailsComponent {
  templates: AchievementTemplate[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { restaurant: Restaurant },
    private templateService: TemplateService
  ) {
    this.templateService
      .getAchievementTemplates()
      .toPromise()
      .then((templates) => (this.templates = templates));
  }

  getTemplateByNumber(templateNumber: number): AchievementTemplate {
    return this.templates.find(
      (template) => template.templateNumber == templateNumber
    );
  }
}
