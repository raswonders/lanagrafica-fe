import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

import { Input } from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";

export function Login() {
  const { signIn } = useAuth();
  const { t } = useTranslation();

  const formSchema = z.object({
    username: z.string().min(1, { message: t("validation.required") }),
    password: z.string().min(1, { message: t("validation.required") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn(values.username, values.password);
    form.reset();
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="mx-auto flex-grow flex flex-col items-center sm:max-w-md">
        <CardHeader className="w-full max-w-md">
          <CardTitle>{t("login.title")}</CardTitle>
        </CardHeader>
        <CardContent className="w-full max-w-md">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.username")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login.password")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  onClick={() => {
                    form.setValue("username", "user");
                    form.setValue("password", "user");
                  }}
                >
                  {t("login.defaultCredentials")}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {t("login.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
