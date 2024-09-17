import { useQuery } from "@tanstack/react-query";
import {
  FeedbackData,
  FeedbackGroup,
  filterObjectArray,
} from "../../shared/types";

export function useFeedbackQuery(query: filterObjectArray) {
  return useQuery<{ data: FeedbackData }>({
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/query", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        method: "POST",
      });

      return res.json();
    },
    // The query key is used to cache responses and should represent
    // the parameters of the query.
    queryKey: [query],
    // TODO: remove this
    refetchOnWindowFocus: false,
  });
}

export function useGroupsQuery(query: filterObjectArray) {
  return useQuery<{ data: FeedbackGroup[] }>({
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/groups", {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        method: "POST",
      });
      return res.json();
    },
    // The query key is used to cache responses and should represent
    // the parameters of the query.
    queryKey: [query],
    // TODO: remove this
    refetchOnWindowFocus: false,
  });
}
