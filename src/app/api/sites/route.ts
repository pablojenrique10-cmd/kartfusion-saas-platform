import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  activities,
  notifications,
  sites
} from "@/db/schema";

import { getCurrentUser } from "@/lib/auth";
import { getTemplate } from "@/lib/templates";
import { createSiteFromTemplate } from "@/lib/sites";
import { ensureSeeded } from "@/lib/seed";


export const dynamic = "force-dynamic";



export async function GET() {

  const user = await getCurrentUser();

  if (!user)
    return Response.json(
      {
        error:"Não autenticado"
      },
      {
        status:401
      }
    );



  const rows = await db
    .select()
    .from(sites)
    .where(
      eq(
        sites.userId,
        user.id
      )
    )
    .orderBy(
      desc(
        sites.updatedAt
      )
    );



  return Response.json({
    sites:rows
  });

}





export async function POST(
  request: Request
) {


  const user = await getCurrentUser();


  if (!user)
    return Response.json(
      {
        error:"Não autenticado"
      },
      {
        status:401
      }
    );




  try {



    await ensureSeeded();



    const body =
      (await request.json()) as {

        name?:string;

        description?:string;

        templateId?:string;

        primaryColor?:string;

        secondaryColor?:string;

        fontFamily?:string;

      };





    const name =
      (body.name ?? "").trim();





    if(name.length < 2){

      return Response.json(
        {
          error:
          "Informe o nome do site."
        },
        {
          status:400
        }
      );

    }






    const [countRow] =
      await db
      .select({
        total:
        sql<number>`count(*)::int`
      })
      .from(sites)
      .where(
        eq(
          sites.userId,
          user.id
        )
      );





    if(
      (countRow?.total ?? 0)
      >= user.plan.maxSites
    ){

      return Response.json(
        {
          error:
          `Seu plano permite até ${user.plan.maxSites} site(s). Faça upgrade para criar mais.`,
          upgrade:true
        },
        {
          status:403
        }
      );

    }







    const template =
      getTemplate(
        body.templateId ?? "empresa"
      );





    if(
      template.minPlanLevel >
      user.plan.level
    ){

      return Response.json(
        {
          error:
          `O template ${template.name} exige um plano superior.`,
          upgrade:true
        },
        {
          status:403
        }
      );

    }








    const site =
      await createSiteFromTemplate({

        userId:
          user.id,

        name,

        description:
          body.description,

        templateId:
          template.id,

        primaryColor:
          body.primaryColor,

        secondaryColor:
          body.secondaryColor,

        fontFamily:
          body.fontFamily,

      });








    // 📜 Histórico do cliente

    await db.insert(activities)
    .values({

      userId:user.id,

      type:
      "site.created",

      message:
      `Site "${site.name}" criado`,

    });







    // 🔔 Notificação Admin

    await db.insert(notifications)
    .values({

      userId:user.id,

      title:
      "🌐 Novo site criado",

      message:
      `${user.name} criou o site "${site.name}"`,

    });








    return Response.json({

      ok:true,

      site

    });







  } catch(error){


    console.error(
      "create site error",
      error
    );



    return Response.json(
      {
        error:
        "Não foi possível criar o site."
      },
      {
        status:500
      }
    );


  }


}