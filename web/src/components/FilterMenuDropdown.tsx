import React, { useEffect, useRef, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { HiOutlineCube } from "react-icons/hi";
import { HiOutlineUser } from "react-icons/hi";
import { PiTextTBold } from "react-icons/pi";
import { HiCalendar } from "react-icons/hi2";
import { IconType } from "react-icons";
import { filterObjectArray } from "../../shared/types";

type DropdownItems = {
  string: {
    Icon: IconType;
    selections?: string[];
  };
};

const dropdownItems: DropdownItems = {
  Importance: {
    Icon: HiOutlineExclamationCircle,
    selections: ["Low", "Medium", "High"],
  },
  Type: {
    Icon: HiOutlineCube,
    selections: ["Research", "Sales", "Customer"],
  },
  Customer: {
    Icon: HiOutlineUser,
    selections: ["Loom", "Ramp", "Brex", "Vanta", "Notion", "OpenAI", "Linear"],
  },
  Content: { Icon: PiTextTBold },
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
  filterMenuDropdownRef: React.RefObject<HTMLDivElement>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsContentFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filterObjectArray: filterObjectArray;
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObjectArray>>;
  isLast: boolean;
  isFilter: boolean;
  selectedLabel: string;
  setSelectedLabel: React.Dispatch<React.SetStateAction<string>>;
}

export const FilterMenuDropdown = ({
  isDropdownOpen,
  setIsDropdownOpen,
  setIsContentFilterOpen,
  setIsDatePickerOpen,
  filterMenuDropdownRef,
  filterObjectArray,
  setFilterObjectArray,
  isLast,
  isFilter,
  selectedLabel,
  setSelectedLabel,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log("is this a filter?", isFilter);
    console.log("isdropdown state changes:", isDropdownOpen);
  }, [isDropdownOpen]);

  useEffect(() => {
    // When dropdown opens, focus on input
    if (isDropdownOpen) {
      console.log("isDropdownOpen condition true hit");
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // setIsVisible(true);
    } else {
      console.log("isDropdownOpen condition false hit");
      // setIsVisible(false);
      setSelectedLabel(null);
      setSearchTerm("");
    }
  }, [isDropdownOpen]);

  const handleLabelClick = (label: string) => {
    setSelectedLabel(label);
    setSearchTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectionChange = (selection: string) => {
    if (!selectedLabel) return;

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
      setIsDropdownOpen(false);

      return;
    }

    if (selection === "Custom date or timeframe...") {
      setIsDropdownOpen(false);
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

  const shouldShowDropdown = () => {
    // SelectionMode: when the user is actively modifying the latest filter
    const isSelectionMode = filterObjectArray.at(-1)?.label !== undefined;

    return (
      isDropdownOpen &&
      ((isLast && isSelectionMode) || (isFilter && !isSelectionMode))
    );
  };

  if (!shouldShowDropdown()) {
    return null;
  }

  return (
    <div
      ref={filterMenuDropdownRef}
      className={`absolute top-0 ${
        selectedLabel && "top-7"
      } left-0 w-[240px] bg-white border-[0.5px] border-gray-200 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out ${
        isDropdownOpen
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-2"
      }`}
    >
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
                onClick={() => handleSelectionChange(selection)}
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
                    setIsDropdownOpen(false);
                    setIsContentFilterOpen(true);
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
