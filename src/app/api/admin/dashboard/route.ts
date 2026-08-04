import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  sites,
  subscriptions,
  plans,
} from "@/db/schema";
import {
  count,
  eq,
  desc,
} from "drizzle-orm";


export async function GET(){

  try {


    const totalUsers = await db
      .select({
        count:count()
      })
      .from(users);



    const totalSites = await db
      .select({
        count:count()
      })
      .from(sites);





    const premiumUsers = await db
      .select({
        count:count()
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
        count:count()
      })
      .from(users)
      .where(
        eq(
          users.role,
          "owner"
        )
      );







    const subscriptionsCount = await db
      .select({
        count:count()
      })
      .from(subscriptions);






    const recentUsers = await db
      .select({
        id:users.id,
        name:users.name,
        email:users.email,
        planId:users.planId,
        createdAt:users.createdAt,
      })
      .from(users)
      .orderBy(
        desc(users.createdAt)
      )
      .limit(5);







    const recentSites = await db
      .select({
        id:sites.id,
        name:sites.name,
        status:sites.status,
        createdAt:sites.createdAt,
      })
      .from(sites)
      .orderBy(
        desc(sites.createdAt)
      )
      .limit(5);







    return NextResponse.json({

      users:
      totalUsers[0].count,

      sites:
      totalSites[0].count,

      premium:
      premiumUsers[0].count,

      trials:
      trialUsers[0].count,

      subscriptions:
      subscriptionsCount[0].count,


      recentUsers,

      recentSites,

    });




  }catch(error){


    console.error(error);


    return NextResponse.json(
      {
        error:"Erro dashboard"
      },
      {
        status:500
      }
    );


  }

}