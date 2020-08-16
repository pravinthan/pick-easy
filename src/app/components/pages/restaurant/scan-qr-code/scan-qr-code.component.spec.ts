import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ScanQRCodeComponent } from "./scan-qr-code.component";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
import { MatSortModule } from "@angular/material/sort";

describe("ScanQRCodeComponent", () => {
  let component: ScanQRCodeComponent;
  let fixture: ComponentFixture<ScanQRCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScanQRCodeComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgxMatFileInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatSortModule,
      ],
      providers: [
        { provide: NOTYF, useValue: NOTYF },
        { provide: MAT_DIALOG_DATA, useValue: MAT_DIALOG_DATA },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Description: This unit test checks if the component is created
   * Expected Outcome: Component is created
   * Risk Rating: Improbable x Critical
   */
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /**
   * Description: This unit test checks if the default selected device is "none" and current device is null
   * Expected Outcome: Default selected device is "none" and current device is null
   * Risk Rating: Occasional x Negligible
   */
  it("should check to see if default selected device is none and current device is null", () => {
    expect(component.deviceSelect).toEqual("none");
    expect(component.currentDevice).toEqual(null);
  });

  /**
   * Description: This unit test checks if the displayed columns for the achievement log table is correct and in order
   * Expected Outcome: The displayed columns for the achievement log table is correct and in order
   * Risk Rating: Improbable x Negligible
   */
  it("should check to see if achievement log table is in the correct order", () => {
    expect(component.achievementLogDisplayedColumns).toEqual([
      "timeOfScan",
      "customerName",
      "achievement",
      "progress",
    ]);
  });

  /**
   * Description: This unit test checks if the displayed columns for the reward log table is correct and in order
   * Expected Outcome: The displayed columns for the reward log table is correct and in order
   * Risk Rating: Improbable x Negligible
   */
  it("should check to see if reward log table is in the correct order", () => {
    expect(component.rewardLogDisplayedColumns).toEqual([
      "timeOfScan",
      "customerName",
      "reward",
    ]);
  });
});
