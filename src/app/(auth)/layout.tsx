import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 h-[460px] w-[720px] -translate-x-1/2 rounded-full bg-fusion-500/22 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[5%] h-[380px] w-[380px] rounded-full bg-neon-500/14 blur-[130px]" />
        <div className="absolute inset-0 grid-noise opacity-40" />
      </div>
      <div className="w-full max-w-md kf-fade-up">
        <div className="mb-7 flex justify-center">
          <Logo size={40} />
        </div>
        {children}
      </div>
    </div>
  );
}
