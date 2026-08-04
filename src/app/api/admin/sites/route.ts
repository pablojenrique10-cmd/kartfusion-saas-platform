import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  sites,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";



export async function GET(){


  try{


    const data = await db
      .select({

        id: sites.id,

        name: sites.name,

        slug: sites.slug,

        status: sites.status,

        templateId: sites.templateId,

        createdAt: sites.createdAt,

        userName: users.name,

        userEmail: users.email,

      })
      .from(sites)
      .leftJoin(
        users,
        eq(
          sites.userId,
          users.id
        )
      );





    return NextResponse.json(data);




  }catch(error){


    console.error(
      "sites admin error",
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao buscar sites"
      },
      {
        status:500
      }
    );


  }


}