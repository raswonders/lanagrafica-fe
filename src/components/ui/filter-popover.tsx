import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";
import { useState } from "react";
import { ColumnFiltersState } from "@tanstack/react-table";
import { StatusBadge } from "./status-badge";

export function FilterPopover({
  columnFilters,
  setColumnFilters,
}: {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  function handleFilterBadgeAddition(filter: string) {
    setOpen(false);
    let filterId: string;
    let filterValue: string | boolean;

    if (filter === "all") {
      setColumnFilters([]);
      return;
    }

    if (filter === "active") {
      filterId = "is_active";
      filterValue = true;
    }
    if (filter === "inactive") {
      filterId = "is_active";
      filterValue = false;
    }
    if (filter === "deleted") {
      filterId = "is_deleted";
      filterValue = true;
    }

    if (filter === "expired") {
      filterId = "expiration_date";
      filterValue = filter;
    }

    if (filter === "suspended") {
      filterId = "suspended_till";
      filterValue = filter;
    }

    setColumnFilters((prev: ColumnFiltersState) => {
      if (
        prev.find((item) => item.id === filterId && item.value === filterValue)
      ) {
        return prev;
      }

      return [
        {
          id: filterId,
          value: filterValue,
        },
      ];
    });
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mb-6">
          <Filter className="w-4 mr-2" />
          {t("membersTable.addFilter")}
          {columnFilters.length ? (
            columnFilters.map((filter) => {
              let filterVariant = "";

              if (filter.id === "is_active" && filter.value === true) {
                filterVariant = "active";
              }

              if (filter.id === "is_active" && filter.value === false) {
                filterVariant = "inactive";
              }

              if (filter.id === "expiration_date") {
                filterVariant = "expired";
              }

              if (filter.id === "suspended_till") {
                filterVariant = "suspended";
              }

              if (filter.id === "is_deleted") {
                filterVariant = "deleted";
              }

              return (
                <div className="ml-2" key={filterVariant}>
                  <StatusBadge status={filterVariant} />
                </div>
              );
            })
          ) : (
            <div className="ml-2" key="all">
              <StatusBadge status="all" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ul className="space-y-2">
          <li>
            <Button
              size="sm"
              variant="active"
              onClick={() => handleFilterBadgeAddition("active")}
            >
              {t("membersTable.active")}
            </Button>
          </li>
          <li>
            <Button
              size="sm"
              variant="inactive"
              onClick={() => handleFilterBadgeAddition("inactive")}
            >
              {t("membersTable.inactive")}
            </Button>
          </li>
          <li>
            <ul className="ml-8 space-y-2 list-disc marker:text-accent-6">
              <li>
                <Button
                  size="sm"
                  variant="inactive"
                  onClick={() => handleFilterBadgeAddition("expired")}
                >
                  {t("membersTable.expired")}
                </Button>
              </li>
              <li>
                <Button
                  size="sm"
                  variant="suspended"
                  onClick={() => handleFilterBadgeAddition("suspended")}
                >
                  {t("membersTable.suspended")}
                </Button>
              </li>
              <li>
                <Button
                  size="sm"
                  variant="deleted"
                  onClick={() => handleFilterBadgeAddition("deleted")}
                >
                  {t("membersTable.deleted")}
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <Button
              size="sm"
              variant="all"
              onClick={() => handleFilterBadgeAddition("all")}
            >
              {t("membersTable.all")}
            </Button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}
