import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/providers/auth-provider";

export function Login() {
  const { t } = useTranslation();
  const { signIn } = useAuth();

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mx-auto flex flex-grow flex-col items-center sm:max-w-md">
        <CardContent className="w-full max-w-md p-6">
          <div className="w-full flex justify-center">
            <Button type="submit" onClick={signIn}>
              {t("login.submit")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
