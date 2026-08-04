"use client";

import { useEffect, useState } from "react";

type Plan = {
  id:string;
  name:string;
  tagline:string;
  priceCents:number;
  maxSites:number;
  maxPages:number;
  storageMb:number;
  features:string[];
  highlighted:boolean;
};


export default function AdminPlanos(){

  const [plans,setPlans] =
    useState<Plan[]>([]);

  const [editing,setEditing] =
    useState<Plan|null>(null);


  const [price,setPrice] =
    useState("");



  async function loadPlans(){

    const res =
      await fetch("/api/admin/plans");

    const data =
      await res.json();

    setPlans(data);

  }



  useEffect(()=>{

    loadPlans();

  },[]);




  function openEdit(plan:Plan){

    setEditing(plan);

    setPrice(
      (plan.priceCents / 100)
      .toFixed(2)
      .replace(".",",")
    );

  }





  function updateFeature(
    index:number,
    value:string
  ){

    if(!editing)
      return;


    const features =
      [...editing.features];

    features[index] =
      value;


    setEditing({
      ...editing,
      features
    });

  }




  function addFeature(){

    if(!editing)
      return;


    setEditing({

      ...editing,

      features:[
        ...editing.features,
        "Novo recurso"
      ]

    });

  }




  function removeFeature(
    index:number
  ){

    if(!editing)
      return;


    const features =
      [...editing.features];


    features.splice(index,1);


    setEditing({

      ...editing,

      features

    });

  }






  async function savePlan(){

    if(!editing)
      return;


    const cents =
      Number(
        price
        .replace(",",".")
      ) * 100;



    await fetch(
      `/api/admin/plans/${editing.id}`,
      {

        method:"PATCH",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:
        JSON.stringify({

          ...editing,

          priceCents:
          cents

        })

      }
    );



    setEditing(null);

    loadPlans();

  }







  return (

    <div className="space-y-8">


      <div>

        <h1 className="
        text-4xl
        font-bold
        ">
          💳 Planos
        </h1>


        <p className="
        text-zinc-400
        ">
          Gerencie preços, limites e recursos.
        </p>


      </div>





      <div className="
      grid
      md:grid-cols-3
      gap-6
      ">


      {
      plans.map(plan=>(


        <div
        key={plan.id}
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
          ">

            <h2 className="
            text-2xl
            font-bold
            ">
              {plan.name}
            </h2>


            {
            plan.highlighted &&
            <span className="
            bg-green-500
            text-black
            px-3
            rounded-full
            text-xs
            flex
            items-center
            ">
              Destaque
            </span>
            }

          </div>



          <p className="
          text-zinc-400
          mt-3
          ">
            {plan.tagline}
          </p>




          <div className="
          text-3xl
          font-bold
          mt-5
          ">

          R$ {(plan.priceCents/100)
          .toFixed(2)
          .replace(".",",")}

          </div>





          <p>
            🌐 {plan.maxSites} sites
          </p>

          <p>
            📄 {plan.maxPages} páginas
          </p>

          <p>
            💾 {plan.storageMb} MB
          </p>





          <button

          onClick={()=>
            openEdit(plan)
          }

          className="
          mt-6
          w-full
          bg-white
          text-black
          rounded-xl
          py-3
          font-bold
          "

          >

          ⚙️ Configurar plano

          </button>


        </div>


      ))
      }


      </div>









      {
      editing && (

      <div className="
      fixed
      inset-0
      bg-black/70
      flex
      justify-center
      items-center
      p-5
      ">


        <div className="
        bg-zinc-900
        rounded-2xl
        p-8
        w-full
        max-w-xl
        max-h-[90vh]
        overflow-y-auto
        space-y-5
        ">



        <h2 className="
        text-2xl
        font-bold
        ">
          💳 Editando {editing.name}
        </h2>



        <p className="
        text-zinc-400
        ">
          As alterações serão aplicadas ao plano no sistema.
        </p>





        <div>

          📝 Nome

          <input
          className="input"
          value={editing.name}
          onChange={(e)=>
          setEditing({
            ...editing,
            name:e.target.value
          })
          }
          />

        </div>






        <div>

          📄 Descrição

          <textarea
          className="input"
          value={editing.tagline}
          onChange={(e)=>
          setEditing({
            ...editing,
            tagline:e.target.value
          })
          }
          />

        </div>






        <div>

          💰 Preço mensal

          <input

          className="input"

          value={price}

          placeholder="179,00"

          onChange={(e)=>
          setPrice(
            e.target.value
          )
          }

          />

        </div>






        <div>

          🌐 Sites permitidos

          <input
          className="input"
          value={editing.maxSites}
          onChange={(e)=>
          setEditing({
            ...editing,
            maxSites:
            Number(e.target.value)
          })
          }
          />

        </div>







        <div>

          📄 Páginas

          <input
          className="input"
          value={editing.maxPages}
          onChange={(e)=>
          setEditing({
            ...editing,
            maxPages:
            Number(e.target.value)
          })
          }
          />

        </div>







        <div>

          💾 Armazenamento MB

          <input
          className="input"
          value={editing.storageMb}
          onChange={(e)=>
          setEditing({
            ...editing,
            storageMb:
            Number(e.target.value)
          })
          }
          />

        </div>









        <div>

          ✨ Recursos


          {
          editing.features.map(
          (item,index)=>(


          <div
          key={index}
          className="
          flex
          gap-2
          mt-2
          ">


            <input
            className="
            input
            flex-1
            "
            value={item}
            onChange={(e)=>
            updateFeature(
              index,
              e.target.value
            )
            }
            />


            <button

            onClick={()=>
            removeFeature(index)
            }

            className="
            bg-red-500
            px-3
            rounded-xl
            "

            >
            🗑️
            </button>


          </div>


          ))
          }



          <button

          onClick={addFeature}

          className="
          mt-3
          bg-zinc-800
          px-4
          py-2
          rounded-xl
          "

          >
          ➕ Adicionar recurso
          </button>


        </div>








        <label className="
        flex
        gap-3
        ">

        <input
        type="checkbox"
        checked={editing.highlighted}
        onChange={(e)=>
        setEditing({
          ...editing,
          highlighted:
          e.target.checked
        })
        }
        />

        ⭐ Plano destaque

        </label>








        <div className="
        flex
        gap-3
        ">


        <button

        onClick={savePlan}

        className="
        flex-1
        bg-green-500
        text-black
        rounded-xl
        py-3
        font-bold
        "

        >
          Salvar
        </button>



        <button

        onClick={()=>
          setEditing(null)
        }

        className="
        flex-1
        bg-zinc-700
        rounded-xl
        "

        >
          Cancelar
        </button>


        </div>





        </div>


      </div>

      )
      }



    </div>

  );

}