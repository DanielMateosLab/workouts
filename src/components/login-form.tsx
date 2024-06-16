"use client";

import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginModel, loginModel } from "@/models/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useTransition } from "react";

export function LoginForm() {
  const form = useForm<LoginModel>({
    resolver: zodResolver(loginModel),
    defaultValues: {
      email: "",
    },
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: LoginModel) {
    startTransition(async () => {
      try {
        await login(values);
      } catch (error) {
        toast.error("Error logging in!", {
          description: "Check your connection and try again.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" loading={isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
