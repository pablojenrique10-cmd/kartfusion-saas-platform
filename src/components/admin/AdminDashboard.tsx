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

export default function Page(){

  const [data,setData] = useState<Metrics | null>(null);


  useEffect(()=>{

    async function load(){

      const res = await fetch("/api/admin/metrics");

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


  return (
    <div className="space-y-8">

      <h1 className="text-4xl font-bold">
        Painel Administrativo
      </h1>

      <p className="text-zinc-400">
        Controle completo do KartFusion
      </p>

    </div>
  );

}