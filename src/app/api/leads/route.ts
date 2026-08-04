import { eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, leads, sites } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const siteId = (body.siteId ?? "").trim();
    if (!siteId) return Response.json({ error: "Site inválido." }, { status: 400 });

    const [site] = await db.select().from(sites).where(eq(sites.id, siteId)).limit(1);
    if (!site) return Response.json({ error: "Site não encontrado." }, { status: 404 });

    await db.insert(leads).values({
      siteId,
      name: (body.name ?? "").slice(0, 160),
      email: (body.email ?? "").slice(0, 160),
      phone: (body.phone ?? "").slice(0, 60),
      message: (body.message ?? "").slice(0, 2000),
    });

    await db.insert(activities).values({
      userId: site.userId,
      siteId,
      type: "lead.received",
      message: `Novo contato recebido em "${site.name}"`,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Não foi possível enviar." }, { status: 500 });
  }
}
