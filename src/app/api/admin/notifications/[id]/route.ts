import { NextResponse } from "next/server";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq } from "drizzle-orm";



export async function PATCH(
  request: Request,
  context:{
    params:Promise<{
      id:string
    }>
  }
){


  try{


    const {id} =
    await context.params;



    await db
      .update(notifications)
      .set({

        read:true

      })
      .where(
        eq(
          notifications.id,
          id
        )
      );



    return NextResponse.json({

      success:true

    });



  }catch(error){


    return NextResponse.json(
      {
        error:
        "Erro ao atualizar"
      },
      {
        status:500
      }
    );


  }


}