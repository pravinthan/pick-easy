import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanQrCodeComponent } from './scan-qr-code.component';

describe('ScanQrCodeComponent', () => {
  let component: ScanQrCodeComponent;
  let fixture: ComponentFixture<ScanQrCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanQrCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
