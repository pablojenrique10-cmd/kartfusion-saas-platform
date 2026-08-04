import { eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, revisions, sites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getOwnedSite, loadSiteContent } from "@/lib/sites";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await ctx.params;
  const site = await getOwnedSite(id, user.id);
  if (!site) return Response.json({ error: "Site não encontrado" }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as { unpublish?: boolean };

  if (body.unpublish) {
    const [updated] = await db
      .update(sites)
      .set({ status: "draft", updatedAt: new Date() })
      .where(eq(sites.id, site.id))
      .returning();
    await db.insert(activities).values({
      userId: user.id,
      siteId: site.id,
      type: "site.unpublished",
      message: `Site "${site.name}" voltou para rascunho`,
    });
    return Response.json({ ok: true, site: updated });
  }

  const now = new Date();
  const [updated] = await db
    .update(sites)
    .set({ status: "published", publishedAt: now, updatedAt: now })
    .where(eq(sites.id, site.id))
    .returning();

  const content = await loadSiteContent(site.id);
  await db.insert(revisions).values({
    siteId: site.id,
    userId: user.id,
    label: "Publicação",
    kind: "publish",
    snapshot: content,
  });

  await db.insert(activities).values({
    userId: user.id,
    siteId: site.id,
    type: "site.published",
    message: `Site "${site.name}" publicado em /site/${site.slug}`,
  });

  return Response.json({ ok: true, site: updated, url: `/site/${site.slug}` });
}
