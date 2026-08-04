import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  subscriptions,
} from "@/db/schema";
import {
  eq,
  and,
} from "drizzle-orm";


export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {


    const { id } = await context.params;


    const body = await request.json();


    const { planId } = body;



    if(
      !planId ||
      ![
        "basic",
        "intermediate",
        "premium"
      ].includes(planId)
    ){

      return NextResponse.json(
        {
          error:"Plano inválido"
        },
        {
          status:400
        }
      );

    }




    // Atualiza o plano do usuário

    await db
      .update(users)
      .set({

        planId,

        updatedAt:new Date(),

      })
      .where(
        eq(
          users.id,
          id
        )
      );






    // Procura assinatura ativa existente

    const existing = await db
      .select()
      .from(subscriptions)
      .where(
        eq(
          subscriptions.userId,
          id
        )
      )
      .limit(1);






    if(existing.length > 0){


      await db
        .update(subscriptions)
        .set({

          planId,

          status:"active",

          currentPeriodEnd:
          new Date(
            new Date().setFullYear(
              new Date().getFullYear()+1
            )
          ),

        })
        .where(
          eq(
            subscriptions.id,
            existing[0].id
          )
        );



    }else{


      await db
        .insert(subscriptions)
        .values({

          userId:id,

          planId,

          status:"active",

          provider:"internal",

          startedAt:new Date(),

          currentPeriodEnd:
          new Date(
            new Date().setFullYear(
              new Date().getFullYear()+1
            )
          ),

        });


    }






    return NextResponse.json({

      success:true,

      message:
      `Plano alterado para ${planId}`

    });




  } catch(error){


    console.error(
      "Erro alterar plano:",
      error
    );


    return NextResponse.json(

      {
        error:"Erro ao alterar plano"
      },

      {
        status:500
      }

    );


  }

}