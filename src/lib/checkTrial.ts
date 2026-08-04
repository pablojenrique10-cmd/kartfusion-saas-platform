import { db } from "@/db";
import {
  users,
  subscriptions,
} from "@/db/schema";
import {
  eq,
  and,
} from "drizzle-orm";


export async function checkUserTrial(userId:string){


  const result = await db
    .select()
    .from(users)
    .where(
      eq(
        users.id,
        userId
      )
    )
    .limit(1);



  const user = result[0];



  if(!user){

    return null;

  }





  if(
    user.trialEndsAt &&
    new Date(user.trialEndsAt) < new Date()
  ){


    await db
      .update(users)
      .set({

        planId:"basic",

        trialEndsAt:null,

        updatedAt:new Date(),

      })
      .where(
        eq(
          users.id,
          userId
        )
      );





    await db
      .update(subscriptions)
      .set({

        status:"expired"

      })
      .where(

        and(

          eq(
            subscriptions.userId,
            userId
          ),

          eq(
            subscriptions.status,
            "trialing"
          )

        )

      );




    return {
      expired:true
    };


  }




  return {
    expired:false
  };


}