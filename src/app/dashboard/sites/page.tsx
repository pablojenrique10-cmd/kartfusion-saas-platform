import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { pages, sections, sites } from "@/db/schema";
import SiteActions from "@/components/dashboard/SiteActions";
import { requireUser } from "@/lib/auth";
import { getTemplate } from "@/lib/templates";
import { formatDate, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Meus sites" };
export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const user = await requireUser();

  const rows = await db.select().from(sites).where(eq(sites.userId, user.id)).orderBy(desc(sites.updatedAt));

  const counts = await Promise.all(
    rows.map(async (site) => {
      const [pageCount] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(pages)
        .where(eq(pages.siteId, site.id));
      const [blockCount] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(sections)
        .where(eq(sections.siteId, site.id));
      return { pages: pageCount?.total ?? 0, blocks: blockCount?.total ?? 0 };
    }),
  );

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Meus sites</h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length} de {user.plan.maxSites > 100 ? "∞" : user.plan.maxSites} sites usados no plano{" "}
            {user.plan.planName}.
          </p>
        </div>
        <Link href="/dashboard/criar" className="kf-btn kf-btn-success">＋ Criar site</Link>
      </header>

      {rows.length === 0 ? (
        <div className="kf-card p-14 text-center">
          <p className="text-4xl">🗂️</p>
          <h2 className="mt-4 text-lg font-bold text-white">Nenhum site por aqui ainda</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
            Comece escolhendo um template profissional — a estrutura inteira é gerada automaticamente.
          </p>
          <Link href="/dashboard/criar" className="kf-btn kf-btn-primary mt-6">Criar meu primeiro site</Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {rows.map((site, index) => {
            const template = getTemplate(site.templateId);
            return (
              <article
                key={site.id}
                className="kf-card kf-card-hover overflow-hidden"
                style={{ animation: `kf-fade-up 0.4s ${index * 0.05}s both` }}
              >
                <div
                  className="relative flex h-28 items-center justify-between px-6"
                  style={{ background: `linear-gradient(120deg, ${site.primaryColor}, ${site.secondaryColor})` }}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">
                      {template.category}
                    </p>
                    <p className="mt-1 text-lg font-extrabold text-white">{site.name}</p>
                  </div>
                  <span className="text-3xl drop-shadow">{template.emoji}</span>
                  <span
                    className={`absolute right-4 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold backdrop-blur ${
                      site.status === "published" ? "bg-black/35 text-neon-300" : "bg-black/35 text-amber-200"
                    }`}
                  >
                    {site.status === "published" ? "● Publicado" : "○ Rascunho"}
                  </span>
                </div>

                <div className="p-5">
                  <p className="line-clamp-2 min-h-[34px] text-xs leading-relaxed text-slate-400">
                    {site.description || "Sem descrição."}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/6 bg-white/[0.02] p-3 text-center">
                    <div>
                      <p className="text-sm font-bold text-white">{counts[index].pages}</p>
                      <p className="text-[10px] text-slate-500">páginas</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{counts[index].blocks}</p>
                      <p className="text-[10px] text-slate-500">blocos</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{formatDate(site.createdAt)}</p>
                      <p className="text-[10px] text-slate-500">criado</p>
                    </div>
                  </div>

                  <p className="mt-3 truncate text-[11px] text-slate-500">
                    🔗 /site/{site.slug} · atualizado {timeAgo(site.updatedAt)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link href={`/editor/${site.id}`} className="kf-btn kf-btn-primary flex-1 py-2 text-xs">
                      ✎ Abrir editor
                    </Link>
                    <Link
                      href={`/site/${site.slug}`}
                      target="_blank"
                      className="kf-btn kf-btn-ghost py-2 text-xs"
                    >
                      Ver site
                    </Link>
                  </div>
                  <div className="mt-2">
                    <SiteActions siteId={site.id} slug={site.slug} status={site.status} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
