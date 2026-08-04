import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";



export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id:string;
    }>
  }
){


  try{


    const { id } = await context.params;


    const body = await request.json();


    const role = body.role;



    if(!role){


      return NextResponse.json(
        {
          error:"Cargo não informado"
        },
        {
          status:400
        }
      );


    }




    const allowedRoles = [

      "owner",
      "admin",
      "moderator",
      "cliente"

    ];





    if(!allowedRoles.includes(role)){


      return NextResponse.json(
        {
          error:"Cargo inválido"
        },
        {
          status:400
        }
      );


    }






    await db
    .update(users)
    .set({

      role

    })
    .where(
      eq(
        users.id,
        id
      )
    );







    return NextResponse.json({

      success:true,

      role

    });





  }catch(error){


    console.error(
      "ERRO ALTERANDO CARGO:",
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