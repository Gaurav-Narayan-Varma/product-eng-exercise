import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import json from "./data.json";

type Feedback = {
  id: number;
  name: string;
  description: string;
  importance: "High" | "Medium" | "Low";
  type: "Sales" | "Customer" | "Research";
  customer: "Loom" | "Ramp" | "Brex" | "Vanta" | "Notion" | "Linear" | "OpenAI";
  date: string;
};

type FeedbackData = Feedback[];

type filterObject = {
  label?: string;
  selections: string[];
  index: number;
};

const daysMapping: Record<string, number> = {
  "1 day ago": 1,
  "3 days ago": 3,
  "1 week ago": 7,
  "1 month ago": 30,
  "3 months ago": 90,
};

export const router = express.Router();
router.use(bodyParser.json());

router.post("/query", queryHandler);
router.post("/groups", groupHandler);

const feedback: FeedbackData = json as any;

function queryHandler(req: Request, res: Response<{ data: FeedbackData }>) {
  const { query } = req.body;
  const filterObjectArray = query.filterObjectArray;

  console.log(
    "filterObjectArray in endpoint before validation",
    filterObjectArray
  );

  const validFilters = filterObjectArray.filter(
    (filterObject: filterObject) => {
      return filterObject.label !== undefined && filterObject.label !== "";
    }
  );

  console.log("filterObjectArray in endpoint", filterObjectArray);

  let filteredFeedback = feedback;

  if (validFilters && validFilters.length > 0) {
    filteredFeedback = feedback.filter((item) => {
      return validFilters.every((filterObject: filterObject) => {
        if (filterObject.label === "Importance") {
          return filterObject.selections.includes(item.importance);
        } else if (filterObject.label === "Type") {
          return filterObject.selections.includes(item.type);
        } else if (filterObject.label === "Customer") {
          return filterObject.selections.includes(item.customer);
        } else if (filterObject.label === "Content") {
          return filterObject.selections.some(
            (content) =>
              item.description.toLowerCase().includes(content.toLowerCase()) ||
              item.name.toLowerCase().includes(content.toLowerCase())
          );
        } else if (filterObject.label === "Created date") {
          let dateLimit: Date;

          if (!daysMapping.hasOwnProperty(filterObject.selections[0])) {
            dateLimit = new Date(filterObject.selections[0]);
          } else {
            const now = new Date();
            const daysAgo = daysMapping[filterObject.selections[0]];
            dateLimit = new Date(now.setDate(now.getDate() - daysAgo));
          }

          return new Date(item.date) >= dateLimit;
        }
        return true;
      });
    });
  }

  console.log("filteredFeedback", filteredFeedback);

  res.status(200).json({ data: filteredFeedback });
}

type FeedbackGroup = {
  name: string;
  feedback: Feedback[];
};

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const body = req;

  /**
   * TODO(part-2): Implement filtering + grouping
   */

  res.status(200).json({
    data: [
      {
        name: "All feedback",
        feedback: feedback,
      },
    ],
  });
}
