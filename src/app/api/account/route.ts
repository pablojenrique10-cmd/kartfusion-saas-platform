import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { isValidEmail } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const current = await getCurrentUser();
  if (!current) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    avatarColor?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.name === "string" && body.name.trim().length > 1) patch.name = body.name.trim();
  if (typeof body.company === "string") patch.company = body.company.trim();
  if (typeof body.phone === "string") patch.phone = body.phone.trim();
  if (typeof body.avatarColor === "string") patch.avatarColor = body.avatarColor;

  if (typeof body.email === "string" && body.email.trim().toLowerCase() !== current.email) {
    const email = body.email.trim().toLowerCase();
    if (!isValidEmail(email)) return Response.json({ error: "E-mail inválido." }, { status: 400 });
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing) return Response.json({ error: "Este e-mail já está em uso." }, { status: 409 });
    patch.email = email;
  }

  if (body.newPassword) {
    if (body.newPassword.length < 6) {
      return Response.json({ error: "A nova senha deve ter no mínimo 6 caracteres." }, { status: 400 });
    }
    const [row] = await db.select().from(users).where(eq(users.id, current.id)).limit(1);
    if (!row || !verifyPassword(body.currentPassword ?? "", row.passwordHash)) {
      return Response.json({ error: "Senha atual incorreta." }, { status: 400 });
    }
    patch.passwordHash = hashPassword(body.newPassword);
  }

  await db.update(users).set(patch).where(eq(users.id, current.id));
  return Response.json({ ok: true });
}
