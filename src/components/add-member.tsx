import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AddMember() {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline">
          <Plus className="w-4 sm:mr-2" />
          <span className="hidden sm:inline-block">
            {t("members.addMember")}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("members.addMember")}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
