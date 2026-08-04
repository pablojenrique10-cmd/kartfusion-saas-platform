import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {


    const { id } =
      await context.params;


    const body =
      await request.json();



    console.log(
      "PLANO ATUALIZANDO:",
      id
    );


    console.log(
      "DADOS RECEBIDOS:",
      body
    );





    if (!id) {

      return NextResponse.json(
        {
          error:
          "ID do plano não informado"
        },
        {
          status:400
        }
      );

    }





    const price =
      Number(
        body.priceCents
      );



    if (
      Number.isNaN(price)
    ) {

      return NextResponse.json(
        {
          error:
          "Preço inválido"
        },
        {
          status:400
        }
      );

    }







    const result =
      await db
      .update(plans)
      .set({

        name:
          String(
            body.name ?? ""
          ),


        tagline:
          String(
            body.tagline ?? ""
          ),



        priceCents:
          price,



        maxSites:
          Number(
            body.maxSites ?? 0
          ),



        maxPages:
          Number(
            body.maxPages ?? 0
          ),



        storageMb:
          Number(
            body.storageMb ?? 0
          ),



        features:
          body.features ?? [],



        highlighted:
          Boolean(
            body.highlighted
          ),



      })
      .where(
        eq(
          plans.id,
          id
        )
      )
      .returning();







    console.log(
      "PLANO ATUALIZADO:",
      result
    );







    return NextResponse.json({

      success:true,

      plan:
        result[0]

    });








  } catch(error){


    console.error(
      "Erro atualizar plano:",
      error
    );



    return NextResponse.json(
      {
        error:
        "Erro ao atualizar plano"
      },
      {
        status:500
      }
    );


  }


}