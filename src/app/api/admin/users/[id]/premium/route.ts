import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function POST(
  request: Request,
  context: { params: Promise<{ id:string }> }
){

  try {


    const { id } = await context.params;



    await db
      .update(users)
      .set({
        planId:"premium",
        updatedAt:new Date(),
      })
      .where(
        eq(users.id,id)
      );





    await db
      .insert(subscriptions)
      .values({

        userId:id,

        planId:"premium",

        status:"active",

        provider:"internal",

        startedAt:new Date(),

        currentPeriodEnd:
          new Date(
            new Date().setFullYear(
              new Date().getFullYear()+1
            )
          )

      });






    return NextResponse.json({

      success:true,

      message:
      "Usuário ativado como Premium"

    });




  } catch(error){


    console.error(error);


    return NextResponse.json(

      {
        error:"Erro ao ativar premium"
      },

      {
        status:500
      }

    );


  }

}