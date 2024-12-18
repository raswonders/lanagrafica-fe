import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { Table, VisibilityState } from "@tanstack/react-table";
import { MemberExt } from "@/types/types";

type HideFieldsPopoverProps = {
  table: Table<MemberExt>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export function HideFieldsPopover({
  table,
  setColumnVisibility,
}: HideFieldsPopoverProps) {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mb-6">
          <EyeOff className="w-4 mr-2" />
          {t("membersTable.hideFields")}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {table.getAllColumns().map((col, index, self) => {
          if (col.id === "is_active" || col.id === "is_deleted") return null;

          return (
            <div
              key={col.id}
              className={`flex ${index === self.length - 1 ? "" : "mb-4"}`}
            >
              <Checkbox
                id={col.id}
                checked={col.getIsVisible()}
                disabled={!col.getCanHide()}
                onCheckedChange={(checked) => {
                  setColumnVisibility((prev: VisibilityState) => ({
                    ...prev,
                    [col.id]: Boolean(checked),
                  }));
                }}
                className="mr-4"
              />
              <Label htmlFor={col.id} className="font-normal">
                {(col.columnDef.meta as string) || col.id}
              </Label>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
