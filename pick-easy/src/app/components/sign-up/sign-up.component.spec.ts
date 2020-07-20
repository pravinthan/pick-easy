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

  /* component should be created so not be falsy */
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  /* firstNameInput.maxLength should only accept strings of 20 characters or less */
  it("should check to see if the firstName input only accepts strings of < 20 characters", () => {
    expect(firstNameInput.maxLength).toEqual(20);
  });

  /* firstNameInput.minLength should only accept strings of 1 characters or more */
  it("should check to see if the firstName input only accepts strings of > 1 characters", () => {
    expect(firstNameInput.minLength).toEqual(1);
  });

  /* firstNameInput.pattern should only accept strings that are alphanumeric characters */
  it("should check to see if the firstName input only accepts alphabetical characters", () => {
    expect(firstNameInput.pattern).toEqual("[a-zA-Z]+");
  });

  /* lastNameInput.maxLength should only accept strings of 20 characters or less */
  it("should check to see if the lastName input only accepts strings of < 20 characters", () => {
    expect(lastNameInput.maxLength).toEqual(20);
  });

  /* lastNameInput.minLength should only accept strings of 1 characters or more */
  it("should check to see if the lastName input only accepts strings of > 1 characters", () => {
    expect(lastNameInput.minLength).toEqual(1);
  });

  /* lastNameInput.pattern should only accept strings that are alphanumeric characters */
  it("should check to see if the lastName input only accepts alphabetical characters", () => {
    expect(lastNameInput.pattern).toEqual("[a-zA-Z]+");
  });

  /* usernameInput.maxLength should only accept strings of 20 characters or less */
  it("should check to see if the username input only accepts strings of < 20 characters", () => {
    expect(usernameInput.maxLength).toEqual(20);
  });

  /* usernameInput.minLength should only accept strings of 3 characters or more */
  it("should check to see if the username input only accepts strings of > 3 characters", () => {
    expect(usernameInput.minLength).toEqual(3);
  });

  /* usernameInput.pattern should only accept strings that are alphanumeric characters */
  it("should check to see if the username input only accepts alphanumeric characters", () => {
    expect(usernameInput.pattern).toEqual("[a-zA-Z0-9]+");
  });

  /* passwordInput.maxLength should only accept strings of 20 characters or less */
  it("should check to see if the password input only accepts strings of < 20 characters", () => {
    expect(passwordInput.maxLength).toEqual(20);
  });

  /* passwordInput.minLength should only accept strings of 8 characters or more */
  it("should check to see if the password input only accepts strings of > 8 characters", () => {
    expect(passwordInput.minLength).toEqual(8);
  });
});
