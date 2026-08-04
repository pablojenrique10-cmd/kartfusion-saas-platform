import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { asc } from "drizzle-orm";


export async function GET(){

  try{

    const data = await db
      .select()
      .from(plans)
      .orderBy(
        asc(plans.level)
      );


    return NextResponse.json(data);


  }catch(error){

    console.error(
      "Erro buscar planos:",
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao buscar planos"
      },
      {
        status:500
      }
    );

  }

}