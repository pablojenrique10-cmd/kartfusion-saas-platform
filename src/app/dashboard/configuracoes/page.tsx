import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads, sites } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Configurações" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await requireUser();

  const siteRows = await db.select().from(sites).where(eq(sites.userId, user.id));
  const siteIds = siteRows.map((site) => site.id);

  const recentLeads = siteIds.length
    ? await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(20)
    : [];
  const ownedLeads = recentLeads.filter((lead) => siteIds.includes(lead.siteId));

  const integrations = [
    {
      name: "Mercado Pago",
      description: "Cobrança recorrente dos planos e checkout transparente.",
      icon: "💳",
      ready: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN),
    },
    {
      name: "Cloudinary",
      description: "CDN de imagens com otimização automática e transformações.",
      icon: "🖼️",
      ready: Boolean(process.env.CLOUDINARY_URL),
    },
    {
      name: "Cloudflare",
      description: "Proxy, cache global e proteção contra ataques.",
      icon: "🛡️",
      ready: Boolean(process.env.CLOUDFLARE_API_TOKEN),
    },
    {
      name: "Vercel",
      description: "Deploy dos sites publicados com domínio personalizado.",
      icon: "▲",
      ready: Boolean(process.env.VERCEL_API_TOKEN),
    },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Configurações</h1>
        <p className="mt-1 text-sm text-slate-400">
          Conta, plano, integrações e recursos avançados da sua workspace.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="kf-card p-6">
          <p className="kf-label">Conta</p>
          <p className="text-lg font-extrabold text-white">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
          <Link href="/dashboard/perfil" className="kf-btn kf-btn-ghost mt-4 w-full py-2 text-xs">
            Editar perfil
          </Link>
        </section>

        <section className="kf-card p-6">
          <p className="kf-label">Plano</p>
          <p className="text-lg font-extrabold text-white">{user.plan.planName}</p>
          <p className="text-xs text-slate-500">
            {user.plan.maxSites > 100 ? "Sites ilimitados" : `${user.plan.maxSites} site(s)`} ·{" "}
            {user.plan.maxPages > 100 ? "páginas ilimitadas" : `${user.plan.maxPages} páginas`}
          </p>
          <Link href="/dashboard/planos" className="kf-btn kf-btn-primary mt-4 w-full py-2 text-xs">
            Gerenciar assinatura
          </Link>
        </section>

        <section className="kf-card p-6">
          <p className="kf-label">Domínio personalizado</p>
          <p className="text-lg font-extrabold text-white">
            {user.plan.level >= 3 ? "Disponível" : "Bloqueado"}
          </p>
          <p className="text-xs text-slate-500">
            {user.plan.level >= 3
              ? "Configure em cada site dentro do editor, aba SEO."
              : "Recurso exclusivo do plano Premium."}
          </p>
          <Link href="/dashboard/sites" className="kf-btn kf-btn-ghost mt-4 w-full py-2 text-xs">
            Ir para meus sites
          </Link>
        </section>
      </div>

      <section className="kf-card p-6">
        <h2 className="text-base font-bold text-white">Integrações</h2>
        <p className="text-xs text-slate-500">
          A arquitetura já está preparada — basta configurar as variáveis de ambiente para ativar.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center gap-4 rounded-xl border border-white/7 bg-white/[0.02] p-4"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-lg">
                {integration.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{integration.name}</p>
                <p className="text-[11px] text-slate-500">{integration.description}</p>
              </div>
              <span
                className={`kf-chip ${
                  integration.ready
                    ? "border-neon-500/30 bg-neon-500/10 text-neon-400"
                    : "text-slate-500"
                }`}
              >
                {integration.ready ? "Conectado" : "Preparado"}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="kf-card p-6">
        <h2 className="text-base font-bold text-white">Leads recebidos</h2>
        <p className="text-xs text-slate-500">Mensagens enviadas pelos formulários dos seus sites publicados.</p>
        {ownedLeads.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-white/10 py-10 text-center text-xs text-slate-500">
            Nenhum lead recebido ainda.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/8 text-[11px] uppercase tracking-widest text-slate-500">
                  <th className="pb-2.5">Nome</th>
                  <th className="pb-2.5">Contato</th>
                  <th className="pb-2.5">Mensagem</th>
                  <th className="pb-2.5">Data</th>
                </tr>
              </thead>
              <tbody>
                {ownedLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 text-slate-300">
                    <td className="py-3 text-xs font-semibold text-white">{lead.name || "—"}</td>
                    <td className="py-3 text-xs">
                      {lead.email}
                      {lead.phone ? ` · ${lead.phone}` : ""}
                    </td>
                    <td className="max-w-[280px] truncate py-3 text-xs">{lead.message}</td>
                    <td className="py-3 text-[11px] text-slate-500">{formatDateTime(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="kf-card border-dashed p-6">
        <h2 className="text-base font-bold text-white">Roadmap</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Marketplace de Templates", text: "Compre e venda templates da comunidade." },
            { title: "Loja de Plugins", text: "Extensões de e-commerce, CRM e automações." },
            { title: "Multi-idioma", text: "Publique o mesmo site em vários idiomas." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-[11px] text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
