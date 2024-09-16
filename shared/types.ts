export type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

export type FeedbackData = Feedback[];

export type FeedbackGroup = {
  name: string;
  description: string;
  feedback: Feedback[];
};

export type filterObject = {
  label?: string | null;
  selections: string[];
  not: boolean;
  index: number;
};

export type filterObjectArray = filterObject[];
