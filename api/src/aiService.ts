import { FeedbackData, FeedbackGroup } from "../../shared/types";
import OpenAI from "openai";

type FeedbackGroupByIndex = {
  name: string;
  description: string;
  items: number[];
};

export async function groupFeedbackWithAI(
  feedbackData: FeedbackData
): Promise<FeedbackGroup[]> {
  const feedbackDescriptions = feedbackData
    .map((item, index) => `${index + 1}. ${item.name} - ${item.description}`)
    .join("\n");

  const prompt = `
    You are an AI assistant tasked with categorizing customer feedback into meaningful groups based on their content. Below are several pieces of feedback provided by customers. Your goal is to analyze them and group them into categories that reflect similar themes or issues.
  
    Please provide a list of groups, where each group contains a name that summarizes the theme, a description of the theme, and a list of the indexes of the feedback items that belong to that group.
  
    Please provide the output in the following format:
  
    [
      {
        "name": "Group Name",
        "description": "Group Description",
        "items": [1, 2, 3]
      }
    ]
    `;

  const groupedFeedback = await getGroupedFeedback(
    prompt,
    feedbackDescriptions,
    feedbackData
  );

  // Check for uncategorized feedback items
  // This is a common issue, occurring in over 90% of cases
  const missingNumbers = findMissingNumbers(
    groupedFeedback,
    feedbackData.length,
    feedbackData
  );

  // If uncategorized items exist, reprocess them
  if (missingNumbers.length > 0) {
    const uncategorizedItemsPrompt = `The following item(s) are not categorized: 
    
    [${missingNumbers.map((i) => JSON.stringify(feedbackData[i - 1]))}]. 
    
    Please include it in one of the categories or create new ones if they can't be fit in any of the existing categories.

    Please provide the output in the following format:
  
    [
      {
        "name": "Group Name",
        "description": "Group Description",
        "items": [1, 2, 3]
      }
    ]`;

    return await getGroupedFeedback(
      uncategorizedItemsPrompt,
      JSON.stringify(groupedFeedback),
      feedbackData
    );
  }

  return groupedFeedback;
}

async function getGroupedFeedback(
  prompt: string,
  context: string,
  feedbackData: FeedbackData
): Promise<FeedbackGroup[]> {
  const response = await callAIModel(`${prompt}\n\n${context}`);
  const jsonString = response.choices[0].message.content.match(/\[.*\]/s)?.[0];
  if (!jsonString) throw new Error("Invalid AI response format");

  const parsedGroupedFeedback: FeedbackGroupByIndex[] = JSON.parse(jsonString);

  return parsedGroupedFeedback.map((group) => ({
    name: group.name,
    description: group.description,
    feedback: group.items.map((item) => feedbackData[item - 1]),
  }));
}

async function callAIModel(input: string): Promise<any> {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: input }],
    });

    return completion;
  } catch (error) {
    console.error("Error calling AI model:", error);
    throw error;
  }
}

function findMissingNumbers(
  groupedFeedback: FeedbackGroup[],
  totalItems: number,
  feedbackData: FeedbackData
): number[] {
  const numSet = new Set(
    groupedFeedback.flatMap((group) =>
      group.feedback.map((item) => feedbackData.indexOf(item) + 1)
    )
  );
  return Array.from({ length: totalItems }, (_, i) => i + 1).filter(
    (num) => !numSet.has(num)
  );
}
