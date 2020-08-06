import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "history-dialog",
  templateUrl: "./history-dialog.component.html",
  styleUrls: ["./history-dialog.component.css"],
})
export class HistoryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { reward: string }) {}
}
