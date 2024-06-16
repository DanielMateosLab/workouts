import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/shadcn/card";

export default function Page() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Link Sent</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Check your email and click on the verification link we just sent.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
