import { InjectionToken } from "@angular/core";
import { Notyf } from "notyf";

export const NOTYF = new InjectionToken<Notyf>("NotyfToken");

export function notyfFactory(): Notyf {
  return new Notyf({
    duration: 3000,
    dismissible: true,
    position: { x: "center", y: "bottom" },
  });
}
