import type { Metadata } from "next";
import PlanSelector from "@/components/dashboard/PlanSelector";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Planos" };
export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const user = await requireUser();

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Planos e assinatura</h1>
        <p className="mt-1 text-sm text-slate-400">
          Escolha o plano ideal para o momento do seu negócio. Upgrade e downgrade a qualquer momento.
        </p>
      </header>

      <PlanSelector
        currentPlanId={user.plan.planId}
        trialing={user.plan.trialing}
        trialDaysLeft={user.plan.trialDaysLeft}
      />
    </div>
  );
}
