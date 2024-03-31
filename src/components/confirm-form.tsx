"use client";

import { confirmSignup } from "@/actions/confirm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmModel, confirmModel } from "@/models/confirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormFieldContext,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

interface ConfirmFormProps {
  sub: string;
}

export function ConfirmForm({ sub }: ConfirmFormProps) {
  const form = useForm<ConfirmModel>({
    resolver: zodResolver(confirmModel),
    defaultValues: {
      sub,
      code: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: ConfirmModel) {
    startTransition(async () => {
      const res = await confirmSignup(values);
      if (res.status === "invalidData")
        res.issues.forEach((i) =>
          form.setError(i.path as keyof ConfirmModel, { message: i.message }),
        );
      if (res.status === "error")
        form.setError("root", { message: "An unexpected error occurred" });
    });
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the verification code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" loading={isPending}>
              Submit
            </Button>
            <FormFieldContext.Provider value={{ name: "root" }}>
              <FormMessage />
            </FormFieldContext.Provider>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
