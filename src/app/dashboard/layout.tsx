import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { requireUser } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  await ensureSeeded();

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[420px] w-[720px] rounded-full bg-fusion-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[520px] rounded-full bg-neon-500/8 blur-[150px]" />
      </div>

      <Sidebar
        planName={user.plan.planName}
        trialing={user.plan.trialing}
        trialDaysLeft={user.plan.trialDaysLeft}
      />

      <div className="lg:pl-[264px]">
        <Topbar
          name={user.name}
          email={user.email}
          planName={user.plan.planName}
          avatarColor={user.avatarColor}
        />
        <main className="mx-auto w-full max-w-[1400px] px-5 py-7 pb-24 lg:pb-10">{children}</main>
      </div>
    </div>
  );
}
