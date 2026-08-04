"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";


type Site = {
  id:string;
  name:string;
  templateId:string;
  status:string;
  slug?:string;
};


type Activity = {
  id:string;
  type:string;
  message:string;
  createdAt:string;
  userName:string;
};


type Data = {
  user:{
    id:string;
    name:string;
    email:string;
    planId:string;
    role:string;
    createdAt:string;
  };

  sites:Site[];

  subscription:any;
};





export default function UserDetails(){


  const params = useParams();

  const id = params.id as string;



  const [data,setData] =
  useState<Data | null>(null);



  const [activities,setActivities] =
  useState<Activity[]>([]);



  const [loading,setLoading] =
  useState(true);



  const [actionLoading,setActionLoading] =
  useState(false);



  const [selectedPlan,setSelectedPlan] =
  useState("basic");



  const [selectedRole,setSelectedRole] =
  useState("cliente");





  async function loadData(){


    const res = await fetch(
      `/api/admin/users/${id}`
    );


    const json = await res.json();


    setData(json);



    if(json.user){


      setSelectedPlan(
        json.user.planId
      );


      setSelectedRole(
        json.user.role
      );


    }






    const activityRes =
    await fetch(
      `/api/admin/users/${id}/activity`
    );



    const activityJson =
    await activityRes.json();



    setActivities(
      activityJson
    );



    setLoading(false);


  }








  useEffect(()=>{


    if(id){

      loadData();

    }


  },[id]);








  async function executeAction(
    action:string,
    planId?:string
  ){


    try{


      setActionLoading(true);



      await fetch(
        `/api/admin/users/${id}/actions`,
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },


          body:JSON.stringify({

            action,

            planId

          })

        }
      );



      loadData();



    }finally{


      setActionLoading(false);


    }


  }






  async function updateRole(){


    try{


      setActionLoading(true);



      await fetch(
        `/api/admin/users/${id}/role`,
        {

          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },


          body:JSON.stringify({

            role:selectedRole

          })

        }
      );



      loadData();



    }finally{


      setActionLoading(false);


    }


  }
  if(loading){

    return (

      <div className="text-zinc-400">

        Carregando cliente...

      </div>

    );

  }




  if(!data?.user){

    return (

      <div className="text-red-400">

        Cliente não encontrado.

      </div>

    );

  }





  return (

    <div className="space-y-8">





      <div>

        <h1 className="
        text-4xl
        font-bold
        ">

          {data.user.name}

        </h1>


        <p className="text-zinc-400">

          Detalhes do cliente

        </p>


      </div>








      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-6
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-5
        ">

          Informações

        </h2>




        <div className="space-y-3">


          <p>

            📧 {data.user.email}

          </p>



          <p>

            💎 Plano atual:

            {" "}

            {data.user.planId}

          </p>



          <p>

            👤 Cargo:

            {" "}

            {data.user.role}

          </p>



          <p>

            📅 Cadastro:

            {" "}

            {
              new Date(
                data.user.createdAt
              )
              .toLocaleDateString(
                "pt-BR"
              )
            }

          </p>


        </div>


      </div>







      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-6
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-5
        ">

          🛡️ Permissões

        </h2>



        <p className="
        text-zinc-400
        mb-4
        ">

          Cargo atual:
          {" "}
          {data.user.role}

        </p>




        <div className="
        flex
        gap-3
        flex-wrap
        ">



          <select

          value={selectedRole}

          onChange={(e)=>
            setSelectedRole(
              e.target.value
            )
          }

          className="
          bg-zinc-800
          border
          border-zinc-700
          rounded-xl
          px-4
          py-3
          "

          >


            <option value="owner">

              👑 Owner

            </option>



            <option value="admin">

              🛡️ Admin

            </option>



            <option value="moderator">

              🔧 Moderador

            </option>



            <option value="cliente">

              👤 Cliente

            </option>


          </select>





          <button

          disabled={actionLoading}

          onClick={updateRole}

          className="
          bg-green-500
          text-black
          font-bold
          px-5
          py-3
          rounded-xl
          "

          >

            💾 Salvar cargo

          </button>



        </div>


      </div>
      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-6
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-5
        ">

          🌐 Sites criados

        </h2>




        <div className="space-y-4">



        {
          data.sites.map(site=>(


            <div

            key={site.id}

            className="
            bg-zinc-800
            rounded-xl
            p-5
            "

            >


              <h3 className="
              text-xl
              font-bold
              ">

                {site.name}

              </h3>



              <p>

                Modelo:

                {" "}

                {site.templateId}

              </p>



              <p>

                Status:

                {" "}

                {
                  site.status === "published"

                  ?

                  "🟢 Publicado"

                  :

                  "🟡 Rascunho"

                }

              </p>





              <div className="flex gap-3 mt-3">


                <Link

                href={`/site/${site.slug ?? site.id}`}

                className="
                bg-blue-600
                px-4
                py-2
                rounded-lg
                "

                >

                  👁️ Abrir

                </Link>





                <Link

                href={`/editor/${site.id}`}

                className="
                bg-green-500
                px-4
                py-2
                rounded-lg
                font-bold
                text-black
                "

                >

                  ✏️ Editar

                </Link>



              </div>


            </div>


          ))
        }



        </div>



      </div>









      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-6
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-5
        ">

          ⚡ Ações

        </h2>





        <div className="flex flex-col gap-4">






          <button

          disabled={actionLoading}

          onClick={()=>
            executeAction(
              "premium"
            )
          }

          className="
          bg-purple-600
          px-5
          py-3
          rounded-xl
          "

          >

            👑 Ativar Premium

          </button>







          <div className="
          flex
          gap-3
          items-center
          flex-wrap
          ">



            <select

            value={selectedPlan}

            onChange={(e)=>
              setSelectedPlan(
                e.target.value
              )
            }

            className="
            bg-zinc-800
            border
            border-zinc-700
            rounded-xl
            px-4
            py-3
            "

            >


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






            <button

            disabled={actionLoading}

            onClick={()=>
              executeAction(
                "change_plan",
                selectedPlan
              )
            }

            className="
            bg-blue-600
            px-5
            py-3
            rounded-xl
            "

            >

              🔄 Alterar plano

            </button>



          </div>




          <button

          disabled={actionLoading}

          onClick={()=>
            executeAction(
              "close_trial"
            )
          }

          className="
          bg-red-600
          px-5
          py-3
          rounded-xl
          "

          >

            ❌ Encerrar teste

          </button>



        </div>



      </div>









      <div className="
      bg-zinc-900
      border
      border-zinc-800
      rounded-2xl
      p-6
      ">


        <h2 className="
        text-2xl
        font-bold
        mb-5
        ">

          📜 Atividades recentes

        </h2>






        <div className="space-y-4">



        {
          activities.length === 0

          ?


          <p className="text-zinc-400">

            Nenhuma atividade registrada.

          </p>


          :


          activities.map(activity=>(



            <div

            key={activity.id}

            className="
            bg-zinc-800
            rounded-xl
            p-4
            "

            >



              <p className="font-bold">

                {activity.message}

              </p>




              <p className="text-zinc-400">

                {activity.userName}

              </p>





              <p className="text-zinc-500 text-sm">

                {
                  new Date(
                    activity.createdAt
                  )
                  .toLocaleString(
                    "pt-BR"
                  )
                }

              </p>



            </div>



          ))


        }



        </div>



      </div>







    </div>

  );


}