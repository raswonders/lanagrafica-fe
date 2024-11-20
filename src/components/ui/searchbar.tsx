import { useEffect, useState } from "react";
import { Input } from "./input";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

type SearchBarProps = {
  setDebouncedSearch: React.Dispatch<React.SetStateAction<string | null>>;
};

export function SearchBar({ setDebouncedSearch }: SearchBarProps) {
  const [search, setSearch] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search, setDebouncedSearch]);

  return (
    <div className="w-[350px] relative">
      <Input
        type="search"
        id="searchInput"
        placeholder={t("members.searchPlaceholder")}
        value={search || ""}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            setDebouncedSearch((e.target as HTMLInputElement).value);
        }}
        className="pl-10"
      />
      <label
        htmlFor="searchInput"
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
      >
        <Search className="w-5 text-accent-11" />
      </label>
    </div>
  );
}
