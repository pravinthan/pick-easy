export class AchievementTemplate {
  _id: string;
  content: string;
  value: string;
  variables: [
    {
      variableDescription: string;
      variableType: string;
    }
  ];
  repeatable: boolean;
}
