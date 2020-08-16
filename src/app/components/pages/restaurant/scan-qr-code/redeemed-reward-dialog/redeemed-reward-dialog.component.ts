import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-redeemed-reward-dialog",
  templateUrl: "./redeemed-reward-dialog.component.html",
  styleUrls: ["./redeemed-reward-dialog.component.css"],
})
// exports data needed to confirm a reward has been redeemed
export class RedeemedRewardDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { reward: string }) {}
}
