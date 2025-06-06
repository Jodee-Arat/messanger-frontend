"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
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

import { useNewPasswordMutation } from "@/graphql/generated/output";

import {
  TypeNewPasswordSchema,
  newPasswordSchema,
} from "@/schemas/auth/new-password.schema";

import AuthWrapper from "../AuthWrapper";

const NewPasswordForm = () => {
  const t = useTranslations("auth.newPassword");

  const router = useRouter();

  const params = useParams<{ token: string }>();

  const form = useForm<TypeNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });

  const [newPassword, { loading: isLoadingNewPassword }] =
    useNewPasswordMutation({
      onCompleted() {
        toast.success(t("successMessage"));
        router.push("/account/login");
      },
      onError() {
        toast.error(t("errorMessage"));
      },
    });

  const { isValid } = form.formState;

  function onSubmit(data: TypeNewPasswordSchema) {
    newPassword({
      variables: { data: { ...data, token: params.token } },
    });
  }
  return (
    <AuthWrapper
      heading={t("heading")}
      backButtonLabel={t("backButtonLabel")}
      backButtonHref="/account/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-3">
          <FormField
            control={form.control}
            name="passwordRepeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">{t("passwordLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    disabled={isLoadingNewPassword}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("passwordDescription")}</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">{t("passwordRepeatLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    disabled={isLoadingNewPassword}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("passwordRepeatDescription")}
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            className="mt-2 w-full"
            disabled={!isValid || isLoadingNewPassword}
          >
            {t("submitButton")}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default NewPasswordForm;
