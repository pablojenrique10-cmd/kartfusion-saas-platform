import type { Metadata } from "next";
import Link from "next/link";
import MediaLibrary from "@/components/dashboard/MediaLibrary";
import { requireUser } from "@/lib/auth";
import { BLOCK_LIBRARY } from "@/lib/blocks";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = { title: "Biblioteca" };
export const dynamic = "force-dynamic";

const GROUPS = ["Estrutura", "Conteúdo", "Mídia", "Conversão", "Social"] as const;

export default async function LibraryPage() {
  const user = await requireUser();

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Biblioteca</h1>
        <p className="mt-1 text-sm text-slate-400">
          Componentes, blocos, templates e mídias disponíveis para os seus projetos.
        </p>
      </header>

      {/* Mídia */}
      <section className="kf-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white">Biblioteca de mídia</h2>
            <p className="text-xs text-slate-500">Envie imagens ou adicione por URL para reutilizar em qualquer site.</p>
          </div>
          <span className="kf-chip text-slate-400">Cloudinary-ready</span>
        </div>
        <div className="mt-5">
          <MediaLibrary storageMb={user.plan.storageMb} />
        </div>
      </section>

      {/* Blocos */}
      <section className="kf-card p-6">
        <h2 className="text-base font-bold text-white">Blocos e componentes</h2>
        <p className="text-xs text-slate-500">
          {BLOCK_LIBRARY.filter((b) => b.minPlanLevel <= user.plan.level).length} de {BLOCK_LIBRARY.length} blocos
          liberados no plano {user.plan.planName}.
        </p>

        <div className="mt-6 grid gap-6">
          {GROUPS.map((group) => {
            const blocks = BLOCK_LIBRARY.filter((block) => block.group === group);
            if (blocks.length === 0) return null;
            return (
              <div key={group}>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">{group}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {blocks.map((block) => {
                    const locked = block.minPlanLevel > user.plan.level;
                    return (
                      <div
                        key={block.type}
                        className={`rounded-xl border border-white/7 bg-white/[0.02] p-4 transition hover:border-fusion-500/30 ${
                          locked ? "opacity-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fusion-500/12 text-sm text-fusion-300">
                            {block.icon}
                          </span>
                          {locked && <span className="text-[10px] text-amber-300">🔒</span>}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">{block.label}</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{block.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Templates */}
      <section className="kf-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Templates</h2>
          <Link href="/dashboard/templates" className="text-xs font-semibold text-fusion-400 hover:text-fusion-300">
            Ver catálogo →
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {TEMPLATES.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/criar?template=${template.id}`}
              className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2 text-xs text-slate-300 transition hover:border-fusion-500/40 hover:text-white"
            >
              <span>{template.emoji}</span>
              {template.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
