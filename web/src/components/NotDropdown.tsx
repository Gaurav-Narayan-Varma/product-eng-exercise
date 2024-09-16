import { HiPlus } from "react-icons/hi";
import { MdOutlineBlock } from "react-icons/md";
import { useState } from "react";
import { filterObjectArray } from "../../shared/types";

type Props = {
  notDropdownRef: (el: HTMLDivElement | null) => void;
  isNotDropdownOpen: boolean;
  setIsNotDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex: number | null;
  filterObjectIndex: number;
  filterObjectArray: filterObjectArray;
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObjectArray>>;
};

export function NotDropdown({
  isNotDropdownOpen,
  setIsNotDropdownOpen,
  selectedIndex,
  filterObjectArray,
  filterObjectIndex,
  setFilterObjectArray,
  notDropdownRef,
}: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleNotSelectionClick = (isNot: boolean) => {
    // Update the filter objects not property
    setFilterObjectArray((prevArray) => {
      let updatedArray = [...prevArray];
      updatedArray = updatedArray.map((filterObject) => {
        if (filterObject.index === filterObjectIndex) {
          filterObject.not = isNot;
          return filterObject;
        } else return filterObject;
      });

      return updatedArray;
    });
    setIsNotDropdownOpen(false);
  };

  if (!isNotDropdownOpen || selectedIndex !== filterObjectIndex) return null;

  return (
    <div
      ref={notDropdownRef}
      className="absolute top-7 border-[0.5px] border-gray-200 rounded-lg shadow-lg z-50 bg-white p-1"
    >
      <div
        className={`hover:bg-gray-100 rounded-md hover:cursor-default px-[14px] w-[86px] h-8 flex items-center text-[13px] gap-x-2 ${
          highlightedIndex === 0 ? "bg-gray-200" : ""
        }`}
        onMouseEnter={() => setHighlightedIndex(0)}
        onClick={() => handleNotSelectionClick(false)}
      >
        <HiPlus className="w-4 h-4" />
        <div>is</div>
      </div>
      <div
        className={`hover:bg-gray-100 rounded-md hover:cursor-default px-[14px] w-[86px] h-8 flex items-center text-[13px] gap-x-2 ${
          highlightedIndex === 1 ? "bg-gray-200" : ""
        }`}
        onMouseEnter={() => setHighlightedIndex(1)}
        onClick={() => handleNotSelectionClick(true)}
      >
        <MdOutlineBlock className="w-4 h-4" />
        <div>is not</div>
      </div>
    </div>
  );
}
