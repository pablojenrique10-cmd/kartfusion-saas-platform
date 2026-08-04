import { NextResponse } from "next/server";
import { db } from "@/db";
import { sites, templates } from "@/db/schema";
import { eq } from "drizzle-orm";


export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await context.params;


    const result = await db
      .select({
        id: sites.id,
        name: sites.name,
        slug: sites.slug,
        description: sites.description,
        status: sites.status,
        templateId: sites.templateId,
        createdAt: sites.createdAt,
        templateName: templates.name,
      })
      .from(sites)
      .leftJoin(
        templates,
        eq(sites.templateId, templates.id)
      )
      .where(
        eq(sites.userId, id)
      );



    return NextResponse.json(result);



  } catch(error){

    console.error(error);


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