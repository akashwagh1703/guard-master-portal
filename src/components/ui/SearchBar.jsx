import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export default function SearchBar({ placeholder = "Search...", value, onChange, className }) {
  const [internal, setInternal] = useState("");
  const val = value !== undefined ? value : internal;
  const handleChange = onChange || ((e) => setInternal(e.target.value));

  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="search"
        value={val}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
      />
    </div>
  );
}
