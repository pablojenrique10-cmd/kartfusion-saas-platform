import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, subscriptions } from "@/db/schema";
import ProfileForm from "@/components/dashboard/ProfileForm";
import { requireUser } from "@/lib/auth";
import { formatDateTime, timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Perfil" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  const [subs, acts] = await Promise.all([
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, user.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(5),
    db
      .select()
      .from(activities)
      .where(eq(activities.userId, user.id))
      .orderBy(desc(activities.createdAt))
      .limit(12),
  ]);

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Meu perfil</h1>
        <p className="mt-1 text-sm text-slate-400">Gerencie seus dados de acesso e preferências da conta.</p>
      </header>

      <ProfileForm
        initial={{
          name: user.name,
          email: user.email,
          company: user.company ?? "",
          phone: user.phone ?? "",
          avatarColor: user.avatarColor,
        }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="kf-card p-6">
          <h2 className="text-base font-bold text-white">Histórico de assinaturas</h2>
          <div className="mt-4 grid gap-2.5">
            {subs.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold capitalize text-white">{sub.planId}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatDateTime(sub.startedAt)} · provider: {sub.provider}
                  </p>
                </div>
                <span
                  className={`kf-chip ${
                    sub.status === "active"
                      ? "border-neon-500/30 bg-neon-500/10 text-neon-400"
                      : sub.status === "trialing"
                        ? "border-fusion-500/30 bg-fusion-500/10 text-fusion-300"
                        : "text-slate-500"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="kf-card p-6">
          <h2 className="text-base font-bold text-white">Registro de atividades</h2>
          <ul className="mt-4 grid gap-2.5">
            {acts.map((activity) => (
              <li key={activity.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fusion-500" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-300">{activity.message}</p>
                  <p className="text-[10px] text-slate-600">{timeAgo(activity.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
