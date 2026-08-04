import Link from "next/link";

import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";

import { requireUser } from "@/lib/auth";
import UserRoleSelect from "@/components/admin/UserRoleSelect";


export const dynamic = "force-dynamic";



export default async function AdminUsersPage() {


  const admin = await requireUser();



  if(admin.role !== "owner") {

    return (

      <div className="
      rounded-2xl
      border
      border-red-500/20
      bg-red-500/10
      p-6
      text-red-400
      ">

        ❌ Você não tem permissão para acessar usuários.

      </div>

    );

  }





  const allUsers = await db
    .select({

      id: users.id,

      name: users.name,

      email: users.email,

      role: users.role,

      planId: users.planId,

      createdAt: users.createdAt,

    })

    .from(users)

    .orderBy(
      desc(users.createdAt)
    );







  return (

    <div className="space-y-8">



      <div>

        <h1 className="
        text-4xl
        font-bold
        ">

          👥 Usuários

        </h1>


        <p className="text-zinc-400 mt-2">

          Gerencie clientes, cargos e permissões.

        </p>


      </div>









      <div className="
      grid
      gap-5
      ">




      {
        allUsers.map((user)=>(


          <div

          key={user.id}

          className="
          rounded-2xl
          border
          border-zinc-800
          bg-zinc-900
          p-6
          "

          >



            <div className="
            grid
            gap-6
            lg:grid-cols-[1fr_280px]
            ">





              <div>



                <h2 className="
                text-2xl
                font-bold
                ">

                  {user.name}

                </h2>




                <p className="text-zinc-400">

                  📧 {user.email}

                </p>





                <div className="
                mt-4
                space-y-2
                text-sm
                ">


                  <p>

                    💎 Plano:

                    {" "}

                    <span className="font-bold">

                      {user.planId}

                    </span>

                  </p>




                  <p>

                    👤 Cargo atual:

                    {" "}

                    <span className="font-bold">

                      {user.role}

                    </span>

                  </p>





                  <p className="text-zinc-500">

                    📅 Cadastro:

                    {" "}

                    {
                      new Date(
                        user.createdAt
                      )
                      .toLocaleDateString(
                        "pt-BR"
                      )
                    }

                  </p>


                </div>







                <Link

                href={`/admin/usuarios/${user.id}`}

                className="
                inline-block
                mt-5
                rounded-xl
                bg-zinc-800
                px-5
                py-3
                font-semibold
                hover:bg-zinc-700
                "

                >

                  Abrir detalhes

                </Link>





              </div>








              <div className="
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-950
              p-5
              ">


                <h3 className="
                mb-4
                font-bold
                ">

                  🔐 Permissão

                </h3>





                <UserRoleSelect

                  userId={user.id}

                  currentRole={user.role}

                />




              </div>







            </div>





          </div>



        ))
      }





      </div>






    </div>

  );

}