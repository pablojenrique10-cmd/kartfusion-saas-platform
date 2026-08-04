import { eq } from "drizzle-orm";
import { db } from "@/db";

import {
  activities,
  notifications,
  subscriptions,
  users
} from "@/db/schema";

import {
  hashPassword,
  setSessionCookie
} from "@/lib/auth";

import { TRIAL_DAYS } from "@/lib/plans";
import { ensureSeeded } from "@/lib/seed";
import { isValidEmail } from "@/lib/utils";


export const dynamic = "force-dynamic";


const COLORS = [
  "#2f7bff",
  "#22e58a",
  "#a855f7",
  "#f97316",
  "#0ea5e9",
  "#f43f5e"
];



export async function POST(request: Request) {

  try {

    await ensureSeeded();



    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };



    const name =
      (body.name ?? "").trim();


    const email =
      (body.email ?? "").trim().toLowerCase();


    const password =
      body.password ?? "";





    if (name.length < 2) {

      return Response.json(
        {
          error:
          "Informe seu nome completo."
        },
        {
          status:400
        }
      );

    }





    if (!isValidEmail(email)) {

      return Response.json(
        {
          error:
          "Informe um e-mail válido."
        },
        {
          status:400
        }
      );

    }





    if (password.length < 6) {

      return Response.json(
        {
          error:
          "A senha deve ter no mínimo 6 caracteres."
        },
        {
          status:400
        }
      );

    }







    const [existing] =
      await db
      .select({
        id: users.id
      })
      .from(users)
      .where(
        eq(
          users.email,
          email
        )
      )
      .limit(1);





    if (existing) {

      return Response.json(
        {
          error:
          "Este e-mail já está cadastrado."
        },
        {
          status:409
        }
      );

    }







    const trialEndsAt =
      new Date(
        Date.now() +
        TRIAL_DAYS * 86_400_000
      );








    const [user] =
      await db
      .insert(users)
      .values({

        name,

        email,


        passwordHash:
          hashPassword(password),


        // NOVOS USUÁRIOS SEMPRE ENTRAM COMO CLIENTE
        role:
          "cliente",


        planId:
          "basic",


        trialEndsAt,


        avatarColor:
          COLORS[
            Math.floor(
              Math.random() *
              COLORS.length
            )
          ],


      })
      .returning();









    await db
    .insert(subscriptions)
    .values({

      userId:
        user.id,


      planId:
        "premium",


      status:
        "trialing",


      provider:
        "internal",


      currentPeriodEnd:
        trialEndsAt,

    });









    await db
    .insert(activities)
    .values({

      userId:
        user.id,


      type:
        "account.created",


      message:
        `Conta criada com ${TRIAL_DAYS} dias de teste Premium`,

    });









    await db
    .insert(notifications)
    .values({

      userId:
        user.id,


      title:
        "🎉 Novo usuário cadastrado",


      message:
        `${user.name} criou uma conta no KartFusion`,

    });









    await setSessionCookie(
      user.id
    );









    return Response.json({

      ok:true,


      user:{

        id:user.id,

        name:user.name,

        email:user.email,

        role:user.role

      }

    });







  } catch(error){


    console.error(
      "register error",
      error
    );



    return Response.json(
      {
        error:
        "Não foi possível concluir o cadastro."
      },
      {
        status:500
      }
    );


  }


}