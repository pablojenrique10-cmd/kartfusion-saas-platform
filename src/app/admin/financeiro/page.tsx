"use client";

import { useEffect, useState } from "react";


type Finance = {

  revenueCents:number;

  activeCustomers:number;

  plans:{
    premium:number;
    intermediate:number;
    basic:number;
  };

};



type History = {

  id:string;

  planId:string;

  status:string;

  startedAt:string;

  createdAt:string;

  userName:string;

  userEmail:string;

};




export default function FinanceiroPage(){


  const [data,setData] = useState<Finance | null>(null);

  const [history,setHistory] = useState<History[]>([]);





  useEffect(()=>{


    async function load(){


      const financeRes = await fetch(
        "/api/admin/finance"
      );


      const financeJson =
      await financeRes.json();



      setData(financeJson);





      const historyRes = await fetch(
        "/api/admin/finance/history"
      );


      const historyJson =
      await historyRes.json();



      setHistory(historyJson);



    }


    load();


  },[]);







  if(!data){


    return (

      <div className="text-zinc-400">

        Carregando financeiro...

      </div>

    );

  }







  const cards = [

    {
      title:"Receita mensal",
      value:
      `R$ ${(data.revenueCents / 100)
      .toFixed(2)
      .replace(".",",")}`,
      icon:"💰"
    },

    {
      title:"Clientes ativos",
      value:data.activeCustomers,
      icon:"👥"
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

        <h1 className="text-4xl font-bold">

          💰 Controle Financeiro

        </h1>


        <p className="text-zinc-400">

          Acompanhe receitas e assinaturas do KartFusion

        </p>

      </div>








      <div className="
      grid
      md:grid-cols-3
      lg:grid-cols-5
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


            <h2 className="text-3xl font-bold mt-2">

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

          📜 Histórico financeiro

        </h2>




        <div className="space-y-4">


        {
          history.map(item=>(


            <div

            key={item.id}

            className="
            bg-zinc-800
            rounded-xl
            p-5
            "

            >


              <h3 className="font-bold">

                {item.userName}

              </h3>


              <p className="text-zinc-400">

                {item.userEmail}

              </p>


              <p className="mt-2">

                💎 Plano:
                {" "}
                {item.planId}

              </p>


              <p>

                Status:
                {" "}

                {
                  item.status === "active"

                  ?

                  "🟢 Ativo"

                  :

                  "🔴 Cancelado"

                }

              </p>


              <p className="text-sm text-zinc-400 mt-2">

                📅
                {" "}
                {
                  new Date(
                    item.createdAt
                  )
                  .toLocaleDateString(
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