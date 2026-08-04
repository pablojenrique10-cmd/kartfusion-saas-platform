import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { sites, activities } from "@/db/schema";

import { getCurrentUser } from "@/lib/auth";


export const dynamic = "force-dynamic";


type Context = {
  params: Promise<{
    id: string;
  }>;
};





export async function GET(
  _request: Request,
  context: Context
){

  try {


    const admin =
      await getCurrentUser();



    if(!admin){

      return NextResponse.json(
        {
          error:"Não autenticado"
        },
        {
          status:401
        }
      );

    }




    const { id } =
      await context.params;




    const result =
      await db
      .select()
      .from(sites)
      .where(
        eq(
          sites.id,
          id
        )
      )
      .limit(1);





    const site =
      result[0];




    if(!site){

      return NextResponse.json(
        {
          error:"Site não encontrado"
        },
        {
          status:404
        }
      );

    }




    return NextResponse.json({

      site

    });





  }catch(error){


    console.error(
      "Erro buscar editor:",
      error
    );


    return NextResponse.json(
      {
        error:"Erro ao carregar editor"
      },
      {
        status:500
      }
    );


  }


}
export async function PATCH(
  request: Request,
  context: Context
){

  try {


    const admin =
      await getCurrentUser();



    if(!admin){

      return NextResponse.json(
        {
          error:"Não autenticado"
        },
        {
          status:401
        }
      );

    }





    const { id } =
      await context.params;



    const body =
      await request.json();





    const updateData:any = {

      updatedAt:
      new Date()

    };





    if(typeof body.name === "string"){

      updateData.name =
        body.name.trim();

    }



    if(typeof body.description === "string"){

      updateData.description =
        body.description;

    }



    if(typeof body.primaryColor === "string"){

      updateData.primaryColor =
        body.primaryColor;

    }



    if(typeof body.secondaryColor === "string"){

      updateData.secondaryColor =
        body.secondaryColor;

    }



    if(typeof body.fontFamily === "string"){

      updateData.fontFamily =
        body.fontFamily;

    }



    if(body.settings){

      updateData.settings =
        body.settings;

    }



    if(body.seo){

      updateData.seo =
        body.seo;

    }







    const result =
      await db
      .update(sites)
      .set(updateData)
      .where(
        eq(
          sites.id,
          id
        )
      )
      .returning();






    const updatedSite =
      result[0];





    if(!updatedSite){

      return NextResponse.json(
        {
          error:"Site não encontrado"
        },
        {
          status:404
        }
      );

    }







    await db
    .insert(activities)
    .values({

      userId:
      admin.id,

      type:
      "admin.site.updated",

      message:
      `Administrador alterou o site "${updatedSite.name}"`

    });








    return NextResponse.json({

      success:true,

      site:
      updatedSite

    });







  }catch(error){


    console.error(
      "Erro salvar editor:",
      error
    );



    return NextResponse.json(
      {
        error:
        "Erro ao salvar alterações"
      },
      {
        status:500
      }
    );


  }


}