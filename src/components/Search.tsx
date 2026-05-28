import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type SearchProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  placeholder?: string;
};

export const Search = ({
  searchText,
  setSearchText,
  placeholder = "Search...",
}: SearchProps) => {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="pr-[24px] text-base bg-white text-neutral-900 placeholder:text-neutral-500"
      />
      {searchText && (
        <span
          onClick={() => setSearchText("")}
          className="absolute cursor-pointer right-[8px] top-[10px] text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </span>
      )}
    </div>
  );
};

export default Search;
