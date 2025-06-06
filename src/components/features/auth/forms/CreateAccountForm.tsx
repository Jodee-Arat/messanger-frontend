"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/common/Alert";
import { Button } from "@/components/ui/common/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/common/Form";
import { Input } from "@/components/ui/common/input";

import { useCreateUserMutation } from "@/graphql/generated/output";

import {
  TypeCreateAccountSchema,
  createAccountSchema,
} from "@/schemas/auth/create-account.schema";

import AuthWrapper from "../AuthWrapper";

const CreateAccountForm = () => {
  const t = useTranslations("auth.register");

  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<TypeCreateAccountSchema>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const [create, { loading: isLoadingCreate }] = useCreateUserMutation({
    onCompleted() {
      setIsSuccess(true);
    },
    onError() {
      toast.error(t("errorMessage"));
    },
  });

  const { isValid } = form.formState;

  function onSubmit(data: TypeCreateAccountSchema) {
    create({
      variables: { data },
    });
  }
  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/login"
    >
      {isSuccess ? (
        <Alert>
          <CircleCheck className="size-4" />
          <AlertTitle>{t("successAlertTitle")}</AlertTitle>
          <AlertDescription>{t("successAlertDescription")}</AlertDescription>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("usernameLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Johndoe"
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("usernameDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="obgon02@bk.ru"
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("emailDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">{t("passwordLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      disabled={isLoadingCreate}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{t("passwordDescription")}</FormDescription>
                </FormItem>
              )}
            />
            <Button
              className="mt-2 w-full"
              disabled={!isValid || isLoadingCreate}
            >
              {t("submitButton")}
            </Button>
          </form>
        </Form>
      )}
    </AuthWrapper>
  );
};

export default CreateAccountForm;
