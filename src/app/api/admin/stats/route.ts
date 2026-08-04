import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  sites,
  subscriptions,
} from "@/db/schema";
import {
  count,
  eq,
} from "drizzle-orm";


export async function GET() {

  try {


    const totalUsers = await db
      .select({
        total: count(),
      })
      .from(users);



    const totalSites = await db
      .select({
        total: count(),
      })
      .from(sites);





    const premiumUsers = await db
      .select({
        total: count(),
      })
      .from(users)
      .where(
        eq(
          users.planId,
          "premium"
        )
      );





    const trialUsers = await db
      .select({
        total: count(),
      })
      .from(subscriptions)
      .where(
        eq(
          subscriptions.status,
          "trialing"
        )
      );





    const activeSubscriptions = await db
      .select({
        total: count(),
      })
      .from(subscriptions)
      .where(
        eq(
          subscriptions.status,
          "active"
        )
      );






    return NextResponse.json({

      users:
        Number(totalUsers[0]?.total ?? 0),


      sites:
        Number(totalSites[0]?.total ?? 0),


      premium:
        Number(premiumUsers[0]?.total ?? 0),


      trials:
        Number(trialUsers[0]?.total ?? 0),


      subscriptions:
        Number(activeSubscriptions[0]?.total ?? 0),


    });



  } catch(error){


    console.error(
      "Erro stats admin:",
      error
    );



    return NextResponse.json(

      {
        error:
        "Erro ao carregar estatísticas"
      },

      {
        status:500
      }

    );


  }

}