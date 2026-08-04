"use client";

import { useEffect, useState } from "react";


type Metrics = {

  users:number;

  sites:number;

  subscriptions:number;

  plans:{
    premium:number;
    intermediate:number;
    basic:number;
  };

};




export default function AdminDashboard(){


  const [data,setData] = useState<Metrics | null>(null);




  useEffect(()=>{


    async function load(){


      const res = await fetch(
        "/api/admin/metrics"
      );


      const json = await res.json();


      setData(json);


    }


    load();


  },[]);






  if(!data){


    return (

      <div className="text-zinc-400">

        Carregando painel...

      </div>

    );

  }






  const cards = [

    {
      title:"Usuários",
      value:data.users,
      icon:"👥"
    },

    {
      title:"Sites criados",
      value:data.sites,
      icon:"🌐"
    },

    {
      title:"Assinaturas ativas",
      value:data.subscriptions,
      icon:"💳"
    },

    {
      title:"Premium",
      value:data.plans.premium,
      icon:"💎"
    },

    {
      title:"Intermediário",
      value:data.plans.intermediate,
      icon:"🔵"
    },

    {
      title:"Básico",
      value:data.plans.basic,
      icon:"🟢"
    },

  ];








  return (

    <div className="space-y-8">





      <div>


        <h1 className="
        text-4xl
        font-bold
        ">

          Painel Administrativo

        </h1>


        <p className="text-zinc-400">

          Controle completo do KartFusion

        </p>


      </div>







      <div className="
      grid
      md:grid-cols-3
      lg:grid-cols-6
      gap-5
      ">


      {
        cards.map(card=>(


          <div

          key={card.title}

          className="
          bg-zinc-900
          border
          border-zinc-800
          rounded-2xl
          p-6
          "

          >


            <div className="text-3xl">

              {card.icon}

            </div>


            <p className="text-zinc-400 mt-4">

              {card.title}

            </p>


            <h2 className="
            text-3xl
            font-bold
            mt-2
            ">

              {card.value}

            </h2>


          </div>


        ))
      }


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

          📊 Distribuição dos planos

        </h2>





        <div className="space-y-4">



          <div>

            💎 Premium

            <div className="
            bg-zinc-800
            rounded-full
            h-3
            mt-2
            ">

              <div
              className="
              bg-purple-500
              h-3
              rounded-full
              "
              style={{
                width:
                `${data.plans.premium * 20}%`
              }}
              />

            </div>

          </div>






          <div>

            🔵 Intermediário

            <div className="
            bg-zinc-800
            rounded-full
            h-3
            mt-2
            ">

              <div
              className="
              bg-blue-500
              h-3
              rounded-full
              "
              style={{
                width:
                `${data.plans.intermediate * 20}%`
              }}
              />

            </div>

          </div>







          <div>

            🟢 Básico

            <div className="
            bg-zinc-800
            rounded-full
            h-3
            mt-2
            ">

              <div
              className="
              bg-green-500
              h-3
              rounded-full
              "
              style={{
                width:
                `${data.plans.basic * 20}%`
              }}
              />

            </div>

          </div>



        </div>



      </div>







    </div>

  );

}