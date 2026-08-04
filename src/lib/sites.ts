import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, pages, revisions, sections, sites, templates } from "@/db/schema";
import type { BlockType, EditorPage, EditorSection } from "@/lib/blocks";
import { getTemplate, instantiateTemplate } from "@/lib/templates";
import { slugify } from "@/lib/utils";

export interface SiteContent {
  pages: EditorPage[];
  sections: Record<string, EditorSection[]>;
}

export async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "meu-site";
  let candidate = root;
  let attempt = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [existing] = await db.select({ id: sites.id }).from(sites).where(eq(sites.slug, candidate)).limit(1);
    if (!existing) return candidate;
    attempt += 1;
    candidate = `${root}-${attempt}`;
    if (attempt > 60) return `${root}-${Date.now().toString(36)}`;
  }
}

export async function loadSiteContent(siteId: string): Promise<SiteContent> {
  const pageRows = await db
    .select()
    .from(pages)
    .where(eq(pages.siteId, siteId))
    .orderBy(asc(pages.position));

  const sectionRows = await db
    .select()
    .from(sections)
    .where(eq(sections.siteId, siteId))
    .orderBy(asc(sections.position));

  const editorPages: EditorPage[] = pageRows.map((page) => ({
    id: page.id,
    name: page.name,
    path: page.path,
    isHome: page.isHome,
    position: page.position,
    seo: page.seo ?? {},
  }));

  const grouped: Record<string, EditorSection[]> = {};
  for (const page of editorPages) grouped[page.id] = [];

  for (const row of sectionRows) {
    const key = row.pageId ?? editorPages[0]?.id;
    if (!key) continue;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      id: row.id,
      type: row.type as BlockType,
      name: row.name,
      position: row.position,
      visible: row.visible,
      content: (row.content ?? {}) as EditorSection["content"],
      styles: (row.styles ?? {}) as EditorSection["styles"],
    });
  }

  return { pages: editorPages, sections: grouped };
}

/** Regrava toda a estrutura do site (páginas + blocos) de forma transacional. */
export async function persistSiteContent(siteId: string, content: SiteContent): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(sections).where(eq(sections.siteId, siteId));
    await tx.delete(pages).where(eq(pages.siteId, siteId));

    const orderedPages = [...content.pages].sort((a, b) => a.position - b.position);
    if (orderedPages.length === 0) return;

    for (const [index, page] of orderedPages.entries()) {
      await tx.insert(pages).values({
        id: page.id,
        siteId,
        name: page.name,
        path: page.path || "/",
        isHome: page.isHome || index === 0,
        position: index,
        seo: page.seo ?? {},
      });

      const pageSections = content.sections[page.id] ?? [];
      for (const [sectionIndex, section] of pageSections.entries()) {
        await tx.insert(sections).values({
          id: section.id,
          siteId,
          pageId: page.id,
          type: section.type,
          name: section.name,
          position: sectionIndex,
          visible: section.visible,
          content: section.content,
          styles: section.styles,
        });
      }
    }

    await tx.update(sites).set({ updatedAt: new Date() }).where(eq(sites.id, siteId));
  });
}

interface CreateSiteInput {
  userId: string;
  name: string;
  description?: string;
  templateId: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export async function createSiteFromTemplate(input: CreateSiteInput) {
  const template = getTemplate(input.templateId);
  const slug = await uniqueSlug(input.name);

  const [site] = await db
    .insert(sites)
    .values({
      userId: input.userId,
      name: input.name,
      slug,
      description: input.description ?? template.description,
      templateId: template.id,
      status: "draft",
      primaryColor: input.primaryColor ?? template.primaryColor,
      secondaryColor: input.secondaryColor ?? template.secondaryColor,
      fontFamily: input.fontFamily ?? template.fontFamily,
      settings: { showBadge: true, animations: true, whatsappFloat: false },
      seo: {
        title: input.name,
        description: input.description ?? template.description,
        keywords: `${template.category}, site, ${input.name}`,
        ogImage: "",
        favicon: "🚀",
        indexable: true,
      },
    })
    .returning();

  const structure = instantiateTemplate(template.id);
  await persistSiteContent(site.id, structure);

  await db.insert(revisions).values({
    siteId: site.id,
    userId: input.userId,
    label: "Estrutura inicial do template",
    kind: "manual",
    snapshot: structure,
  });

  await db.insert(activities).values({
    userId: input.userId,
    siteId: site.id,
    type: "site.created",
    message: `Site "${site.name}" criado com o template ${template.name}`,
  });

  await db
    .update(templates)
    .set({ usageCount: (await currentUsage(template.id)) + 1 })
    .where(eq(templates.id, template.id));

  return site;
}

async function currentUsage(templateId: string): Promise<number> {
  const [row] = await db
    .select({ usageCount: templates.usageCount })
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);
  return row?.usageCount ?? 0;
}

export async function getOwnedSite(siteId: string, userId: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, userId)))
    .limit(1);
  return site ?? null;
}
