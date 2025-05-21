import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function Login() {
  const { signIn, session } = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);
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
    try {
      await signIn(values.username, values.password);
    } catch (error) {
      setLoginFailed(true);
      console.error("Login failed:", error);
    }
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
                    <FormLabel>{t("login.email")}</FormLabel>
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
                    form.setValue("username", "demo@example.com");
                    form.setValue("password", "demo");
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

        {!session && loginFailed && (
          <CardFooter>
            <p>
              {t("login.invalidCredentials")}
              <span className="mx-1"></span>
              <Link to="#" className="text-accent-11">
                {t("login.forgotPassword")}
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
