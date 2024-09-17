import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { filterObjectArray } from "../../../shared/types";
import { useEffect } from "react";

type Props = {
  isContentFilterOpen: boolean;
  setIsContentFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contentFilterValue: string;
  setContentFilterValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setFilterObjectArray: React.Dispatch<React.SetStateAction<filterObjectArray>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ContentFilterDialog({
  isContentFilterOpen,
  setIsContentFilterOpen,
  contentFilterValue,
  setContentFilterValue,
  errorMessage,
  setErrorMessage,
  setFilterObjectArray,
  isDropdownOpen,
  setIsDropdownOpen,
}: Props) {
  // Reset dialog error message when dialog is closed via escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // If user clicks escape, reset error message
      if (event.key === "Escape" && errorMessage) {
        setErrorMessage("");
      } else if (event.key === "f" && !isContentFilterOpen) {
        !isDropdownOpen && event.preventDefault();
        !isDropdownOpen && setIsDropdownOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContentFilterOpen, isDropdownOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleApplyContentFilter();
    }
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
          not: false,
          index: prev.length === 0 ? 0 : prev[prev.length - 1].index + 1,
        },
      ];
    });

    setIsContentFilterOpen(false);
    setContentFilterValue("");
    setErrorMessage("");
  };

  return (
    <Dialog open={isContentFilterOpen} onOpenChange={setIsContentFilterOpen}>
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
              setIsContentFilterOpen(false);
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
  );
}
