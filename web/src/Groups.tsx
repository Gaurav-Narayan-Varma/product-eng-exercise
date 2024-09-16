import { GroupsDataTable } from "./components/GroupsDataTable";
import { useGroupsQuery } from "./hooks";
import { filterObjectArray } from "../../shared/types";
import { useEffect } from "react";

type Props = {
  filterObjectArray: filterObjectArray;
  setResultsCount: React.Dispatch<React.SetStateAction<number | null>>;
};

export function Groups({ filterObjectArray, setResultsCount }: Props) {
  const dataReq = useGroupsQuery({
    filterObjectArray,
  });

  useEffect(() => {
    if (dataReq.data?.data) {
      const uniqueFeedbackIds = new Set(
        dataReq.data.data.flatMap(
          (group) => group.feedback?.map((f) => f.id) ?? []
        )
      );
      setResultsCount(uniqueFeedbackIds.size);
    }
  }, [dataReq]);

  // Last operand makes sure data contains grouping objects
  if (dataReq.isLoading || !dataReq.data || !dataReq.data.data[0].feedback) {
    return (
      <div>
        Loading... This may take up to 25 seconds for initial data processing.
        Subsequent filters will be faster.
      </div>
    );
  }

  return <GroupsDataTable data={dataReq.data.data} />;
}
