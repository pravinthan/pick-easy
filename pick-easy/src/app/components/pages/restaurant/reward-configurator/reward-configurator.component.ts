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
    openAddDialog() {
      const dialogRef = this.dialog.open(RewardConfiguratorAddDialog, {
        width: '600px',
        data: {
          templates: this.templates,
          variables: new Array(),
          levels: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"]
        }
      });
      console.log(this.myRestaurant);
      dialogRef.afterClosed().subscribe(result => {this.rewards.push(result);console.log(this.rewards)});
    }
    openEditDialog() {
      this.dialog.open(RewardConfiguratorEditDialog);
    }
    openDeleteDialog() {
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
