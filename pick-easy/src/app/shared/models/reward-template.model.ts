export class RewardTemplate {
    _id: string;
    templateNumber: Number;
    content: String;
    value: String;
    variables: [{
        variableDescription: String;
        variableType: String;
      }
    ];
  };