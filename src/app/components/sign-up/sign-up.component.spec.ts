import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SignUpComponent } from "./sign-up.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatInputModule } from "@angular/material/input";
import { By } from "@angular/platform-browser";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatFileInputModule } from "@angular-material-components/file-input";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("SignUpComponent", () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let firstNameInput: HTMLInputElement;
  let lastNameInput: HTMLInputElement;
  let usernameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        NgxMatFileInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [SignUpComponent],
      providers: [
        { provide: NOTYF, useValue: NOTYF },
        { provide: MAT_DIALOG_DATA, useValue: MAT_DIALOG_DATA },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    firstNameInput = fixture.debugElement.query(
      By.css("input[name='firstName']")
    ).nativeElement;

    lastNameInput = fixture.debugElement.query(By.css("input[name='lastName']"))
      .nativeElement;

    usernameInput = fixture.debugElement.query(By.css("input[name='username']"))
      .nativeElement;

    passwordInput = fixture.debugElement.query(By.css("input[name='password']"))
      .nativeElement;
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
   * Description: This unit test checks if the first name input is checking the user's input correctly
   * Expected Outcome: First name input checks the user's input correctly
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the firstName input is checking the user's input correctly", () => {
    expect(firstNameInput.maxLength).toEqual(20);
    expect(firstNameInput.minLength).toEqual(1);
    expect(firstNameInput.pattern).toEqual("[a-zA-Z]+");
  });

  /**
   * Description: This unit test checks if the last name input is checking the user's input correctly
   * Expected Outcome: Last name input checks the user's input correctly
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the lastName input is checking the user's input correctly", () => {
    expect(lastNameInput.maxLength).toEqual(20);
    expect(lastNameInput.minLength).toEqual(1);
    expect(lastNameInput.pattern).toEqual("[a-zA-Z]+");
  });

  /**
   * Description: This unit test checks if the username input is checking the user's input correctly
   * Expected Outcome: Username input checks the user's input correctly
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the username input is checking the user's input correctly", () => {
    expect(usernameInput.maxLength).toEqual(20);
    expect(usernameInput.minLength).toEqual(3);
    expect(usernameInput.pattern).toEqual("[a-zA-Z0-9]+");
  });

  /**
   * Description: This unit test checks if the password input is checking the user's input correctly
   * Expected Outcome: Password input checks the user's input correctly
   * Risk Rating: Improbable x Marginal
   */
  it("should check to see if the password input is checking the user's input correctly", () => {
    expect(passwordInput.maxLength).toEqual(20);
    expect(passwordInput.minLength).toEqual(8);
  });
});
