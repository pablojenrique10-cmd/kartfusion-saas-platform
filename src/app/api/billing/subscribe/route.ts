import { eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, subscriptions, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getPlan, isPlanId } from "@/lib/plans";

export const dynamic = "force-dynamic";

/**
 * Ativação de plano. Hoje roda com o provider "internal".
 * A estrutura já está preparada para o Mercado Pago:
 * basta trocar o provider e persistir o providerRef do checkout.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const body = (await request.json()) as { planId?: string; cancel?: boolean };

  if (body.cancel) {
    await db
      .update(subscriptions)
      .set({ status: "canceled", canceledAt: new Date() })
      .where(eq(subscriptions.userId, user.id));
    await db.update(users).set({ planId: "basic", updatedAt: new Date() }).where(eq(users.id, user.id));
    return Response.json({ ok: true, planId: "basic" });
  }

  const planId = body.planId ?? "";
  if (!isPlanId(planId)) return Response.json({ error: "Plano inválido." }, { status: 400 });

  const plan = getPlan(planId);
  const periodEnd = new Date(Date.now() + 30 * 86_400_000);

  await db
    .update(subscriptions)
    .set({ status: "canceled", canceledAt: new Date() })
    .where(eq(subscriptions.userId, user.id));

  await db.insert(subscriptions).values({
    userId: user.id,
    planId: plan.id,
    status: "active",
    provider: process.env.MERCADOPAGO_ACCESS_TOKEN ? "mercadopago" : "internal",
    currentPeriodEnd: periodEnd,
  });

  await db
    .update(users)
    .set({ planId: plan.id, trialEndsAt: null, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  await db.insert(activities).values({
    userId: user.id,
    type: "billing.subscribed",
    message: `Plano ${plan.name} ativado`,
    meta: { planId: plan.id, priceCents: plan.priceCents },
  });

  return Response.json({ ok: true, planId: plan.id });
}
