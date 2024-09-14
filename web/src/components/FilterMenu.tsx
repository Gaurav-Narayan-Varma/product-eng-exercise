import { useState, useRef, useEffect } from "react";
import { LuListFilter } from "react-icons/lu";
import { FilterMenuDropdown } from "./FilterMenuDropdown";
import { filterObject } from "../App";
import { HiOutlineX } from "react-icons/hi";

interface Props {
  filterObjectArray: filterObject[];
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObject[]>>;
}

export function FilterMenu({ filterObjectArray, setFilterObjectArray }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //   TODO: Refactor name to selectedDropdownItem
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  //   TODO: Remove debug
  //   debug
  useEffect(() => {
    console.log("filter object array:", filterObjectArray);
  }, [filterObjectArray]);

  useEffect(() => {
    // TODO: Everytime click is outside dropdown, it adds a new filter object even if the user did not add any selections - need to fix
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close dropdown when clicking outside
        setIsOpen(false);

        // TODO: Remove console log
        //   Save checked selections when clicking outside
        console.log("filter object array on click outside:", filterObjectArray);

        setFilterObjectArray((prevArray) => [
          ...prevArray,
          {
            selections: [],
            index:
              prevArray.length === 0
                ? 0
                : prevArray[prevArray.length - 1].index + 1,
          },
        ]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRemovingFilter = (index: number) => {
    console.log("index in handleRemovingFilter", index);
    setFilterObjectArray((prev) =>
      prev.filter((filterObject) => filterObject.index !== index)
    );
  };

  return (
    <div className="relative flex gap-x-[6px]">
      {filterObjectArray
        .filter((filterObject) => filterObject.label)
        .map((filterObject) => (
          <div key={filterObject.index} className="flex gap-x-[1px]">
            <div className="flex items-center bg-gray-100 rounded-l-md px-2 py-1 text-xs">
              <div className="font-semibold">{`${filterObject.label}:`}</div>
              <div className="ml-1">{filterObject.selections.join(", ")}</div>
            </div>
            <div
              className="text-xs font-semibold rounded-r-md bg-gray-100 flex items-center justify-center px-[6px]"
              onClick={() => handleRemovingFilter(filterObject.index)}
            >
              <HiOutlineX className="h-[14px] w-[14px]" />
            </div>
          </div>
        ))}
      <button
        className={`flex items-center gap-x-2 px-2 rounded-[5px] hover:bg-gray-100 hover:cursor-default w-[71px] h-[24px] ${
          isOpen && "bg-gray-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <LuListFilter />
        <span className="text-xs font-semibold">Filter</span>
      </button>
      <FilterMenuDropdown
        dropdownRef={dropdownRef}
        isOpen={isOpen}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        filterObjectArray={filterObjectArray}
        setFilterObjectArray={setFilterObjectArray}
      />
    </div>
  );
}
