import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  sites,
} from "@/db/schema";
import {
  desc,
  eq,
  count,
} from "drizzle-orm";


export async function GET(){

  try {


    const data = await db
      .select({

        id: users.id,

        name: users.name,

        email: users.email,

        planId: users.planId,

        role: users.role,

        createdAt: users.createdAt,

        sites:
        count(sites.id),

      })

      .from(users)

      .leftJoin(
        sites,
        eq(
          sites.userId,
          users.id
        )
      )

      .groupBy(
        users.id
      )

      .orderBy(
        desc(users.createdAt)
      );




    return NextResponse.json(data);



  }catch(error){


    console.error(
      "Erro buscar usuários",
      error
    );


    return NextResponse.json(
      {
        error:
        "Erro ao buscar usuários"
      },
      {
        status:500
      }
    );


  }

}