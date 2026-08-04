"use client";

import { useEffect, useMemo, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
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
    "all" |
    "basic" |
    "intermediate" |
    "premium" |
    "trial" |
    "suspended"
  >("all");

  async function loadUsers() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/users");

      const data = await res.json();

      setUsers(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (filter === "basic") {
      list = list.filter((u) => u.planId === "basic");
    }

    if (filter === "intermediate") {
      list = list.filter((u) => u.planId === "intermediate");
    }

    if (filter === "premium") {
      list = list.filter((u) => u.planId === "premium");
    }

    if (filter === "trial") {
      list = list.filter((u) => !!u.trialEndsAt);
    }

    if (filter === "suspended") {
      list = list.filter((u) => u.suspended);
    }

    if (search.trim()) {
      const s = search.toLowerCase();

      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }

    return list;
  }, [users, search, filter]);

  const total = users.length;

  const active = users.filter((u) => !u.suspended).length;

  const trials = users.filter((u) => !!u.trialEndsAt).length;

  const suspended = users.filter((u) => u.suspended).length;

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          👥 Clientes
        </h1>

        <p className="text-zinc-400 mt-2">
          Gerencie todos os clientes cadastrados na plataforma.
        </p>

      </div>

      <div className="grid md:grid-cols-4 gap-5">

        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5">

          <p className="text-zinc-400 text-sm">
            Total
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {total}
          </h2>

        </div>

        <div className="rounded-2xl bg-zinc-900 border border-green-500/30 p-5">

          <p className="text-green-400 text-sm">
            Ativos
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {active}
          </h2>

        </div>

        <div className="rounded-2xl bg-zinc-900 border border-yellow-500/30 p-5">

          <p className="text-yellow-400 text-sm">
            Trial
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {trials}
          </h2>

        </div>

        <div className="rounded-2xl bg-zinc-900 border border-red-500/30 p-5">

          <p className="text-red-400 text-sm">
            Suspensos
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {suspended}
          </h2>

        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-4">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar cliente..."
          className="
          flex-1
          rounded-xl
          bg-zinc-900
          border
          border-zinc-800
          px-4
          py-3
          outline-none
          "
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as never)}
          className="
          rounded-xl
          bg-zinc-900
          border
          border-zinc-800
          px-4
          py-3
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
{/* Recursos */}
<div className="space-y-3">
  <div className="flex items-center justify-between">
    <h3 className="text-lg font-semibold">
      ✨ Recursos do plano
    </h3>

    <button
      onClick={addFeature}
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 transition"
    >
      ➕ Adicionar
    </button>
  </div>

  <div className="space-y-2">
    {editing.features.map((item, index) => (
      <div
        key={index}
        className="flex gap-2"
      >
        <input
          className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-emerald-500"
          value={item}
          onChange={(e) =>
            updateFeature(index, e.target.value)
          }
        />

        <button
          onClick={() => removeFeature(index)}
          className="rounded-xl bg-red-600 px-4 hover:bg-red-500 transition"
        >
          🗑️
        </button>
      </div>
    ))}
  </div>
</div>

{/* Destaque */}
<div className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5">
  <label className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold">
        ⭐ Plano em destaque
      </h3>

      <p className="text-sm text-zinc-400">
        Este plano receberá selo de "Mais Popular".
      </p>
    </div>

    <input
      type="checkbox"
      checked={editing.highlighted}
      onChange={(e) =>
        setEditing({
          ...editing,
          highlighted: e.target.checked,
        })
      }
      className="h-5 w-5"
    />
  </label>
</div>

{/* Preview */}
<div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
  <p className="mb-4 text-sm font-bold text-emerald-400">
    👀 Pré-visualização
  </p>

  <div className="rounded-2xl bg-zinc-900 p-6">
    <h2 className="text-2xl font-bold">
      {editing.name}
    </h2>

    <p className="mt-2 text-zinc-400">
      {editing.tagline}
    </p>

    <div className="mt-5 text-4xl font-bold text-emerald-400">
      R$ {price}
      <span className="text-base text-zinc-400">
        /mês
      </span>
    </div>

    <div className="mt-5 space-y-2">
      <div>🌐 {editing.maxSites} Sites</div>
      <div>📄 {editing.maxPages} Páginas</div>
      <div>💾 {editing.storageMb} MB</div>
    </div>

    <ul className="mt-6 space-y-2 text-sm">
      {editing.features.map((item, index) => (
        <li key={index}>
          ✅ {item}
        </li>
      ))}
    </ul>
  </div>
</div>

{/* Botões */}
<div className="flex gap-3 pt-3">
  <button
    onClick={savePlan}
    className="flex-1 rounded-xl bg-emerald-500 py-3 font-bold text-black transition hover:bg-emerald-400"
  >
    💾 Salvar alterações
  </button>

  <button
    onClick={() => setEditing(null)}
    className="flex-1 rounded-xl bg-zinc-700 py-3 font-bold hover:bg-zinc-600 transition"
  >
    Cancelar
  </button>
</div>

</div>
</div>
)}
{/* Estatísticas */}

<div className="grid gap-6 md:grid-cols-4">

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
    <p className="text-sm text-zinc-400">
      💳 Planos cadastrados
    </p>

    <h2 className="mt-3 text-4xl font-bold">
      {plans.length}
    </h2>

    <p className="mt-2 text-xs text-zinc-500">
      Total de planos disponíveis
    </p>
  </div>

  <div className="rounded-2xl border border-green-600/30 bg-green-500/10 p-6">
    <p className="text-sm text-green-400">
      💰 Plano mais caro
    </p>

    <h2 className="mt-3 text-3xl font-bold text-white">
      {plans.length
        ? plans.reduce((a,b)=>
            a.priceCents>b.priceCents?a:b
          ).name
        : "--"}
    </h2>

    <p className="mt-2 text-sm text-green-300">
      {plans.length &&
      `R$ ${(
        plans.reduce((a,b)=>
          a.priceCents>b.priceCents?a:b
        ).priceCents/100
      ).toFixed(2).replace(".",",")}`}
    </p>
  </div>

  <div className="rounded-2xl border border-blue-600/30 bg-blue-500/10 p-6">
    <p className="text-sm text-blue-400">
      ⭐ Plano destaque
    </p>

    <h2 className="mt-3 text-3xl font-bold">
      {
        plans.find(p=>p.highlighted)?.name
        ?? "Nenhum"
      }
    </h2>

    <p className="mt-2 text-xs text-zinc-400">
      Exibido na página inicial
    </p>
  </div>

  <div className="rounded-2xl border border-yellow-600/30 bg-yellow-500/10 p-6">
    <p className="text-sm text-yellow-400">
      📈 Receita potencial
    </p>

    <h2 className="mt-3 text-3xl font-bold">
      R$ {
        (
          plans.reduce(
            (t,p)=>t+p.priceCents,
            0
          )/100
        ).toFixed(2).replace(".",",")
      }
    </h2>

    <p className="mt-2 text-xs text-zinc-400">
      Soma de todos os planos
    </p>
  </div>

</div>
{/* Comparativo dos planos */}

<div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

  <div className="mb-8">

    <h2 className="text-2xl font-bold">
      📊 Comparativo rápido
    </h2>

    <p className="text-zinc-400">
      Veja rapidamente as diferenças entre cada plano.
    </p>

  </div>

  <div className="space-y-8">

    {plans.map((plan) => (

      <div
        key={plan.id}
        className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
      >

        <div className="flex items-center justify-between">

          <div>

            <h3 className="text-xl font-bold">
              {plan.name}
            </h3>

            <p className="text-sm text-zinc-500">
              {plan.tagline}
            </p>

          </div>

          <div className="text-right">

            <div className="text-2xl font-bold text-emerald-400">
              R$ {(plan.priceCents / 100).toFixed(2).replace(".", ",")}
            </div>

            <span className="text-xs text-zinc-500">
              por mês
            </span>

          </div>

        </div>

        {/* Sites */}

        <div>

          <div className="mb-2 flex justify-between text-sm">
            <span>🌐 Sites</span>
            <span>{plan.maxSites}</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">

            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-700"
              style={{
                width: `${Math.min(plan.maxSites,100)}%`
              }}
            />

          </div>

        </div>

        {/* Páginas */}

        <div>

          <div className="mb-2 flex justify-between text-sm">
            <span>📄 Páginas</span>
            <span>{plan.maxPages}</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">

            <div
              className="h-2 rounded-full bg-violet-500 transition-all duration-700"
              style={{
                width: `${Math.min(plan.maxPages,100)}%`
              }}
            />

          </div>

        </div>

        {/* Armazenamento */}

        <div>

          <div className="mb-2 flex justify-between text-sm">
            <span>💾 Armazenamento</span>
            <span>{plan.storageMb} MB</span>
          </div>

          <div className="h-2 rounded-full bg-zinc-800">

            <div
              className="h-2 rounded-full bg-emerald-500 transition-all duration-700"
              style={{
                width: `${Math.min(plan.storageMb / 100,100)}%`
              }}
            />

          </div>

        </div>

      </div>

    ))}

  </div>

</div>