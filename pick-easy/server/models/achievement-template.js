let mongoose = require("mongoose");
const Schema = mongoose.Schema;

let achievementTemplateSchema = new Schema([
  {
    templateNumber: Number,
    content: String,
    value: String,
    variables: [
      {
        variableDescription: String,
        variableType: String,
        isProgressionVariable: {
          type: Boolean,
          default: false,
        },
      },
    ],
    repeatable: Boolean,
    typeOfAchievement: {
      type: String,
      enum: ["progress", "oneOff"],
    },
  },
]);

let AchievementTemplate = mongoose.model(
  "AchievementTemplate",
  achievementTemplateSchema,
  "achievement-templates"
);

// Put the templates in the database
(async () => {
  try {
    await AchievementTemplate.collection.drop();
  } catch (error) {}

  await AchievementTemplate.create([
    {
      templateNumber: 0,
      content: "Visit <number> time(s)",
      value: "Visit :variable time(s)",
      variables: [
        {
          variableDescription: "Number of times to visit",
          variableType: "number",
          isProgressionVariable: true,
        },
      ],
      repeatable: true,
      typeOfAchievement: "progress",
    },
    {
      templateNumber: 1,
      content: "Order <item> <number> time(s)",
      value: "Order :variable :variable time(s)",
      variables: [
        {
          variableDescription: "Restaurant menu item name",
          variableType: "string",
        },
        {
          variableDescription: "Number of times to order",
          variableType: "number",
          isProgressionVariable: true,
        },
      ],
      repeatable: true,
      typeOfAchievement: "progress",
    },
    {
      templateNumber: 2,
      content: "Visit as a group of <number> or more <number> time(s)",
      value: "Visit as a group of :variable or more :variable time(s)",
      variables: [
        {
          variableDescription: "Number of people in group",
          variableType: "number",
        },
        {
          variableDescription: "Number of times to visit",
          variableType: "number",
          isProgressionVariable: true,
        },
      ],
      repeatable: true,
      typeOfAchievement: "progress",
    },
    {
      templateNumber: 3,
      content: "Spend $<number> <number> time(s)",
      value: "Spend $:variable :variable time(s)",
      variables: [
        {
          variableDescription: "Required money to spend (in $)",
          variableType: "number",
        },
        {
          variableDescription: "Number of times to spend",
          variableType: "number",
          isProgressionVariable: true,
        },
      ],
      repeatable: true,
      typeOfAchievement: "progress",
    },
    {
      templateNumber: 4,
      content: "Write a review on a review site (e.g. Google, Yelp)",
      value: "Write a review on a review site (e.g. Google, Yelp)",
      variables: [],
      repeatable: false,
      typeOfAchievement: "oneOff",
    },
    {
      templateNumber: 5,
      content: "Share a picture of your meal on social media",
      value: "Share a picture of your meal on social media",
      variables: [],
      repeatable: false,
      typeOfAchievement: "oneOff",
    },
    {
      templateNumber: 6,
      content: "Like and follow on social media",
      value: "Like and follow on social media",
      variables: [],
      repeatable: false,
      typeOfAchievement: "oneOff",
    },
  ]);
})();
