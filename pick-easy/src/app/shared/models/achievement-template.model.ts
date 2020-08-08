/* Achievement template to be used for creating achievements by restaurant
   staff and seeing achievements by customers. Templates are referenced by
   template number */
export class AchievementTemplate {
  _id: string;
  templateNumber: number;
  content: string;
  value: string;
  variables: AchievementTemplateVariable[];
  repeatable: boolean;
  typeOfAchievement: "progress" | "oneOff";
}

/*  */
export type AchievementTemplateVariable = {
  variableDescription: string;
  variableType: string;
  isProgressionVariable: boolean;
};
