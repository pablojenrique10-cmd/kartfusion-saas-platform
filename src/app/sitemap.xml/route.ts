import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sites } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  let published: { slug: string; updatedAt: Date }[] = [];
  try {
    published = await db
      .select({ slug: sites.slug, updatedAt: sites.updatedAt })
      .from(sites)
      .where(eq(sites.status, "published"));
  } catch {
    published = [];
  }

  const staticUrls = ["", "/precos", "/login", "/cadastro"];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls
  .map((path) => `  <url><loc>${origin}${path}</loc><changefreq>weekly</changefreq></url>`)
  .join("\n")}
${published
  .map(
    (site) =>
      `  <url><loc>${origin}/site/${site.slug}</loc><lastmod>${new Date(site.updatedAt).toISOString()}</lastmod></url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
