import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  activities,
  notifications,
  sites
} from "@/db/schema";

import { getCurrentUser } from "@/lib/auth";
import {
  getOwnedSite,
  loadSiteContent,
  uniqueSlug
} from "@/lib/sites";

import { slugify } from "@/lib/utils";


export const dynamic = "force-dynamic";


type Ctx = {
  params: Promise<{
    id:string
  }>
};



export async function GET(
  _request: Request,
  ctx: Ctx
) {

  const user =
    await getCurrentUser();


  if(!user)
    return Response.json(
      {
        error:"Não autenticado"
      },
      {
        status:401
      }
    );



  const {id} =
    await ctx.params;



  const site =
    await getOwnedSite(
      id,
      user.id
    );


  if(!site)
    return Response.json(
      {
        error:"Site não encontrado"
      },
      {
        status:404
      }
    );



  const content =
    await loadSiteContent(
      site.id
    );


  return Response.json({
    site,
    content
  });

}









export async function PATCH(
  request: Request,
  ctx: Ctx
) {


  const user =
    await getCurrentUser();


  if(!user)
    return Response.json(
      {
        error:"Não autenticado"
      },
      {
        status:401
      }
    );



  const {id} =
    await ctx.params;



  const site =
    await getOwnedSite(
      id,
      user.id
    );



  if(!site)
    return Response.json(
      {
        error:"Site não encontrado"
      },
      {
        status:404
      }
    );





  const body =
    await request.json() as Record<string, unknown>;



  const patch:Record<string,unknown> = {

    updatedAt:
    new Date()

  };




  let publishing = false;



  if(
    typeof body.status === "string" &&
    ["draft","published"]
    .includes(body.status)
  ){

    patch.status =
      body.status;



    if(
      body.status === "published" &&
      site.status !== "published"
    ){

      publishing = true;

      patch.publishedAt =
        new Date();

    }

  }






  if(
    typeof body.name === "string" &&
    body.name.trim().length > 1
  )
    patch.name =
      body.name.trim();



  if(typeof body.description === "string")
    patch.description =
      body.description;



  if(typeof body.primaryColor === "string")
    patch.primaryColor =
      body.primaryColor;



  if(typeof body.secondaryColor === "string")
    patch.secondaryColor =
      body.secondaryColor;



  if(typeof body.fontFamily === "string")
    patch.fontFamily =
      body.fontFamily;






  if(typeof body.customDomain === "string"){

    if(
      user.plan.level < 3 &&
      body.customDomain.trim()
    ){

      return Response.json(
        {
          error:
          "Domínio personalizado é um recurso Premium.",
          upgrade:true
        },
        {
          status:403
        }
      );

    }


    patch.customDomain =
      body.customDomain.trim() || null;

  }






  if(
    body.settings &&
    typeof body.settings === "object"
  )
    patch.settings =
      body.settings;



  if(
    body.seo &&
    typeof body.seo === "object"
  )
    patch.seo =
      body.seo;






  if(
    typeof body.slug === "string" &&
    slugify(body.slug) &&
    slugify(body.slug) !== site.slug
  ){

    patch.slug =
      await uniqueSlug(body.slug);

  }







  const [updated] =
    await db
    .update(sites)
    .set(patch)
    .where(
      eq(
        sites.id,
        site.id
      )
    )
    .returning();







  if(publishing){


    await db
    .insert(activities)
    .values({

      userId:user.id,

      type:
      "site.published",

      message:
      `Site "${site.name}" publicado`

    });





    await db
    .insert(notifications)
    .values({

      userId:user.id,

      title:
      "🌐 Site publicado",

      message:
      `${user.name} publicou o site "${site.name}"`

    });



  }






  return Response.json({
    ok:true,
    site:updated
  });


}









export async function DELETE(
  _request: Request,
  ctx: Ctx
) {


  const user =
    await getCurrentUser();



  if(!user)
    return Response.json(
      {
        error:"Não autenticado"
      },
      {
        status:401
      }
    );



  const {id} =
    await ctx.params;



  const site =
    await getOwnedSite(
      id,
      user.id
    );



  if(!site)
    return Response.json(
      {
        error:"Site não encontrado"
      },
      {
        status:404
      }
    );



  await db
  .delete(sites)
  .where(
    eq(
      sites.id,
      site.id
    )
  );



  await db
  .insert(activities)
  .values({

    userId:user.id,

    type:
    "site.deleted",

    message:
    `Site "${site.name}" foi excluído`

  });



  return Response.json({
    ok:true
  });

}