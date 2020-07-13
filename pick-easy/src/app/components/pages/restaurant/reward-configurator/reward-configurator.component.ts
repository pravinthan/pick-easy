import { Component, ViewChild, Inject } from "@angular/core";
import { RewardTemplate } from "src/app/shared/models/reward-template.model";
import { TemplateService } from "src/app/shared/template.service";
import {
  Restaurant,
  RestaurantReward,
} from "src/app/shared/models/restaurant.model";
import { MatSelect } from "@angular/material/select";
import { RestaurantService } from "src/app/shared/restaurant.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';

export interface DialogData {
  templates: RewardTemplate[];
  variables: number[];
  levels: string[];
}

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

  constructor(
    public dialog: MatDialog,
    private templateService: TemplateService,
    private restaurantService: RestaurantService) {
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

    openAddDialog() {
      const dialogRef = this.dialog.open(RewardConfiguratorAddDialog, {
        width: '600px',
        data: {
          templates: this.templates,
          variables: new Array(),
          levels: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
        }
      });
      dialogRef.afterClosed().subscribe(result => {this.rewards.push(result);});
    }

    openEditDialog(index: number) {
      this.dialog.open(RewardConfiguratorEditDialog);
    }

    openDeleteDialog(index: number) {
      this.dialog.open(RewardConfiguratorDeleteDialog);
    }

    saveChanges() {
      this.restaurantService
      .updateRewards(
        this.myRestaurant._id,
        this.rewards,
      )
      .toPromise()
    }
}

@Component({
  selector: 'app-reward-configurator-dialog',
  templateUrl: './reward-configurator-add-dialog.html',
})
export class RewardConfiguratorAddDialog {
  constructor(
    public dialogRef: MatDialogRef<RewardConfiguratorAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'app-reward-configurator-dialog',
  templateUrl: './reward-configurator-edit-dialog.html',
})
export class RewardConfiguratorEditDialog {}

@Component({
  selector: 'app-reward-configurator-dialog',
  templateUrl: './reward-configurator-delete-dialog.html',
})
export class RewardConfiguratorDeleteDialog {}
