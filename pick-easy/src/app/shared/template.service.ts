import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AchievementTemplate } from "./models/achievement-template.model";

@Injectable({ providedIn: "root" })
export class TemplateService {
  constructor(private http: HttpClient) {}

  getAchievementTemplates(): Observable<AchievementTemplate[]> {
    return this.http.get<AchievementTemplate[]>(`/api/templates/achievements`);
  }
}
