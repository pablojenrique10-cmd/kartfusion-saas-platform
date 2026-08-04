import { notFound } from "next/navigation";
import Link from "next/link";

import { db } from "@/db";
import { sites, users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";
import { loadSiteContent } from "@/lib/sites";


export const dynamic = "force-dynamic";


type Props = {
  params: Promise<{
    id: string;
  }>;
};



export default async function AdminEditorPage({
  params,
}: Props) {


  const admin = await getCurrentUser();



  if (!admin) {
    notFound();
  }



  const { id } = await params;



  const result = await db
    .select({
      site: sites,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(sites)
    .leftJoin(
      users,
      eq(
        sites.userId,
        users.id
      )
    )
    .where(
      eq(
        sites.id,
        id
      )
    )
    .limit(1);



  const data = result[0];



  if (!data) {
    notFound();
  }



  const site = data.site;
  const owner = data.owner;



  const content =
    await loadSiteContent(site.id);





  return (

    <div className="
    min-h-screen
    bg-zinc-950
    text-white
    ">


      <header className="
      sticky
      top-0
      z-40
      flex
      items-center
      justify-between
      border-b
      border-zinc-800
      bg-zinc-950/90
      backdrop-blur
      px-6
      py-4
      ">


        <div>

          <h1 className="
          text-xl
          font-bold
          ">
            ✏️ Editor Admin
          </h1>


          <p className="
          text-sm
          text-zinc-400
          ">
            {site.name} · Cliente: {owner?.name}
          </p>

        </div>




        <div className="
        flex
        gap-3
        ">


          <Link
            href={`/site/${site.slug}`}
            target="_blank"
            className="
            rounded-xl
            bg-zinc-800
            px-5
            py-2
            hover:bg-zinc-700
            "
          >
            👀 Ver site
          </Link>



          <Link
            href={`/dashboard/admin/sites/${site.id}`}
            className="
            rounded-xl
            bg-zinc-800
            px-5
            py-2
            hover:bg-zinc-700
            "
          >
            ← Voltar
          </Link>


        </div>


      </header>
      <main className="
      grid
      min-h-[calc(100vh-80px)]
      lg:grid-cols-[260px_1fr_300px]
      ">



        {/* BLOCOS */}

        <aside className="
        border-r
        border-zinc-800
        bg-zinc-900
        p-5
        ">


          <h2 className="
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-zinc-400
          ">
            🧩 Elementos
          </h2>



          <div className="
          mt-5
          space-y-3
          ">


            {[
              "Título",
              "Texto",
              "Imagem",
              "Botão",
              "Galeria",
              "Depoimentos",
              "FAQ",
              "Contato",
            ].map((block)=>(
              
              <button
                key={block}
                className="
                w-full
                rounded-xl
                border
                border-zinc-800
                bg-zinc-950
                px-4
                py-3
                text-left
                text-sm
                hover:border-green-500
                transition
                "
              >

                ➕ {block}

              </button>

            ))}


          </div>


        </aside>








        {/* ÁREA DO SITE */}

        <section className="
        bg-zinc-950
        p-6
        ">


          <div className="
          flex
          h-full
          items-center
          justify-center
          rounded-3xl
          border
          border-zinc-800
          bg-white
          p-8
          ">


            <div className="
            w-full
            max-w-4xl
            text-black
            ">


              <div className="
              rounded-2xl
              bg-gradient-to-r
              from-green-600
              to-blue-600
              p-10
              text-center
              text-white
              ">


                <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                ">
                  Preview
                </p>


                <h2 className="
                mt-3
                text-4xl
                font-bold
                ">
                  {site.name}
                </h2>


                <p className="
                mt-3
                opacity-80
                ">
                  {site.description ??
                  "Seu site profissional"}
                </p>


              </div>





              <div className="
              mt-5
              grid
              gap-4
              md:grid-cols-3
              ">


                {
                  [
                    "⚡ Rápido",
                    "🎨 Moderno",
                    "📱 Responsivo",
                  ].map(item=>(

                    <div
                    key={item}
                    className="
                    rounded-xl
                    border
                    border-zinc-200
                    p-5
                    text-center
                    "
                    >

                      {item}

                    </div>

                  ))
                }


              </div>



            </div>


          </div>


        </section>








        {/* PROPRIEDADES */}

        <aside className="
        border-l
        border-zinc-800
        bg-zinc-900
        p-5
        ">


          <h2 className="
          text-sm
          font-bold
          uppercase
          tracking-wider
          text-zinc-400
          ">
            ⚙️ Configurações
          </h2>




          <div className="
          mt-5
          space-y-4
          ">


            <div>

              <label className="
              text-xs
              text-zinc-400
              ">
                Nome do site
              </label>

              <input
                value={site.name}
                readOnly
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                "
              />

            </div>




            <div>

              <label className="
              text-xs
              text-zinc-400
              ">
                Template
              </label>

              <input
                value={site.templateId}
                readOnly
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                "
              />

            </div>
            <div>

              <label className="
              text-xs
              text-zinc-400
              ">
                Cor principal
              </label>

              <input
                value={site.primaryColor ?? "#22c55e"}
                readOnly
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                "
              />

            </div>



            <div>

              <label className="
              text-xs
              text-zinc-400
              ">
                Cor secundária
              </label>


              <input
                value={site.secondaryColor ?? "#2563eb"}
                readOnly
                className="
                mt-2
                w-full
                rounded-xl
                border
                border-zinc-700
                bg-zinc-950
                px-4
                py-3
                "
              />


            </div>




          </div>





          <div className="
          mt-8
          space-y-3
          ">



            <button
              className="
              w-full
              rounded-xl
              bg-green-500
              px-5
              py-3
              font-bold
              text-black
              hover:bg-green-400
              "
            >
              💾 Salvar alterações
            </button>



            <button
              className="
              w-full
              rounded-xl
              bg-zinc-800
              px-5
              py-3
              font-semibold
              hover:bg-zinc-700
              "
            >
              🚀 Publicar site
            </button>



          </div>



        </aside>


      </main>


    </div>

  );

}