const serverFunctionality = require("./server");
const { getQuestions, getEvaluation } = serverFunctionality;
let questions;
let evaluation;

beforeAll(async () => {
  questions = await getQuestions("javaScript", "novice", 5, "normal");
  evaluation = await getEvaluation(
    "What does let do in JavaScript?",
    "let is used to declare a variable in JavaScript. It is block scoped."
  );
});


test("Check if questions and evaluation variables are defined", () => {
  expect(questions).toBeDefined();
  expect(evaluation).toBeDefined();
});

jest.mock("./server", () => ({
  getEvaluation: jest.fn(() => ({
    error: "Invalid response from GPT. Please try again.",
  })),
  getQuestions: jest.fn(() => ({
    error: "Invalid response from GPT. Please try again.",
  })),
}));

test("getQuestions function gives error if API gives an invalid response", async () => {
  const response = await getQuestions("aws", "novice", 5, "master oogway");
  expect(response).toEqual({
    error: "Invalid response from GPT. Please try again.",
  });
});


test("getQuestions returns error when invalid parameters are provided", async () => {

  const response = await getQuestions(
    "invalidTopic",
    "invalidExpertise",
    0,
    "invalidStyle"
  );

  expect(response).toEqual({
    error: "Invalid response from GPT. Please try again.",
  });
});


test("Check if serverFunctions contain getQuestions and getEvaluation functions", () => {
  expect(serverFunctionality.getQuestions).toBeDefined();
  expect(serverFunctionality.getEvaluation).toBeDefined();
});

