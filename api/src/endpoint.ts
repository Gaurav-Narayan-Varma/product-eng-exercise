import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import json from "./data.json";
import {
  FeedbackData,
  FeedbackGroup,
  filterObjectArray,
} from "../../shared/types";
import { groupFeedbackWithAI } from "./aiService";

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
  let filterObjectArray: filterObjectArray = req.body.query;

  let filteredFeedback = filterFeedback(feedback, filterObjectArray);

  res.status(200).json({ data: filteredFeedback });
}

// In memory cache for grouping consistency
// Would be replaced with a Redis cache in a production setting
const feedbackCache: Record<string, FeedbackGroup[]> = {};

async function groupHandler(
  req: Request,
  res: Response<{ data: FeedbackGroup[] }>
) {
  const filterObjectArray = req.body.query;

  const filteredFeedback = filterFeedback(feedback, filterObjectArray);

  // Create a unique key for the filtered feedback
  const cacheKey = JSON.stringify(filteredFeedback);

  // Check if the result is already cached
  if (feedbackCache[cacheKey]) {
    return res.status(200).json({
      data: feedbackCache[cacheKey],
    });
  }

  /**
   * TODO(part-2): Implement filtering + grouping
   */
  const groupedFeedback = await groupFeedbackWithAI(filteredFeedback);

  // Cache the result
  feedbackCache[cacheKey] = groupedFeedback;

  res.status(200).json({
    data: groupedFeedback,
  });
}

function filterFeedback(
  feedback: FeedbackData,
  filterObjectArray: filterObjectArray
): FeedbackData {
  const validFilters = filterObjectArray.filter((filterObject) => {
    return filterObject.label !== undefined && filterObject.label !== "";
  });

  if (validFilters.length === 0) return feedback;

  return feedback.filter((item) => {
    return validFilters.every((filterObject) => {
      const matches = (value: string) =>
        filterObject.selections.includes(value);
      const contentMatches = (content: string) =>
        item.description.toLowerCase().includes(content.toLowerCase()) ||
        item.name.toLowerCase().includes(content.toLowerCase());

      if (filterObject.label === "Importance") {
        return filterObject.not
          ? !matches(item.importance)
          : matches(item.importance);
      } else if (filterObject.label === "Type") {
        return filterObject.not ? !matches(item.type) : matches(item.type);
      } else if (filterObject.label === "Customer") {
        return filterObject.not
          ? !matches(item.customer)
          : matches(item.customer);
      } else if (filterObject.label === "Content") {
        return filterObject.not
          ? !filterObject.selections.some(contentMatches)
          : filterObject.selections.some(contentMatches);
      } else if (filterObject.label === "Created date") {
        let dateLimit: Date;

        if (!daysMapping.hasOwnProperty(filterObject.selections[0])) {
          dateLimit = new Date(filterObject.selections[0]);
        } else {
          const now = new Date();
          const daysAgo = daysMapping[filterObject.selections[0]];
          dateLimit = new Date(now.setDate(now.getDate() - daysAgo));
        }

        return filterObject.not
          ? new Date(item.date) < dateLimit
          : new Date(item.date) >= dateLimit;
      }
      return true;
    });
  });
}
