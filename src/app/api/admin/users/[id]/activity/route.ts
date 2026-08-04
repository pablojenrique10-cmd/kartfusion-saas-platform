import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  activities,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(
  request: Request,
  context:{
    params: Promise<{id:string}>
  }
){

  try{


    const { id } = await context.params;



    const data = await db
      .select({

        id: activities.id,

        type: activities.type,

        message: activities.message,

        createdAt: activities.createdAt,

        userName: users.name,

      })
      .from(activities)
      .leftJoin(
        users,
        eq(
          activities.userId,
          users.id
        )
      )
      .where(
        eq(
          activities.userId,
          id
        )
      );




    return NextResponse.json(data);



  }catch(error){


    console.error(
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao buscar atividades"
      },
      {
        status:500
      }
    );


  }

}