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
          return filterObject.selections.some((content) =>
            item.description.toLowerCase().includes(content.toLowerCase())
          );
        } else if (filterObject.label === "Created date") {
          // Implement date filtering logic here
          // For simplicity, we'll just return true for now
          return true;
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

  const pythonRes = await fetch("http://127.0.0.1:8000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ feedback }),
  });

  const pythonData = (await pythonRes.json()) as { feedback: Feedback[] };

  res.status(200).json({
    data: [
      {
        name: "All feedback",
        feedback: pythonData.feedback,
      },
    ],
  });
}
