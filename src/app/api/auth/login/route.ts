import { eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, users } from "@/db/schema";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { checkUserTrial } from "@/lib/checkTrial";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();

    const body = (await request.json()) as { email?: string; password?: string };

    const email = (body.email ?? "").trim().toLowerCase();

    const password = body.password ?? "";


    if (!email || !password) {
      return Response.json(
        { error: "Informe e-mail e senha." },
        { status: 400 }
      );
    }


    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);



    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }



    // Verifica se o teste grátis de 14 dias acabou
    await checkUserTrial(user.id);



    await setSessionCookie(user.id);



    await db.insert(activities).values({
      userId: user.id,
      type: "account.login",
      message: "Novo acesso à plataforma",
    });



    return Response.json({ ok: true });


  } catch (error) {

    console.error("login error", error);

    return Response.json(
      { error: "Não foi possível entrar." },
      { status: 500 }
    );

  }
}