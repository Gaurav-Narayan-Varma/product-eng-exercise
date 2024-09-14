import { useEffect, useState } from "react";
import { NavTabs, TabConfig } from "./components/NavTabs";
import { Feedback } from "./Feedback";
import { Groups } from "./Groups";
import { FilterMenu } from "./components/FilterMenu";

export const TabsConfig: TabConfig = {
  feedback: {
    id: "feedback",
    name: "Feedback",
  },
  groups: {
    id: "groups",
    name: "Groups",
  },
};

export type filterObject = {
  label?: string;
  selections: string[];
  index: number;
};

function App() {
  const [selectedTab, setSelectedTab] = useState("feedback");
  const [filterObjectArray, setFilterObjectArray] = useState<filterObject[]>([
    { selections: [], index: 0 },
  ]);

  // TODO: Remove debug
  useEffect(() => {
    console.log("filterObjectArray in App.tsx:", filterObjectArray);
  }, [filterObjectArray]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-5/6 h-4/5 flex flex-col gap-y-3">
        <NavTabs
          config={TabsConfig}
          tabOrder={["feedback", "groups"]}
          onTabClicked={(tabId) => {
            setSelectedTab(tabId);
          }}
          selectedTab={selectedTab}
        />
        {/**
         * TODO(part-1): Add filter options
         */}
        <FilterMenu
          filterObjectArray={filterObjectArray}
          setFilterObjectArray={setFilterObjectArray}
        />
        {selectedTab === "feedback" ? (
          <Feedback filterObjectArray={filterObjectArray} />
        ) : (
          <Groups filters={{}} />
        )}
      </div>
    </div>
  );
}

export default App;
