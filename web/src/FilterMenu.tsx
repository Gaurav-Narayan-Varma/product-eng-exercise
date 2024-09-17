import { useState, useRef, useEffect } from "react";
import { LuListFilter } from "react-icons/lu";
import { FilterMenuDropdown } from "./components/FilterMenuDropdown";
import { filterObjectArray } from "../../shared/types";
import { HiOutlineX } from "react-icons/hi";
import { ContentFilterDialog } from "./components/ContentFilterDialog";
import { DatePickerDialog } from "./components/DatePickerDialog";
import { NotDropdown } from "./components/NotDropdown";

interface Props {
  filterObjectArray: filterObjectArray;
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObjectArray>>;
  resultsCount: number | null;
}

export function FilterMenu({
  filterObjectArray,
  setFilterObjectArray,
  resultsCount,
}: Props) {
  const filterMenuDropdownRef = useRef<HTMLDivElement>(null);
  const notDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const notOptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotDropdownOpen, setIsNotDropdownOpen] = useState(false);
  const [isContentFilterOpen, setIsContentFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [contentFilterValue, setContentFilterValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If the click is outside filterMenuDropdown...
      if (
        filterMenuDropdownRef.current &&
        !filterMenuDropdownRef.current.contains(event.target as Node)
      ) {
        // Close dropdown
        setIsDropdownOpen(false);

        // If filter object has a LABEL, then keep it and create a new one
        const currentFilterObject =
          filterObjectArray[filterObjectArray.length - 1];

        if (currentFilterObject.label !== undefined) {
          setFilterObjectArray((prevArray) => [
            ...prevArray,
            {
              selections: [],
              index:
                prevArray.length === 0
                  ? 0
                  : prevArray[prevArray.length - 1].index + 1,
              not: false,
            },
          ]);
        }
      }

      // If the click is outside all NotDropdowns and is/not options on the pills
      const isOutsideAllNotDropdowns = notDropdownRefs.current.every((ref) => {
        if (!ref) return true;
        return ref && !ref.contains(event.target as Node);
      });
      const isOutsideAllNotOptions = notOptionRefs.current.every(
        (ref) => ref && !ref.contains(event.target as Node)
      );
      if (isOutsideAllNotDropdowns && isOutsideAllNotOptions) {
        setIsNotDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterObjectArray]);

  const handleRemovingFilter = (index: number) => {
    setFilterObjectArray((prev) =>
      prev.filter((filterObject) => filterObject.index !== index)
    );
  };

  const handleNotClick = (filterObjectIndex: number) => {
    setIsNotDropdownOpen((prev) => !prev);
    setSelectedIndex(filterObjectIndex);
  };

  const handleClearClick = () => {
    // Remove non-empty filter objects if there are any
    if (filterObjectArray.length > 1)
      setFilterObjectArray((prev) => prev.slice(prev.length - 1));
  };

  return (
    <div className="relative flex gap-x-[6px]">
      {filterObjectArray
        .filter((filterObject) => filterObject.label)
        .map((filterObject, i, arr) => (
          <div
            key={filterObject.index}
            className="relative flex gap-x-[1px] cursor-default"
          >
            {/* Filter object label */}
            <div className="items-center bg-gray-100 rounded-l-md px-[6px] py-1 text-xs">
              {filterObject.label}
            </div>
            {/* is/not filter */}
            <div>
              <div
                ref={(el) => (notOptionRefs.current[i] = el)}
                onClick={() => handleNotClick(filterObject.index)}
                className="flex items-center bg-gray-100 px-[6px] py-1 text-xs"
              >
                {filterObject.not ? "is not" : "is"}
              </div>
              <NotDropdown
                notDropdownRef={(el) => (notDropdownRefs.current[i] = el)}
                filterObjectIndex={filterObject.index}
                isNotDropdownOpen={isNotDropdownOpen}
                setIsNotDropdownOpen={setIsNotDropdownOpen}
                selectedIndex={selectedIndex}
                setFilterObjectArray={setFilterObjectArray}
              />
            </div>
            {/* Filter object selections */}
            <div className="items-center bg-gray-100 px-[6px] py-1 text-xs">
              {filterObject.selections.join(", ")}
            </div>
            {/* Button to remove filter object */}
            <div
              className="text-xs font-semibold rounded-r-md bg-gray-100 flex items-center justify-center px-[6px]"
              onClick={() => handleRemovingFilter(filterObject.index)}
            >
              <HiOutlineX className="h-[14px] w-[14px]" />
            </div>
            {/* Dropdown for pill */}
            <FilterMenuDropdown
              filterMenuDropdownRef={filterMenuDropdownRef}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setIsContentFilterOpen={setIsContentFilterOpen}
              setIsDatePickerOpen={setIsDatePickerOpen}
              filterObjectArray={filterObjectArray}
              setFilterObjectArray={setFilterObjectArray}
              isLast={i === arr.length - 1}
              isFilter={false}
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
            />
          </div>
        ))}
      {/* Add filter button */}
      <div className="relative">
        <button
          className={`flex items-center gap-x-2 px-[6px] rounded-[5px] hover:bg-gray-100 hover:cursor-default h-[24px] ${
            isDropdownOpen && "bg-gray-100"
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <LuListFilter />
          {filterObjectArray.length < 2 &&
            filterObjectArray[0].selections.length === 0 && (
              <span className="text-xs font-semibold">Filter</span>
            )}
        </button>
        {/* Dropdown for filter button */}
        <FilterMenuDropdown
          filterMenuDropdownRef={filterMenuDropdownRef}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          setIsContentFilterOpen={setIsContentFilterOpen}
          setIsDatePickerOpen={setIsDatePickerOpen}
          filterObjectArray={filterObjectArray}
          setFilterObjectArray={setFilterObjectArray}
          isLast={false}
          isFilter={true}
          selectedLabel={selectedLabel}
          setSelectedLabel={setSelectedLabel}
        />
      </div>
      <div className="flex-grow" />
      {/* Clear */}
      <button
        className="text-[13px] cursor-default px-2 hover:bg-gray-100 rounded-[5px]"
        onClick={handleClearClick}
      >
        Clear
      </button>
      {/* Results */}
      <div className="text-[13px] mr-2 flex flex-col justify-center">{`${resultsCount} results`}</div>
      <ContentFilterDialog
        isContentFilterOpen={isContentFilterOpen}
        setIsContentFilterOpen={setIsContentFilterOpen}
        contentFilterValue={contentFilterValue}
        setContentFilterValue={setContentFilterValue}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setFilterObjectArray={setFilterObjectArray}
      />
      <DatePickerDialog
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        date={date}
        setDate={setDate}
        isDateSelected={isDateSelected}
        setIsDateSelected={setIsDateSelected}
        setFilterObjectArray={setFilterObjectArray}
      />
    </div>
  );
}
