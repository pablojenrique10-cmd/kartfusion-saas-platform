"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


type Site = {

  id:string;

  name:string;

  slug:string;

  templateId:string;

  status:string;

  userName:string;

  userEmail:string;

  createdAt:string;

};




export default function AdminSitesPage(){


  const [sites,setSites] = useState<Site[]>([]);

  const [loading,setLoading] = useState(true);






  async function loadSites(){


    const res = await fetch(
      "/api/admin/sites"
    );


    const data = await res.json();


    setSites(data);


    setLoading(false);


  }






  useEffect(()=>{


    loadSites();


  },[]);








  async function actionSite(
    id:string,
    action:string
  ){


    await fetch(
      `/api/admin/sites/${id}`,
      {

        method:"PATCH",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          action

        })

      }
    );



    loadSites();


  }








  if(loading){

    return (

      <div className="text-zinc-400">

        Carregando sites...

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

          🌐 Sites

        </h1>


        <p className="text-zinc-400">

          Controle todos os sites criados pelos clientes

        </p>

      </div>








      <div className="space-y-5">



      {
        sites.map(site=>(


          <div

          key={site.id}

          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-6
          "

          >





            <div className="
            flex
            justify-between
            gap-5
            ">



              <div>


                <h2 className="
                text-2xl
                font-bold
                ">

                  {site.name}

                </h2>




                <p className="text-zinc-400">

                  👤 {site.userName}

                </p>



                <p className="text-zinc-400">

                  📧 {site.userEmail}

                </p>




                <p className="mt-3">

                  🧩 Modelo:
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

                    site.status === "blocked"

                    ?

                    "🔴 Bloqueado"

                    :

                    "🟡 Rascunho"

                  }

                </p>



              </div>








              <div className="
              flex
              flex-col
              gap-3
              ">



                <Link

                href={`/site/${site.id}`}

                className="
                bg-blue-600
                px-5
                py-3
                rounded-xl
                text-center
                "

                >

                  Abrir

                </Link>






                {
                  site.status === "blocked"

                  ?

                  <button

                  onClick={()=>
                    actionSite(
                      site.id,
                      "publish"
                    )
                  }

                  className="
                  bg-green-600
                  px-5
                  py-3
                  rounded-xl
                  "

                  >

                    🟢 Ativar

                  </button>


                  :

                  <button

                  onClick={()=>
                    actionSite(
                      site.id,
                      "block"
                    )
                  }

                  className="
                  bg-yellow-600
                  px-5
                  py-3
                  rounded-xl
                  "

                  >

                    🚫 Bloquear

                  </button>

                }







                <button

                onClick={()=>
                  actionSite(
                    site.id,
                    "delete"
                  )
                }

                className="
                bg-red-600
                px-5
                py-3
                rounded-xl
                "

                >

                  🗑️ Excluir

                </button>




              </div>





            </div>





          </div>



        ))
      }



      </div>






    </div>

  );


}