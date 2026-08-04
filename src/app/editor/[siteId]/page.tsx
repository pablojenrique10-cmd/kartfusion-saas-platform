import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditorShell from "@/components/editor/EditorShell";
import { requireUser } from "@/lib/auth";
import { createSection, uid } from "@/lib/blocks";
import { getOwnedSite, loadSiteContent } from "@/lib/sites";

export const metadata: Metadata = { title: "Editor visual" };
export const dynamic = "force-dynamic";

export default async function EditorPage({ params }: { params: Promise<{ siteId: string }> }) {
  const user = await requireUser();
  const { siteId } = await params;

  const site = await getOwnedSite(siteId, user.id);
  if (!site) notFound();

  const content = await loadSiteContent(site.id);

  if (content.pages.length === 0) {
    const pageId = uid("page");
    content.pages = [{ id: pageId, name: "Início", path: "/", isHome: true, position: 0, seo: {} }];
    content.sections = {
      [pageId]: [createSection("header", 0), createSection("banner", 1), createSection("footer", 2)],
    };
  }

  return (
    <EditorShell
      initialMeta={{
        id: site.id,
        name: site.name,
        slug: site.slug,
        description: site.description,
        status: site.status,
        primaryColor: site.primaryColor,
        secondaryColor: site.secondaryColor,
        fontFamily: site.fontFamily,
        customDomain: site.customDomain ?? "",
        seo: (site.seo ?? {}) as Record<string, unknown>,
        settings: (site.settings ?? {}) as Record<string, unknown>,
      }}
      initialPages={content.pages}
      initialSections={content.sections}
      planLevel={user.plan.level}
      planName={user.plan.planName}
      maxPages={user.plan.maxPages}
      storageMb={user.plan.storageMb}
    />
  );
}
