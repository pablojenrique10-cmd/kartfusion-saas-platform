import { NextResponse } from "next/server";
import { db } from "@/db";

import {
  users,
  subscriptions,
  activities,
  notifications,
} from "@/db/schema";

import { eq } from "drizzle-orm";



export async function POST(
  request: Request,
  context: { params: Promise<{ id:string }> }
){

  try{


    const { id } =
      await context.params;



    const body =
      await request.json();



    const {
      action,
      planId
    } = body;





    if(!action){

      return NextResponse.json(
        {
          error:"Ação não informada"
        },
        {
          status:400
        }
      );

    }





    const [client] =
      await db
      .select({
        name: users.name,
      })
      .from(users)
      .where(
        eq(
          users.id,
          id
        )
      )
      .limit(1);



    const clientName =
      client?.name ?? "Cliente";







    /*
      ATIVAR PREMIUM
    */


    if(action === "premium"){



      await db
      .update(subscriptions)
      .set({

        status:"canceled",

        canceledAt:new Date()

      })
      .where(
        eq(
          subscriptions.userId,
          id
        )
      );







      await db
      .update(users)
      .set({

        planId:"premium",

        updatedAt:new Date()

      })
      .where(
        eq(
          users.id,
          id
        )
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
          new Date()
          .setFullYear(
            new Date()
            .getFullYear()+1
          )
        )

      });







      await db
      .insert(activities)
      .values({

        userId:id,

        type:"plan.premium",

        message:
        "Plano Premium ativado pelo administrador"

      });








      await db
      .insert(notifications)
      .values({

        userId:id,

        title:
        "👑 Premium ativado",

        message:
        `${clientName} recebeu o plano Premium`

      });



    }









    /*
      ALTERAR PLANO
    */


    if(action === "change_plan"){



      if(
        ![
          "basic",
          "intermediate",
          "premium"
        ]
        .includes(planId)
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







      await db
      .update(subscriptions)
      .set({

        status:"canceled",

        canceledAt:new Date()

      })
      .where(
        eq(
          subscriptions.userId,
          id
        )
      );







      await db
      .update(users)
      .set({

        planId,

        updatedAt:new Date()

      })
      .where(
        eq(
          users.id,
          id
        )
      );








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
          new Date()
          .setFullYear(
            new Date()
            .getFullYear()+1
          )
        )

      });








      await db
      .insert(activities)
      .values({

        userId:id,

        type:"plan.changed",

        message:
        `Plano alterado para ${planId}`

      });








      await db
      .insert(notifications)
      .values({

        userId:id,

        title:
        "💎 Plano alterado",

        message:
        `${clientName} mudou para o plano ${planId}`

      });



    }









    /*
      ENCERRAR TESTE GRÁTIS
    */


    if(action === "close_trial"){



      await db
      .update(users)
      .set({

        trialEndsAt:null,

        updatedAt:new Date()

      })
      .where(
        eq(
          users.id,
          id
        )
      );







      await db
      .insert(activities)
      .values({

        userId:id,

        type:"trial.closed",

        message:
        "Teste grátis encerrado pelo administrador"

      });








      await db
      .insert(notifications)
      .values({

        userId:id,

        title:
        "⚠️ Teste encerrado",

        message:
        `${clientName} teve o teste grátis encerrado`

      });



    }








    return NextResponse.json({

      success:true,

      message:
      "Ação executada com sucesso"

    });





  }catch(error){


    console.error(
      "Erro ação usuário:",
      error
    );



    return NextResponse.json(
      {
        error:
        "Erro ao executar ação"
      },
      {
        status:500
      }
    );


  }

}