"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type User = {

  id:string;

  name:string;

  email:string;

  planId:string;

  role:string;

  sites:number;

  createdAt:string;

};





export default function UsuariosAdmin(){


  const [users,setUsers] = useState<User[]>([]);

  const [search,setSearch] = useState("");

  const [filter,setFilter] = useState("all");




  useEffect(()=>{

    loadUsers();

  },[]);





  async function loadUsers(){


    const res = await fetch(
      "/api/admin/users"
    );


    const data = await res.json();


    setUsers(data);


  }









  const filtered = users.filter(user=>{


    const matchSearch =

      user.name
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

      ||

      user.email
      .toLowerCase()
      .includes(
        search.toLowerCase()
      );




    const matchPlan =

      filter === "all"

      ||

      user.planId === filter;



    return matchSearch && matchPlan;


  });









  function formatRole(role:string){


    if(role === "owner"){

      return "👑 Owner";

    }


    if(role === "admin"){

      return "🛡️ Admin";

    }


    if(role === "moderator"){

      return "🔧 Moderador";

    }


    return "👤 Cliente";


  }









  return (

    <div className="space-y-8">






      <div>

        <h1 className="
        text-4xl
        font-bold
        ">

          👥 Usuários

        </h1>


        <p className="text-zinc-400">

          Gerencie todos os clientes do KartFusion

        </p>


      </div>









      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-5
      flex
      flex-col
      md:flex-row
      gap-4
      ">



        <input

        value={search}

        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }

        placeholder="Buscar nome ou email..."

        className="
        bg-zinc-800
        rounded-xl
        px-4
        py-3
        flex-1
        "

        />







        <select

        value={filter}

        onChange={(e)=>
          setFilter(
            e.target.value
          )
        }

        className="
        bg-zinc-800
        rounded-xl
        px-4
        "

        >

          <option value="all">
            Todos
          </option>

          <option value="basic">
            🟢 Básico
          </option>

          <option value="intermediate">
            🔵 Intermediário
          </option>

          <option value="premium">
            💎 Premium
          </option>


        </select>




      </div>









      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      overflow-hidden
      ">



        <div className="overflow-x-auto">


          <table className="w-full">



            <thead className="bg-zinc-800">


              <tr>


                <th className="p-4 text-left">

                  Cliente

                </th>


                <th className="p-4">

                  Plano

                </th>


                <th className="p-4">

                  Cargo

                </th>


                <th className="p-4">

                  Sites

                </th>


                <th className="p-4">

                  Cadastro

                </th>


                <th className="p-4">

                  Ação

                </th>


              </tr>


            </thead>







            <tbody>



            {
              filtered.map(user=>(


                <tr

                key={user.id}

                className="
                border-t
                border-zinc-800
                "


                >



                  <td className="p-4">


                    <p className="font-bold">

                      {user.name}

                    </p>


                    <p className="
                    text-sm
                    text-zinc-400
                    ">

                      {user.email}

                    </p>


                  </td>








                  <td className="p-4 text-center">


                    <span>

                      {user.planId}

                    </span>


                  </td>








                  <td className="p-4 text-center">


                    <span className="
                    rounded-lg
                    bg-zinc-800
                    px-3
                    py-1
                    text-sm
                    ">

                      {formatRole(user.role)}

                    </span>


                  </td>








                  <td className="p-4 text-center">


                    🌐 {user.sites}


                  </td>








                  <td className="p-4 text-center">


                    {
                      new Date(
                        user.createdAt
                      )
                      .toLocaleDateString(
                        "pt-BR"
                      )
                    }


                  </td>








                  <td className="p-4 text-center">


                    <Link

                    href={
                      `/admin/usuarios/${user.id}`
                    }

                    className="
                    bg-blue-600
                    px-4
                    py-2
                    rounded-xl
                    hover:bg-blue-500
                    "

                    >

                      Gerenciar

                    </Link>


                  </td>





                </tr>


              ))
            }



            </tbody>





          </table>


        </div>


      </div>





    </div>

  );

}