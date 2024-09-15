import { useState, useRef, useEffect } from "react";
import { LuListFilter } from "react-icons/lu";
import { FilterMenuDropdown } from "./FilterMenuDropdown";
import { filterObject } from "../App";
import { HiOutlineX } from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface Props {
  filterObjectArray: filterObject[];
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObject[]>>;
}

export function FilterMenu({ filterObjectArray, setFilterObjectArray }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  //   TODO: Refactor name to selectedDropdownItem
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [contentFilterValue, setContentFilterValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);

  //   useeffect debug date
  useEffect(() => {
    console.log("date debug", date);
  }, [date]);

  useEffect(() => {
    // TODO: Everytime click is outside dropdown, it adds a new filter object even if the user did not add any selections - need to fix
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close dropdown when clicking outside
        setIsOpen(false);

        // Save checked selections when clicking outside only if selections exist on the current filter object
        const currentFilterObject =
          filterObjectArray[filterObjectArray.length - 1];

        if (currentFilterObject.selections.length > 0) {
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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterObjectArray]);

  //   Reset error message when dialog is closed via escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && errorMessage) {
        setErrorMessage("");
      } else if (event.key === "f") {
        !isOpen && event.preventDefault();
        !isOpen && setIsOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDialogOpen, isOpen]);

  const handleRemovingFilter = (index: number) => {
    setFilterObjectArray((prev) =>
      prev.filter((filterObject) => filterObject.index !== index)
    );
  };

  const handleApplyContentFilter = () => {
    if (!contentFilterValue.trim()) {
      setErrorMessage("Required");
      return;
    }

    setFilterObjectArray((prev) => {
      const currentFilterObject = prev[prev.length - 1];
      return [
        ...prev.slice(0, -1),
        {
          ...currentFilterObject,
          label: "Content",
          selections: [contentFilterValue],
        },
        {
          selections: [],
          index: prev.length === 0 ? 0 : prev[prev.length - 1].index + 1,
        },
      ];
    });

    setIsDialogOpen(false);
    setContentFilterValue("");
    setErrorMessage("");
  };

  const handleApplyDateFilter = () => {
    if (!isDateSelected) {
      setIsDatePickerOpen(false);
      return;
    }

    setFilterObjectArray((prev) => {
      const currentFilterObject = prev[prev.length - 1];
      return [
        ...prev.slice(0, -1),
        {
          ...currentFilterObject,
          label: "Created date",
          selections: [date?.toISOString().split("T")[0] || ""],
        },
        {
          selections: [],
          index: prev.length === 0 ? 0 : prev[prev.length - 1].index + 1,
        },
      ];
    });

    setIsDatePickerOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleApplyContentFilter();
    }
  };

  // TODO: Remove debugger
  useEffect(() => {
    console.log("isDatePickerOpen", isDatePickerOpen);
  }, [isDatePickerOpen]);

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
        className={`flex items-center gap-x-2 px-2 rounded-[5px] hover:bg-gray-100 hover:cursor-default h-[24px] ${
          isOpen && "bg-gray-100"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <LuListFilter />
        {filterObjectArray.length < 2 &&
          filterObjectArray[0].selections.length === 0 && (
            <span className="text-xs font-semibold">Filter</span>
          )}
      </button>
      <FilterMenuDropdown
        dropdownRef={dropdownRef}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsDialogOpen={setIsDialogOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        filterObjectArray={filterObjectArray}
        setFilterObjectArray={setFilterObjectArray}
      />

      {/* Content filter dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="border-[0.5px] border-gray-200 max-w-lg"
          setErrorMessage={setErrorMessage}
        >
          <DialogHeader>
            <DialogTitle>Filter by content...</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            value={contentFilterValue}
            onChange={(e) => setContentFilterValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-[6px] px-3 rounded border-[0.5px] border-gray-200 h-[30px] text-[13px] flex-col justify-center"
          />
          {errorMessage && (
            <p className="text-[#ff8589] text-[11px] -mt-2">{errorMessage}</p>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                setIsDialogOpen(false);
                setErrorMessage("");
              }}
              type="submit"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleApplyContentFilter()}
              type="submit"
              variant="default"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Date picker dialog */}
      <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <DialogContent
          className="border-[0.5px] border-gray-200 w-fit"
          setErrorMessage={setErrorMessage}
        >
          <DialogHeader>
            <DialogTitle>
              Created date <span className="text-gray-500">after</span>
            </DialogTitle>
            <Calendar
              mode="single"
              selected={date}
              //   onSelect={setDate}
              onDayClick={(day) => {
                setDate(day);
                setIsDateSelected(true);
              }}
              numberOfMonths={2}
              className="rounded-md border"
            />
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsDatePickerOpen(false);
              }}
              type="submit"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleApplyDateFilter()}
              type="submit"
              variant="default"
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
