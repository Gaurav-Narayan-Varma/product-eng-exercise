import React, { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineCube } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import { PiTextTBold } from "react-icons/pi";
import { HiCalendar } from "react-icons/hi2";
import { IconType } from "react-icons";
import { filterObject } from "../App";

type DropdownItem = {
  Icon: IconType;
  selections?: string[];
};

const dropdownItems: Record<string, DropdownItem> = {
  Importance: {
    Icon: HiOutlineExclamationCircle,
    selections: ["Low", "Medium", "High"],
  },
  Type: {
    Icon: HiOutlineCube,
    selections: ["Research", "Sales", "Customer"],
  },
  // TODO: Fetch customers from backend instead of hardcoding
  Customer: {
    Icon: HiOutlineUser,
    selections: ["Loom", "Ramp", "Brex", "Vanta", "Notion", "OpenAI", "Linear"],
  },
  Content: { Icon: PiTextTBold },
  //   NOTE: Linear has partially dynamic selection i.e. it will remove selections if none of the tickets match the selection, but won't create new selections for tickets which go out of bounds
  "Created date": {
    Icon: HiCalendar,
    selections: [
      "1 day ago",
      "3 days ago",
      "1 week ago",
      "1 month ago",
      "3 months ago",
      "Custom date or timeframe...",
    ],
  },
};

interface Props {
  dropdownRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLabel: string | null;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string | null>>;
  filterObjectArray: filterObject[];
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObject[]>>;
}

// TODO: Show issues grayed out to the right of the selection
// TODO: Have the dropdown menu track the filter icon when opened
// TODO: Create NOT statement for filter
// TODO: Refactor to own component and then use again in FilterMenu
// TODO: Add clear button to clear filters
// TODO: Pressing escape should close dropdown
// TODO: Down arrow should focus next item (and vice versa)
export const FilterMenuDropdown = ({
  isOpen,
  setIsOpen,
  setIsDialogOpen,
  setIsDatePickerOpen,
  dropdownRef,
  selectedLabel,
  setSelectedLabel,
  filterObjectArray,
  setFilterObjectArray,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  //   TODO: Potentially optimize useEffect and handlers by bringing them up to FilterMenu
  // Focus on the input when the dropdown is open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Reset the dropdown when it is closed
    if (!isOpen) {
      setSelectedLabel(null);
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleLabelClick = (label: string) => {
    setSelectedLabel(label);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // TODO: Rename to handleSelectionChange
  const handleCheckboxChange = (selection: string) => {
    if (!selectedLabel) return;

    // If the label selected is created date then set the selection on the current object, close the dropdown, and create the next filter object
    if (
      selectedLabel === "Created date" &&
      selection !== "Custom date or timeframe..."
    ) {
      setFilterObjectArray((prev) => {
        const currentFilterObject = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          {
            ...currentFilterObject,
            label: selectedLabel,
            selections: [selection],
          },
          {
            selections: [],
            index: prev.length === 0 ? 0 : prev[prev.length - 1].index + 1,
          },
        ];
      });
      setIsOpen(false);

      return;
    }

    if (selection === "Custom date or timeframe...") {
      setIsOpen(false);
      setIsDatePickerOpen(true);
      return;
    }

    setFilterObjectArray((prev) => {
      const currentFilterObject = prev[prev.length - 1];
      const alreadySelected =
        currentFilterObject.selections.includes(selection);
      return [
        ...prev.slice(0, -1),
        {
          ...currentFilterObject,
          label: selectedLabel,
          selections: alreadySelected
            ? currentFilterObject.selections.filter((s) => s !== selection)
            : [...currentFilterObject.selections, selection],
        },
      ];
    });
  };

  const filteredDropdownItems = Object.entries(dropdownItems).reduce(
    (acc, [label, details]) => {
      if (label.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[label] = details;
      }
      return acc;
    },
    {} as Record<string, DropdownItem>
  );

  const filteredSelections =
    selectedLabel && dropdownItems[selectedLabel].selections
      ? dropdownItems[selectedLabel].selections.filter((selection) =>
          selection.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      //   TODO: Add transition to top
      className={`absolute top-0 ${
        selectedLabel && "top-7"
      } left-0 w-[240px] bg-white border-[0.5px] border-gray-200 rounded-lg shadow-lg z-50`}
    >
      {/* TODO: Make Input Area Larger (so the cursor should flip to line over larger area)/ Mimic Linear */}
      {/* TODO: if user enters text which does not match anything fix UI so it looks like Linear */}
      <div className="flex">
        <input
          ref={inputRef}
          type="text"
          placeholder={selectedLabel ? `${selectedLabel}` : "Filter..."}
          className="mt-[10px] mb-[9px] mx-[14px] h-[17px] w-[183px] focus:outline-none text-[13px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center justify-center border-[0.5px] border-gray-400 rounded-sm font-medium text-[11px] w-3 h-3 p-2 mr-3 self-center text-gray-400">
          F
        </div>
      </div>
      <hr className="pb-[5px]" />
      <section className="px-1 pb-1">
        {selectedLabel
          ? filteredSelections.map((selection) => (
              <div
                key={selection}
                className="hover:bg-gray-100 rounded-md px-[10px] h-8 flex items-center text-[13px] hover:cursor-default"
                onClick={() => handleCheckboxChange(selection)}
              >
                {["Importance", "Type", "Customer"].includes(selectedLabel) && (
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={
                      filterObjectArray.length > 0 &&
                      filterObjectArray[
                        filterObjectArray.length - 1
                      ].selections.includes(selection)
                    }
                    onChange={() => {}}
                  />
                )}
                {selection}
              </div>
            ))
          : Object.entries(filteredDropdownItems).map(([label, Details]) => (
              <div
                key={label}
                className="hover:bg-gray-100 rounded-md hover:cursor-default px-[10px] h-8 flex items-center text-[13px]"
                onClick={() => {
                  if (label === "Content") {
                    setIsOpen(false);
                    setIsDialogOpen(true);
                  } else {
                    handleLabelClick(label);
                  }
                }}
              >
                <Details.Icon className="mr-2 h-4 w-4" />
                {label}
              </div>
            ))}
      </section>
    </div>
  );
};
