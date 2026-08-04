import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { revisions, sites } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import type { SiteContent } from "@/lib/sites";
import { getOwnedSite, loadSiteContent, persistSiteContent } from "@/lib/sites";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

const MAX_REVISIONS = 30;

export async function GET(_request: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });
  const { id } = await ctx.params;
  const site = await getOwnedSite(id, user.id);
  if (!site) return Response.json({ error: "Site não encontrado" }, { status: 404 });
  return Response.json({ content: await loadSiteContent(site.id) });
}

export async function PUT(request: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await ctx.params;
  const site = await getOwnedSite(id, user.id);
  if (!site) return Response.json({ error: "Site não encontrado" }, { status: 404 });

  try {
    const body = (await request.json()) as {
      content?: SiteContent;
      kind?: "autosave" | "manual";
      site?: Record<string, unknown>;
    };

    const content = body.content;
    if (!content || !Array.isArray(content.pages)) {
      return Response.json({ error: "Conteúdo inválido." }, { status: 400 });
    }

    if (content.pages.length > user.plan.maxPages) {
      return Response.json(
        { error: `Seu plano permite até ${user.plan.maxPages} páginas.`, upgrade: true },
        { status: 403 },
      );
    }

    await persistSiteContent(site.id, content);

    const sitePatch: Record<string, unknown> = { updatedAt: new Date() };
    const meta = body.site ?? {};
    if (typeof meta.name === "string" && meta.name.trim()) sitePatch.name = meta.name.trim();
    if (typeof meta.primaryColor === "string") sitePatch.primaryColor = meta.primaryColor;
    if (typeof meta.secondaryColor === "string") sitePatch.secondaryColor = meta.secondaryColor;
    if (typeof meta.fontFamily === "string") sitePatch.fontFamily = meta.fontFamily;
    if (meta.seo && typeof meta.seo === "object") sitePatch.seo = meta.seo;
    if (meta.settings && typeof meta.settings === "object") sitePatch.settings = meta.settings;

    const [updatedSite] = await db.update(sites).set(sitePatch).where(eq(sites.id, site.id)).returning();

    const kind = body.kind === "manual" ? "manual" : "autosave";
    await db.insert(revisions).values({
      siteId: site.id,
      userId: user.id,
      label: kind === "manual" ? "Salvamento manual" : "Autosave",
      kind,
      snapshot: content,
    });

    const [countRow] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(revisions)
      .where(eq(revisions.siteId, site.id));

    if ((countRow?.total ?? 0) > MAX_REVISIONS) {
      const keep = await db
        .select({ id: revisions.id })
        .from(revisions)
        .where(eq(revisions.siteId, site.id))
        .orderBy(desc(revisions.createdAt))
        .limit(MAX_REVISIONS);
      const keepIds = keep.map((row) => `'${row.id}'`).join(",");
      if (keepIds) {
        await db.execute(
          sql.raw(
            `delete from revisions where site_id = '${site.id}' and id not in (${keepIds})`,
          ),
        );
      }
    }

    return Response.json({ ok: true, savedAt: new Date().toISOString(), site: updatedSite });
  } catch (error) {
    console.error("save content error", error);
    return Response.json({ error: "Não foi possível salvar." }, { status: 500 });
  }
}
