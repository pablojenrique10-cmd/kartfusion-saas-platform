import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { activities, media } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_INLINE_BYTES = 2_500_000; // ~2.5MB por arquivo

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const rows = await db
    .select()
    .from(media)
    .where(eq(media.userId, user.id))
    .orderBy(desc(media.createdAt))
    .limit(200);

  const [usage] = await db
    .select({ total: sql<number>`coalesce(sum(size_bytes), 0)::bigint` })
    .from(media)
    .where(eq(media.userId, user.id));

  return Response.json({ media: rows, usedBytes: Number(usage?.total ?? 0) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Não autenticado" }, { status: 401 });

  try {
    const body = (await request.json()) as {
      name?: string;
      url?: string;
      mimeType?: string;
      sizeBytes?: number;
      folder?: string;
      siteId?: string;
    };

    const url = (body.url ?? "").trim();
    if (!url) return Response.json({ error: "Informe a URL ou envie um arquivo." }, { status: 400 });

    const isInline = url.startsWith("data:");
    const sizeBytes = body.sizeBytes ?? (isInline ? Math.round((url.length * 3) / 4) : 0);

    if (isInline && sizeBytes > MAX_INLINE_BYTES) {
      return Response.json({ error: "Arquivo muito grande (máx. 2.5MB)." }, { status: 413 });
    }

    const [usage] = await db
      .select({ total: sql<number>`coalesce(sum(size_bytes), 0)::bigint` })
      .from(media)
      .where(eq(media.userId, user.id));

    const usedMb = Number(usage?.total ?? 0) / (1024 * 1024);
    if (usedMb + sizeBytes / (1024 * 1024) > user.plan.storageMb) {
      return Response.json(
        { error: "Limite de armazenamento do plano atingido.", upgrade: true },
        { status: 403 },
      );
    }

    const [item] = await db
      .insert(media)
      .values({
        userId: user.id,
        siteId: body.siteId ?? null,
        name: (body.name ?? "imagem").slice(0, 120),
        url,
        provider: isInline ? "inline" : "url",
        mimeType: body.mimeType ?? "image/jpeg",
        sizeBytes,
        folder: body.folder ?? "geral",
      })
      .returning();

    await db.insert(activities).values({
      userId: user.id,
      type: "media.uploaded",
      message: `Mídia "${item.name}" adicionada à biblioteca`,
    });

    return Response.json({ ok: true, media: item });
  } catch (error) {
    console.error("media error", error);
    return Response.json({ error: "Não foi possível salvar a mídia." }, { status: 500 });
  }
}
