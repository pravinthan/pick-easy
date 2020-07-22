import { Component, Inject } from "@angular/core";
import { QRCodeAchievementData } from "../../customer/qr-code/qr-code.component";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";
import { CustomerService } from "src/app/shared/customer.service";

@Component({
  selector: "app-scan-qr-code",
  templateUrl: "./scan-qr-code.component.html",
  styleUrls: ["./scan-qr-code.component.css"],
})
export class ScanQrCodeComponent {
  availableDevices: MediaDeviceInfo[];
  deviceSelect = "none";
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  nextUpdateAllowed = true;

  constructor(
    private customerService: CustomerService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = devices && devices.length > 0;
    this.deviceSelect = devices[0]?.deviceId;
  }

  onCodeResult(scannedString: string) {
    if (!this.nextUpdateAllowed) return;

    let parsedObj: any;
    try {
      parsedObj = JSON.parse(scannedString);
    } catch (error) {
      return;
    }

    if (parsedObj.restaurantId && parsedObj.customerId) {
      // Achievement QR Code
      if (parsedObj.restaurantAchievementId) {
        let {
          customerId,
          restaurantId,
          restaurantAchievementId,
        }: QRCodeAchievementData = parsedObj;

        this.customerService
          .progressAchievement(
            customerId,
            restaurantId,
            restaurantAchievementId
          )
          .toPromise()
          .then(() => {
            this.notyf.success("Scanned successfully!");
          });

        this.nextUpdateAllowed = false;

        // Wait 5 seconds before allowing another scan
        setTimeout(() => {
          this.nextUpdateAllowed = true;
        }, 5000);
      } else if (parsedObj.restaurantRewardId) {
        // Reward QR Code
      }
    } else return;
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(
      (device) => device.deviceId === selected
    );
    this.currentDevice = device || null;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
}
