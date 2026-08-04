import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  users,
  sites,
  subscriptions,
} from "@/db/schema";


export async function GET(){

  try{


    const totalUsers = await db
      .select()
      .from(users);



    const totalSites = await db
      .select()
      .from(sites);



    const activeSubscriptions = await db
      .select()
      .from(subscriptions);





    const plans = {

      premium:
      activeSubscriptions.filter(
        item =>
        item.planId === "premium" &&
        item.status === "active"
      ).length,


      intermediate:
      activeSubscriptions.filter(
        item =>
        item.planId === "intermediate" &&
        item.status === "active"
      ).length,


      basic:
      activeSubscriptions.filter(
        item =>
        item.planId === "basic" &&
        item.status === "active"
      ).length,

    };






    return NextResponse.json({

      users:
      totalUsers.length,


      sites:
      totalSites.length,


      subscriptions:
      activeSubscriptions.filter(
        item =>
        item.status === "active"
      ).length,


      plans


    });



  }catch(error){


    console.error(
      error
    );


    return NextResponse.json(
      {
        error:"Erro métricas"
      },
      {
        status:500
      }
    );

  }

}