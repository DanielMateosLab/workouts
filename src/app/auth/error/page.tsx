import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/shadcn/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { NextSearchParams } from "@/types/utils";
import Link from "next/link";
import { Form } from "react-hook-form";

const errorMap = {
  AccessDenied: "You are not allowed to login.",
  Verification: "Your token has expired.",
  Default: "There was an error logging in. Try again.",
};
type ErrorKey = keyof typeof errorMap;

export const meta = {
  title: "Error",
};

export default function Page({
  searchParams: { error },
}: {
  searchParams: NextSearchParams;
}) {
  const errorDetail = isKnownError(error) ? errorMap[error] : errorMap.Default;
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Unable to sign in</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p>{errorDetail}</p>
        <Button asChild>
          <Link href="login">Resend link</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const isKnownError = (error: any): error is ErrorKey =>
  typeof error === "string" && error in errorMap;
