"use client";

import { signUp } from "@/actions/signup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginModel, loginModel } from "@/models/login";
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
import { signIn } from "next-auth/react";

export function SignUpForm() {
  const form = useForm<LoginModel>({
    resolver: zodResolver(loginModel),
    defaultValues: { email: "" },
  });
  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: LoginModel) {
    const res = await signIn("email", { email: values.email });
    console.log(res);
    // startTransition(async () => {
    //   const res = await signUp(values);
    //   if (res.status === "invalidData")
    //     res.issues.forEach((i) =>
    //       form.setError(i.path as keyof LoginModel, { message: i.message }),
    //     );
    //   if (res.status === "error")
    //     form.setError("root", { message: "An unexpected error occurred" });
    // });
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
