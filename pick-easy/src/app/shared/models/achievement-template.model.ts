export class AchievementTemplate {
  _id: string;
  templateNumber: number;
  content: string;
  value: string;
  variables: AchievementTemplateVariable[];
  repeatable: boolean;
}

export type AchievementTemplateVariable = {
  variableDescription: string;
  variableType: string;
};
