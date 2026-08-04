import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "Templates" };
export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const user = await requireUser();
  const categories = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Templates</h1>
          <p className="mt-1 text-sm text-slate-400">
            {TEMPLATES.filter((t) => t.minPlanLevel <= user.plan.level).length} de {TEMPLATES.length} modelos
            liberados no seu plano.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <span key={category} className="kf-chip text-slate-400">{category}</span>
          ))}
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {TEMPLATES.map((template, index) => {
          const locked = template.minPlanLevel > user.plan.level;
          return (
            <article
              key={template.id}
              className="kf-card kf-card-hover overflow-hidden"
              style={{ animation: `kf-fade-up 0.4s ${index * 0.04}s both` }}
            >
              <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${template.gradient}`}>
                <span className="text-5xl drop-shadow-lg">{template.emoji}</span>
                {template.featured && !locked && (
                  <span className="absolute left-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    Destaque
                  </span>
                )}
                {locked && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur">
                    🔒 {template.minPlanLevel === 3 ? "Premium" : "Intermediário"}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white">{template.name}</h2>
                  <span className="text-[10px] text-slate-500">{template.category}</span>
                </div>
                <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] leading-relaxed text-slate-400">
                  {template.description}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded" style={{ background: template.primaryColor }} />
                  <span className="h-4 w-4 rounded" style={{ background: template.secondaryColor }} />
                  <span className="ml-auto text-[10px] text-slate-500">{template.fontFamily}</span>
                </div>
                <div className="mt-4">
                  {locked ? (
                    <Link href="/dashboard/planos" className="kf-btn kf-btn-ghost w-full py-2 text-xs">
                      Fazer upgrade para usar
                    </Link>
                  ) : (
                    <Link
                      href={`/dashboard/criar?template=${template.id}`}
                      className="kf-btn kf-btn-primary w-full py-2 text-xs"
                    >
                      Usar este template
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section className="kf-card border-dashed p-8 text-center">
        <p className="text-3xl">🛒</p>
        <h2 className="mt-3 text-base font-bold text-white">Marketplace de Templates</h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-slate-500">
          Em breve você poderá comprar, vender e publicar templates criados pela comunidade KartFusion.
        </p>
      </section>
    </div>
  );
}
