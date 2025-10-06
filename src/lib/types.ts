export type Range = {
  from: number;
  to: number;
};

export type StepResult = "less" | "greater" | "correct";

export interface StepLogEntry {
  step: number;
  before: Range;
  guess: number;
  result: StepResult;
};
