import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";

export default function Page() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          We will send you an email with a link to login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
