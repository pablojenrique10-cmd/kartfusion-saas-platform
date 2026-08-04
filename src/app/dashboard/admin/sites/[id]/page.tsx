import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { sites, users } from "@/db/schema";
import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminSitePage({
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


  return (
    <div className="space-y-8">

      <div className="
      flex
      flex-col
      gap-4
      md:flex-row
      md:items-center
      md:justify-between
      ">

        <div>

          <h1 className="
          text-4xl
          font-bold
          ">
            🌐 {site.name}
          </h1>

          <p className="
          mt-2
          text-zinc-400
          ">
            Gerenciando site do cliente
          </p>

        </div>


                <div className="flex gap-2">

          <div className="flex gap-2">

  <Link
    href={`/dashboard/admin/sites/${site.id}`}
    className="
    rounded-xl
    bg-zinc-800
    px-4
    py-2
    text-center
    font-semibold
    "
  >
    👁️ Abrir
  </Link>


  <Link
    href={`/editor/${site.id}`}
    className="
    rounded-xl
    bg-green-500
    px-4
    py-2
    font-bold
    text-black
    "
  >
    ✏️ Editar
  </Link>

</div>


          <Link
            href={`/editor/${site.id}`}
            className="
            rounded-xl
            bg-green-500
            px-4
            py-3
            text-center
            font-bold
            text-black
            hover:bg-green-400
            "
          >
            ✏️ Editar
          </Link>

        </div>

      </div>


      <div className="
      grid
      gap-5
      md:grid-cols-3
      ">


        <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ">

          <p className="text-sm text-zinc-400">
            Cliente
          </p>

          <h2 className="
          mt-2
          text-xl
          font-bold
          ">
            {owner?.name ?? "Desconhecido"}
          </h2>

          <p className="text-sm text-zinc-500">
            {owner?.email}
          </p>

        </div>


        <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ">

          <p className="text-sm text-zinc-400">
            Status
          </p>

          <h2 className="
          mt-2
          text-xl
          font-bold
          ">
            {site.status}
          </h2>

        </div>


        <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ">

          <p className="text-sm text-zinc-400">
            Template
          </p>

          <h2 className="
          mt-2
          text-xl
          font-bold
          ">
            {site.templateId}
          </h2>

        </div>


      </div>
      <div className="
      grid
      gap-6
      lg:grid-cols-2
      ">


        <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ">


          <h2 className="
          text-xl
          font-bold
          ">
            📄 Informações do site
          </h2>



          <div className="
          mt-5
          space-y-3
          text-sm
          ">


            <div className="
            flex
            justify-between
            border-b
            border-zinc-800
            pb-3
            ">

              <span className="text-zinc-400">
                ID
              </span>

              <span className="text-zinc-200">
                {site.id}
              </span>

            </div>



            <div className="
            flex
            justify-between
            border-b
            border-zinc-800
            pb-3
            ">

              <span className="text-zinc-400">
                Criado em
              </span>

              <span>
                {new Date(
                  site.createdAt
                ).toLocaleDateString("pt-BR")}
              </span>

            </div>



            <div className="
            flex
            justify-between
            border-b
            border-zinc-800
            pb-3
            ">

              <span className="text-zinc-400">
                Atualizado
              </span>

              <span>
                {new Date(
                  site.updatedAt
                ).toLocaleDateString("pt-BR")}
              </span>

            </div>



            <div className="
            flex
            justify-between
            ">

              <span className="text-zinc-400">
                Slug
              </span>

              <span>
                /{site.slug}
              </span>

            </div>


          </div>

        </div>






        <div className="
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        ">


          <h2 className="
          text-xl
          font-bold
          ">
            🚀 Ações rápidas
          </h2>



          <div className="
          mt-5
          grid
          gap-3
          ">


            <Link
              href={`/site/${site.slug}`}
              target="_blank"
              className="
              rounded-xl
              bg-zinc-800
              px-5
              py-3
              text-center
              font-semibold
              hover:bg-zinc-700
              "
            >
              👀 Visualizar site
            </Link>




            <Link
              href={`/editor/${site.id}`}
              className="
              rounded-xl
              bg-green-500
              px-5
              py-3
              text-center
              font-bold
              text-black
              hover:bg-green-400
              "
            >
              ✏️ Editar site
            </Link>




            <Link
              href="/dashboard/admin/sites"
              className="
              rounded-xl
              bg-zinc-800
              px-5
              py-3
              text-center
              hover:bg-zinc-700
              "
            >
              ← Voltar para sites
            </Link>


          </div>


        </div>


      </div>
      <div className="
      rounded-2xl
      border
      border-zinc-800
      bg-zinc-900
      p-6
      ">


        <h2 className="
        text-xl
        font-bold
        ">
          🖥️ Preview administrativo
        </h2>


        <p className="
        mt-2
        text-sm
        text-zinc-400
        ">
          Área preparada para mostrar uma prévia do site do cliente dentro do painel.
        </p>



        <div className="
        mt-6
        flex
        min-h-[350px]
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-zinc-700
        bg-zinc-950
        ">


          <div className="text-center">


            <div className="
            text-5xl
            ">
              🌐
            </div>


            <p className="
            mt-3
            text-zinc-400
            ">
              Preview do site será carregado aqui
            </p>


          </div>


        </div>


      </div>




      <div className="
      rounded-2xl
      border
      border-zinc-800
      bg-zinc-900
      p-6
      ">


        <h2 className="
        text-xl
        font-bold
        ">
          ⚙️ Gerenciamento
        </h2>


        <p className="
        mt-2
        text-sm
        text-zinc-400
        ">
          Use o editor principal para alterar o conteúdo,
          blocos e aparência deste site.
        </p>



        <div className="
        mt-5
        flex
        flex-wrap
        gap-3
        ">


          <Link
            href={`/editor/${site.id}`}
            className="
            rounded-xl
            bg-green-500
            px-5
            py-3
            font-bold
            text-black
            hover:bg-green-400
            "
          >
            ✏️ Abrir editor completo
          </Link>



          <Link
            href={`/site/${site.slug}`}
            target="_blank"
            className="
            rounded-xl
            bg-zinc-800
            px-5
            py-3
            hover:bg-zinc-700
            "
          >
            👁️ Abrir site publicado
          </Link>


        </div>


      </div>
    </div>
  );
}