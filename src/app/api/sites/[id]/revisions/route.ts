import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { revisions } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import type { SiteContent } from "@/lib/sites";
import { getOwnedSite, persistSiteContent } from "@/lib/sites";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await ctx.params;
  const site = await getOwnedSite(id, user.id);
  if (!site) return Response.json({ error: "Site não encontrado" }, { status: 404 });

  const rows = await db
    .select({
      id: revisions.id,
      label: revisions.label,
      kind: revisions.kind,
      createdAt: revisions.createdAt,
    })
    .from(revisions)
    .where(eq(revisions.siteId, site.id))
    .orderBy(desc(revisions.createdAt))
    .limit(30);

  return Response.json({ revisions: rows });
}

/** Restaura uma revisão específica. */
export async function POST(request: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await ctx.params;
  const site = await getOwnedSite(id, user.id);
  if (!site) return Response.json({ error: "Site não encontrado" }, { status: 404 });

  const body = (await request.json()) as { revisionId?: string };
  if (!body.revisionId) return Response.json({ error: "Revisão inválida." }, { status: 400 });

  const [revision] = await db.select().from(revisions).where(eq(revisions.id, body.revisionId)).limit(1);
  if (!revision || revision.siteId !== site.id) {
    return Response.json({ error: "Revisão não encontrada." }, { status: 404 });
  }

  const snapshot = revision.snapshot as SiteContent;
  await persistSiteContent(site.id, snapshot);

  return Response.json({ ok: true, content: snapshot });
}
