import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RewardTemplate } from "./models/reward-template.model";
import { AchievementTemplate } from "./models/achievement-template.model";

@Injectable({ providedIn: "root" })
export class TemplateService {
  constructor(private http: HttpClient) {}

  getRewardTemplates(): Observable<RewardTemplate[]> {
    return this.http.get<RewardTemplate[]>(`/api/templates/rewards`);
  }
  
  getAchievementTemplates(): Observable<AchievementTemplate[]> {
    return this.http.get<AchievementTemplate[]>(`/api/templates/achievements`);
  }
}
