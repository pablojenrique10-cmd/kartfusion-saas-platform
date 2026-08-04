"use client";

import { useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  planId: string;
  createdAt: string;
  trialEndsAt: string | null;
  lastLoginAt: string | null;
  suspended: boolean;
  sites: number;
};

export default function AdminClientesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<
    "all" | "basic" | "intermediate" | "premium" | "trial" | "suspended"
  >("all");


  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users");

      const data = await res.json();

      setUsers(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadUsers();
  }, []);



  const filteredUsers = useMemo(() => {

    let list = [...users];


    if (filter !== "all") {

      if (filter === "trial") {

        list = list.filter(
          (u) => !!u.trialEndsAt
        );

      } else if (filter === "suspended") {

        list = list.filter(
          (u) => u.suspended
        );

      } else {

        list = list.filter(
          (u) => u.planId === filter
        );

      }

    }



    if (search.trim()) {

      const value = search.toLowerCase();


      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(value) ||
          u.email.toLowerCase().includes(value)
      );

    }


    return list;


  }, [users, filter, search]);



  const total = users.length;

  const active = users.filter(
    (u) => !u.suspended
  ).length;


  const trials = users.filter(
    (u) => !!u.trialEndsAt
  ).length;


  const suspended = users.filter(
    (u) => u.suspended
  ).length;



  return (

    <div className="space-y-8">


      <div>

        <h1 className="text-4xl font-bold text-white">
          👥 Clientes
        </h1>


        <p className="mt-2 text-zinc-400">
          Gerencie os clientes cadastrados na plataforma.
        </p>

      </div>




      <div className="grid gap-5 md:grid-cols-4">


        <Card
          title="Total"
          value={total}
        />


        <Card
          title="Ativos"
          value={active}
        />


        <Card
          title="Trial"
          value={trials}
        />


        <Card
          title="Suspensos"
          value={suspended}
        />


      </div>




      <div className="flex flex-col gap-4 md:flex-row">


        <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          placeholder="Pesquisar cliente..."
          className="
          flex-1
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          px-4
          py-3
          text-white
          "
        />



        <select
          value={filter}
          onChange={(e)=>setFilter(e.target.value as any)}
          className="
          rounded-xl
          border
          border-zinc-800
          bg-zinc-900
          px-4
          py-3
          text-white
          "
        >

          <option value="all">
            Todos
          </option>

          <option value="trial">
            Trial
          </option>

          <option value="basic">
            Básico
          </option>

          <option value="intermediate">
            Intermediário
          </option>

          <option value="premium">
            Premium
          </option>

          <option value="suspended">
            Suspensos
          </option>

        </select>


      </div>





      <div className="rounded-2xl border border-zinc-800 bg-zinc-900">


        {loading ? (

          <p className="p-6 text-zinc-400">
            Carregando clientes...
          </p>


        ) : filteredUsers.length === 0 ? (

          <p className="p-6 text-zinc-400">
            Nenhum cliente encontrado.
          </p>


        ) : (


          filteredUsers.map((user)=>(


            <div
              key={user.id}
              className="
              flex
              flex-col
              gap-3
              border-b
              border-zinc-800
              p-5
              md:flex-row
              md:items-center
              md:justify-between
              "
            >


              <div>

                <h3 className="font-bold text-white">
                  {user.name}
                </h3>


                <p className="text-sm text-zinc-400">
                  {user.email}
                </p>

              </div>



              <div className="text-sm text-zinc-300">

                Plano:
                <span className="ml-2 font-bold text-emerald-400">
                  {user.planId}
                </span>

              </div>


              <div>

                {user.suspended ? (

                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-400">
                    Suspenso
                  </span>


                ) : (

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    Ativo
                  </span>

                )}

              </div>



            </div>


          ))

        )}


      </div>


    </div>

  );
}



function Card({
  title,
  value
}:{
  title:string;
  value:number;
}){

  return (

    <div className="
    rounded-2xl
    border
    border-zinc-800
    bg-zinc-900
    p-5
    ">

      <p className="text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold text-white">
        {value}
      </h2>


    </div>

  );

}