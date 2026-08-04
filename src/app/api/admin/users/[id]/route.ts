import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  sites,
  subscriptions,
} from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(
  request: Request,
  context: { params: Promise<{ id:string }> }
){

  try{


    const { id } = await context.params;



    const userResult = await db
      .select()
      .from(users)
      .where(
        eq(
          users.id,
          id
        )
      )
      .limit(1);



    if(!userResult[0]){

      return NextResponse.json(
        {
          error:"Usuário não encontrado"
        },
        {
          status:404
        }
      );

    }




    const userSites = await db
      .select()
      .from(sites)
      .where(
        eq(
          sites.userId,
          id
        )
      );





    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(
        eq(
          subscriptions.userId,
          id
        )
      )
      .limit(1);






    return NextResponse.json({

      user:userResult[0],

      sites:userSites,

      subscription:
      userSubscription[0] ?? null

    });




  }catch(error){


    console.error(
      "Erro detalhes usuário:",
      error
    );


    return NextResponse.json(
      {
        error:"Erro interno"
      },
      {
        status:500
      }
    );


  }

}