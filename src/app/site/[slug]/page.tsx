import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { sites } from "@/db/schema";
import SectionRenderer from "@/components/site/SectionRenderer";
import { getCurrentUser } from "@/lib/auth";
import { loadSiteContent } from "@/lib/sites";

export const dynamic = "force-dynamic";

async function getSite(slug: string) {
  const [site] = await db.select().from(sites).where(eq(sites.slug, slug)).limit(1);
  return site ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return { title: "Site não encontrado" };

  const seo = (site.seo ?? {}) as Record<string, unknown>;
  const title = (seo.title as string) || site.name;
  const description = (seo.description as string) || site.description;
  const ogImage = seo.ogImage as string | undefined;

  return {
    title,
    description,
    keywords: seo.keywords as string | undefined,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: "website",
    },
    robots: seo.indexable === false ? { index: false } : undefined,
  };
}

export default async function PublicSitePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const site = await getSite(slug);
  if (!site) notFound();

  const viewer = await getCurrentUser();
  const isOwner = viewer?.id === site.userId;

  if (site.status !== "published" && !isOwner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🚧</span>
        <h1 className="text-2xl font-extrabold text-white">Este site ainda não foi publicado</h1>
        <p className="max-w-md text-sm text-slate-400">
          O criador ainda está trabalhando nele. Volte em breve para conferir o resultado.
        </p>
        <Link href="/" className="kf-btn kf-btn-primary">Conhecer o KartFusion</Link>
      </div>
    );
  }

  const content = await loadSiteContent(site.id);
  const page =
    content.pages.find((item) => item.path === `/${query.p ?? ""}`.replace(/\/$/, "") || item.id === query.p) ??
    content.pages.find((item) => item.isHome) ??
    content.pages[0];

  const sections = (page ? content.sections[page.id] : [])?.filter((section) => section.visible) ?? [];
  const theme = {
    primaryColor: site.primaryColor,
    secondaryColor: site.secondaryColor,
    fontFamily: site.fontFamily,
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {site.status !== "published" && isOwner && (
        <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-xs font-semibold text-black">
          👁 Pré-visualização — este site ainda está em rascunho.
          <Link href={`/editor/${site.id}`} className="underline">Voltar ao editor</Link>
        </div>
      )}

      {content.pages.length > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-1 bg-slate-950 px-4 py-2 text-xs text-white/70">
          {content.pages.map((item) => (
            <Link
              key={item.id}
              href={`/site/${site.slug}?p=${item.isHome ? "" : item.path.replace("/", "")}`}
              className={`rounded-md px-3 py-1 transition hover:bg-white/10 hover:text-white ${
                item.id === page?.id ? "bg-white/10 text-white" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      )}

      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} theme={theme} siteId={site.id} interactive />
      ))}

      <div className="flex items-center justify-center gap-2 bg-slate-950 px-4 py-3 text-[11px] text-white/50">
        Feito com
        <Link href="/" className="font-bold text-white/80 transition hover:text-white">
          KartFusion
        </Link>
      </div>
    </div>
  );
}
