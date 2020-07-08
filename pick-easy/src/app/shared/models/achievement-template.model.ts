export class AchievementTemplate {
  _id: string;
  templateNumber: number;
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
