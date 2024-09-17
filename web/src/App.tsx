import { useState } from "react";
import { NavTabs, TabConfig } from "./components/NavTabs";
import { Feedback } from "./Feedback";
import { Groups } from "./Groups";
import { FilterMenu } from "./FilterMenu";
import { filterObjectArray } from "../../shared/types";

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

function App() {
  const [selectedTab, setSelectedTab] = useState("feedback");
  const [filterObjectArray, setFilterObjectArray] = useState<filterObjectArray>(
    [{ selections: [], index: 0, not: false }]
  );
  const [resultsCount, setResultsCount] = useState<number | null>(null);

  // NEXT TODO: create filter object which makes requests to the backend - that way the same filter does not have to make two different calls to the backend just because it is represented as a different filterObjectArray each time

  // NEXT TODO: implement this filter calculation in a custom hook called useFilter

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
          resultsCount={resultsCount}
        />
        {selectedTab === "feedback" ? (
          <Feedback
            filterObjectArray={filterObjectArray}
            setResultsCount={setResultsCount}
          />
        ) : (
          <Groups
            filterObjectArray={filterObjectArray}
            setResultsCount={setResultsCount}
          />
        )}
      </div>
    </div>
  );
}

export default App;
