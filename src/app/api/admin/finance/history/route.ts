import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  subscriptions,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(){

  try{


    const data = await db
      .select({

        id: subscriptions.id,

        planId: subscriptions.planId,

        status: subscriptions.status,

        startedAt: subscriptions.startedAt,

        createdAt: subscriptions.createdAt,

        userName: users.name,

        userEmail: users.email,

      })
      .from(subscriptions)
      .leftJoin(
        users,
        eq(
          subscriptions.userId,
          users.id
        )
      )
      .orderBy(
        subscriptions.createdAt
      );





    return NextResponse.json(data);



  }catch(error){


    console.error(
      "finance history error",
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao buscar histórico"
      },
      {
        status:500
      }
    );


  }

}