import type { Metadata } from "next";
import CreateSiteWizard from "@/components/dashboard/CreateSiteWizard";
import { requireUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "Criar site" };
export const dynamic = "force-dynamic";

export default async function CreateSitePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Criar novo site</h1>
        <p className="mt-1 text-sm text-slate-400">
          Escolha um template, defina a identidade visual e o KartFusion gera toda a estrutura para você.
        </p>
      </header>

      <CreateSiteWizard
        templates={TEMPLATES}
        planLevel={user.plan.level}
        initialTemplate={params.template}
      />
    </div>
  );
}
