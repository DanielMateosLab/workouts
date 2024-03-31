import { ConfirmForm } from "@/components/confirm-form";

export default function Page({ params: { sub } }: { params: { sub: string } }) {
  return (
    <div className="pt-8">
      <ConfirmForm sub={sub} />
    </div>
  );
}
