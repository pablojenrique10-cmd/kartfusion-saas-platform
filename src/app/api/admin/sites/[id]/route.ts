import { NextResponse } from "next/server";
import { db } from "@/db";
import { sites } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function PATCH(
  request: Request,
  context: { params: Promise<{ id:string }> }
){

  try{


    const { id } = await context.params;


    const body = await request.json();


    const {
      action
    } = body;





    if(action === "block"){


      await db
        .update(sites)
        .set({

          status:"blocked",

          updatedAt:new Date()

        })
        .where(
          eq(
            sites.id,
            id
          )
        );


    }






    if(action === "publish"){


      await db
        .update(sites)
        .set({

          status:"published",

          updatedAt:new Date()

        })
        .where(
          eq(
            sites.id,
            id
          )
        );


    }








    if(action === "delete"){


      await db
        .delete(sites)
        .where(
          eq(
            sites.id,
            id
          )
        );


    }







    return NextResponse.json({

      success:true

    });





  }catch(error){


    console.error(
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao atualizar site"
      },
      {
        status:500
      }
    );


  }


}