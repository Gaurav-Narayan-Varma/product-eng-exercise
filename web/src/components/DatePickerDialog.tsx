import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { filterObjectArray } from "../../../shared/types";

type Props = {
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  isDateSelected: boolean;
  setIsDateSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObjectArray>>;
};

export function DatePickerDialog({
  isDatePickerOpen,
  setIsDatePickerOpen,
  date,
  setDate,
  isDateSelected,
  setIsDateSelected,
  setFilterObjectArray,
}: Props) {
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
          not: false,
          index: prev.length === 0 ? 0 : prev[prev.length - 1].index + 1,
        },
      ];
    });

    setIsDatePickerOpen(false);
  };

  return (
    <Dialog open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
      <DialogContent className="border-[0.5px] border-gray-200 w-fit">
        <DialogHeader>
          <DialogTitle>
            Created date <span className="text-gray-500">after</span>
          </DialogTitle>
          <Calendar
            mode="single"
            selected={date || undefined}
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
  );
}
