"use client";

import { signUp } from "@/actions/signup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignUpModel, signUpModel } from "@/models/signup";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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

export function SignUpForm() {
  const form = useForm<SignUpModel>({
    resolver: zodResolver(signUpModel),
    defaultValues: {
      email: "",
      password: "",
      repeatPassword: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: SignUpModel) {
    startTransition(async () => {
      const res = await signUp(values);
      if (res.status === "invalidData")
        res.issues.forEach((i) =>
          form.setError(i.path as keyof SignUpModel, { message: i.message }),
        );
      if (res.status === "error")
        form.setError("root", { message: "An unexpected error occurred" });
    });
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    You will need to verify your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long and contain at least 1
                    number, 1 special character, 1 uppercase letter, and 1
                    lowercase letter.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" loading={isPending}>
              Create an account
            </Button>
            <FormFieldContext.Provider value={{ name: "root" }}>
              <FormMessage />
            </FormFieldContext.Provider>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
