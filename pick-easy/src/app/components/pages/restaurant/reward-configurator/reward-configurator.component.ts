import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-reward-configurator",
  templateUrl: "./reward-configurator.component.html",
  styleUrls: ["./reward-configurator.component.css"]
})
export class RewardConfiguratorComponent {
  isLinear = true;
  constructor(public dialog: MatDialog) {}
  openAddDialog() {
    this.dialog.open(RewardConfiguratorAddDialog);
  }
  openEditDialog() {
    this.dialog.open(RewardConfiguratorEditDialog);
  }
  openDeleteDialog() {
    this.dialog.open(RewardConfiguratorDeleteDialog);
  }
}

@Component({
  selector: 'app-reward-configurator-dialog',
  templateUrl: './reward-configurator-add-dialog.html',
})
export class RewardConfiguratorAddDialog {}

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
