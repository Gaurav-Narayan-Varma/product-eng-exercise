import { FeedbackDataTable } from "./components/FeedbackDataTable";
import { useFeedbackQuery } from "./hooks";
import { filterObject } from "./App";
import { useEffect } from "react";

type Props = {
  filterObjectArray: filterObject[];
};

export function Feedback({ filterObjectArray }: Props) {
  const { data: feedbackData, isLoading } = useFeedbackQuery({
    filterObjectArray,
  });

  console.log("filterObjectArray in Feedback.tsx on change", filterObjectArray);
  console.log("feedbackData Feedback.tsx on change:", feedbackData?.data);

  useEffect(() => {
    console.log("feedbackData Feedback.tsx useEffect:", feedbackData?.data);
  }, [feedbackData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return feedbackData?.data ? (
    <FeedbackDataTable data={feedbackData.data} />
  ) : null;
}
