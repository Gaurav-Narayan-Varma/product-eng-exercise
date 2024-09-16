import cx from "classnames";
import { useEffect, useState } from "react";
import { FeedbackGroup } from "../../shared/types";
import { DataTable } from "./DataTable";

const importanceValue = {
  High: 2,
  Medium: 1,
  Low: 0,
} as const;

export function GroupsDataTable({ data }: { data: FeedbackGroup[] }) {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [dataKey, setDataKey] = useState(0); // Add a key state

  useEffect(() => {
    // Update key to force re-render
    setDataKey((prev) => prev + 1);
  }, [data, selectedGroupIndex]);

  return (
    <div className=" hide-scroll-bar flex h-full w-full align-top">
      <div
        className="hide-scroll-bar h-full overflow-y-auto border-[0.5px] border-gray-200"
        style={{ width: 500 }}
      >
        {data.map((group, index) => (
          <div
            key={`grouped-feedback-${index}`}
            onMouseDown={() => setSelectedGroupIndex(index)}
            className={cx(
              " border-b-[0.5px] border-gray-200 px-6 py-4 hover:cursor-default",
              {
                "bg-primary-action-light": selectedGroupIndex === index,
                "hover:bg-hover-gray": selectedGroupIndex !== index,
              }
            )}
          >
            <div className="mb-2 text-base font-semibold">{group.name}</div>
            <div className="text-sm text-gray-500">{group.description}</div>
          </div>
        ))}
      </div>
      <div className="bg-dusty-white w-full flex-1 p-4">
        <DataTable
          key={dataKey} // Use the key to force re-render
          fullWidth
          data={(data[selectedGroupIndex]?.feedback ?? [])
            .sort(
              (a, b) =>
                importanceValue[b.importance] - importanceValue[a.importance]
            )
            .map((feedback) => {
              return {
                id: feedback.id,
                name: feedback.name,
                description: feedback.description,
                importance: feedback.importance,
                customerName: feedback.customer,
                date: feedback.date,
                type: feedback.type,
              };
            })}
          schema={[
            {
              headerName: "Description",
              cellRenderer: (row) => (
                <div className="py-3">
                  <div className="font-semibold">{row.name}</div>
                </div>
              ),
            },
            {
              headerName: "Priority",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">
                  {row.importance}
                </div>
              ),
            },
            {
              headerName: "Type",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">{row.type}</div>
              ),
            },
            {
              headerName: "Customer",
              cellRenderer: (row) => (
                <div className="whitespace-nowrap text-sm">
                  {row.customerName}
                </div>
              ),
            },
            {
              headerName: "Date",
              cellRenderer: (row) =>
                row.date ? (
                  <div className="whitespace-nowrap text-sm">
                    {new Date(row.date).toLocaleDateString()}
                  </div>
                ) : undefined,
            },
          ]}
        />
      </div>
    </div>
  );
}
