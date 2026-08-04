import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { activities, media, sites } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";
import { formatBytes, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [siteRows, mediaUsage, activityRows] = await Promise.all([
    db.select().from(sites).where(eq(sites.userId, user.id)).orderBy(desc(sites.updatedAt)),
    db
      .select({ total: sql<number>`coalesce(sum(size_bytes),0)::bigint` })
      .from(media)
      .where(eq(media.userId, user.id)),
    db
      .select()
      .from(activities)
      .where(eq(activities.userId, user.id))
      .orderBy(desc(activities.createdAt))
      .limit(8),
  ]);

  const published = siteRows.filter((site) => site.status === "published").length;
  const usedBytes = Number(mediaUsage[0]?.total ?? 0);
  const availableTemplates = TEMPLATES.filter((t) => t.minPlanLevel <= user.plan.level).length;
  const storagePct = Math.min(100, (usedBytes / (user.plan.storageMb * 1024 * 1024)) * 100);

  const cards = [
    {
      label: "Sites criados",
      value: siteRows.length,
      hint: `de ${user.plan.maxSites > 100 ? "∞" : user.plan.maxSites} disponíveis`,
      icon: "▤",
      tint: "from-fusion-500/20",
    },
    {
      label: "Projetos ativos",
      value: published,
      hint: `${siteRows.length - published} em rascunho`,
      icon: "🚀",
      tint: "from-neon-500/20",
    },
    {
      label: "Templates disponíveis",
      value: availableTemplates,
      hint: `de ${TEMPLATES.length} no catálogo`,
      icon: "◫",
      tint: "from-purple-500/20",
    },
    {
      label: "Espaço utilizado",
      value: formatBytes(usedBytes),
      hint: `limite ${user.plan.storageMb >= 1000 ? `${user.plan.storageMb / 1000} GB` : `${user.plan.storageMb} MB`}`,
      icon: "❖",
      tint: "from-amber-500/20",
    },
  ];

  return (
    <div className="grid gap-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-fusion-600/22 via-ink-800 to-neon-600/12 p-7 kf-fade-up">
        <div className="absolute inset-0 grid-noise opacity-30" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-neon-400">KartFusion</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">{user.name}</h1>
            <p className="mt-1 text-sm text-slate-300">{user.email}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="kf-chip border-fusion-500/30 bg-fusion-500/12 text-fusion-300">
                Plano: {user.plan.planName}
              </span>
              {user.plan.trialing && (
                <span className="kf-chip border-neon-500/30 bg-neon-500/12 text-neon-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-500 kf-pulse" />
                  {user.plan.trialDaysLeft} dias de teste restantes
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/dashboard/criar" className="kf-btn kf-btn-success">＋ Criar novo site</Link>
            <Link href="/dashboard/templates" className="kf-btn kf-btn-ghost">Explorar templates</Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <article
            key={card.label}
            className={`kf-card kf-card-hover relative overflow-hidden bg-gradient-to-br ${card.tint} to-transparent p-5`}
            style={{ animation: `kf-fade-up 0.45s ${index * 0.06}s both` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400">{card.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-white">{card.value}</p>
                <p className="mt-1 text-[11px] text-slate-500">{card.hint}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-base">
                {card.icon}
              </span>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* Sites recentes */}
        <section className="kf-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Seus sites</h2>
            <Link href="/dashboard/sites" className="text-xs font-semibold text-fusion-400 hover:text-fusion-300">
              Ver todos →
            </Link>
          </div>

          {siteRows.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-3xl">🎨</p>
              <p className="mt-3 text-sm font-semibold text-white">Você ainda não criou nenhum site</p>
              <p className="mt-1 text-xs text-slate-500">
                Escolha um template e publique seu primeiro site em minutos.
              </p>
              <Link href="/dashboard/criar" className="kf-btn kf-btn-primary mt-5">Criar meu primeiro site</Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {siteRows.slice(0, 5).map((site) => (
                <div
                  key={site.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/6 bg-white/[0.02] p-4 transition hover:border-fusion-500/30 hover:bg-white/[0.04]"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${site.primaryColor}, ${site.secondaryColor})` }}
                  >
                    {site.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{site.name}</p>
                    <p className="truncate text-xs text-slate-500">/site/{site.slug} · {timeAgo(site.updatedAt)}</p>
                  </div>
                  <span
                    className={`kf-chip ${
                      site.status === "published"
                        ? "border-neon-500/30 bg-neon-500/12 text-neon-400"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {site.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                  <Link href={`/editor/${site.id}`} className="kf-btn kf-btn-ghost py-2 text-xs">
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Atividade + armazenamento */}
        <div className="grid gap-5">
          <section className="kf-card p-6">
            <h2 className="text-base font-bold text-white">Armazenamento</h2>
            <p className="mt-1 text-xs text-slate-500">
              {formatBytes(usedBytes)} de{" "}
              {user.plan.storageMb >= 1000 ? `${user.plan.storageMb / 1000} GB` : `${user.plan.storageMb} MB`}
            </p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-gradient-to-r from-fusion-500 to-neon-500 transition-all duration-700"
                style={{ width: `${Math.max(storagePct, 2)}%` }}
              />
            </div>
            <Link href="/dashboard/biblioteca" className="kf-btn kf-btn-ghost mt-5 w-full py-2 text-xs">
              Abrir biblioteca de mídia
            </Link>
          </section>

          <section className="kf-card p-6">
            <h2 className="text-base font-bold text-white">Atividade recente</h2>
            {activityRows.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">Nenhuma atividade registrada ainda.</p>
            ) : (
              <ul className="mt-4 grid gap-3">
                {activityRows.map((activity) => (
                  <li key={activity.id} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fusion-500" />
                    <div className="min-w-0">
                      <p className="truncate text-xs text-slate-300">{activity.message}</p>
                      <p className="text-[10px] text-slate-600">{timeAgo(activity.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
