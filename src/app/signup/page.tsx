import { SignUpForm } from "@/components/sign-up-form";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  console.log(session);
  return (
    <div className="pt-8">
      <SignUpForm />
    </div>
  );
}
