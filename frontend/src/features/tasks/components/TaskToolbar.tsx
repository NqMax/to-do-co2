import { useState } from "react";
import { useSearchParams } from "react-router";
import { useDebouncedCallback } from "use-debounce";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

const CLEAR_VALUE = "__all";

export function TaskToolbar({ isRefetching }: { isRefetching: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  function setFilterParam(
    key: "search" | "priority" | "status" | "sortOrder",
    value: string,
  ) {
    if (value === CLEAR_VALUE) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    searchParams.delete("page");
    setSearchParams(searchParams);
  }

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const trimmedSearch = value.trim();

    if (trimmedSearch === "") {
      return setFilterParam("search", CLEAR_VALUE);
    }

    setFilterParam("search", trimmedSearch);
  }, 250);

  return (
    <div className="flex gap-4 rounded-xl border p-2">
      <InputGroup>
        <InputGroupInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
        />
        <InputGroupAddon>
          {isRefetching ? <Spinner /> : <Search />}
        </InputGroupAddon>
      </InputGroup>
      <Select
        value={searchParams.get("priority") ?? CLEAR_VALUE}
        onValueChange={(value) => setFilterParam("priority", value)}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Filter by priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Priority</SelectLabel>
            <SelectItem value={CLEAR_VALUE}>All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("status") ?? CLEAR_VALUE}
        onValueChange={(value) => setFilterParam("status", value)}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value={CLEAR_VALUE}>All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={searchParams.get("sortOrder") ?? CLEAR_VALUE}
        onValueChange={(value) => setFilterParam("sortOrder", value)}
      >
        <SelectTrigger className="w-full max-w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort by</SelectLabel>
            <SelectItem value={CLEAR_VALUE}>Default Sorting</SelectItem>
            <SelectItem value="desc">Latest Update</SelectItem>
            <SelectItem value="asc">Oldest Update</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
