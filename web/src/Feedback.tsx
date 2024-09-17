import { FeedbackDataTable } from "./components/FeedbackDataTable";
import { useFeedbackQuery } from "./hooks";
import { filterObjectArray } from "../../shared/types";
import { useEffect } from "react";

type Props = {
  filterObjectArray: filterObjectArray;
  setResultsCount: React.Dispatch<React.SetStateAction<number | null>>;
};

export function Feedback({ filterObjectArray, setResultsCount }: Props) {
  const { data: feedbackData, isLoading } = useFeedbackQuery(filterObjectArray);

  useEffect(() => {
    if (feedbackData) {
      setResultsCount(feedbackData.data.length);
    }
  }, [feedbackData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return feedbackData?.data ? (
    <FeedbackDataTable data={feedbackData.data} />
  ) : null;
}
