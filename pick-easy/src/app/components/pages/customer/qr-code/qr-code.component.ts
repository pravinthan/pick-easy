import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

// Values used to identify individual achievement QR codes
export type QRCodeAchievementData = {
  customerId: string;
  restaurantId: string;
  restaurantAchievementId: string;
};

// Values used to identify individual reward QR codes
export type QRCodeRewardData = {
  customerId: string;
  restaurantId: string;
  customerRewardId: string;
};

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.component.html",
  styleUrls: ["./qr-code.component.css"],
})

// creates the actual QR code to be displayed
export class QRCodeComponent {
  qrCodeData: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: QRCodeAchievementData | QRCodeRewardData
  ) {
    this.qrCodeData = JSON.stringify(data);
  }
}
