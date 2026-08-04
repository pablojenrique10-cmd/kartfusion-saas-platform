import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  subscriptions,
  plans,
} from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(){

  try{


    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(
        eq(
          subscriptions.status,
          "active"
        )
      );



    const allPlans = await db
      .select()
      .from(plans);





    let revenue = 0;

    let premium = 0;

    let intermediate = 0;

    let basic = 0;





    activeSubscriptions.forEach((sub)=>{


      const plan = allPlans.find(
        p => p.id === sub.planId
      );



      if(plan){

        revenue += plan.priceCents;



        if(sub.planId === "premium"){

          premium++;

        }


        if(sub.planId === "intermediate"){

          intermediate++;

        }


        if(sub.planId === "basic"){

          basic++;

        }


      }



    });







    return NextResponse.json({

      revenueCents: revenue,

      activeCustomers:
      activeSubscriptions.length,

      plans:{
        premium,
        intermediate,
        basic
      }

    });






  }catch(error){


    console.error(
      "finance error",
      error
    );


    return NextResponse.json(
      {
        error:"Erro financeiro"
      },
      {
        status:500
      }
    );


  }

}