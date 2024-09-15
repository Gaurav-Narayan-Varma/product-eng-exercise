import { GroupsDataTable } from "./components/GroupsDataTable";
import { useGroupsQuery } from "./hooks";
import { filterObject } from "./App";

type Props = {
  filterObjectArray: filterObject[];
};

export function Groups({ filterObjectArray }: Props) {
  const dataReq = useGroupsQuery({
    filterObjectArray,
  });

  if (dataReq.isLoading || !dataReq.data) {
    return <div>Loading...</div>;
  }

  return <GroupsDataTable data={dataReq.data.data} />;
}
