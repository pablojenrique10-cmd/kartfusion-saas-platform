"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        KartFusion
        <span className="text-green-400"> Admin</span>
      </h1>

      <nav className="space-y-3">

        <Link 
          href="/admin"
          className="block rounded-lg px-4 py-2 hover:bg-zinc-800"
        >
          📊 Dashboard
        </Link>

        <Link 
          href="/admin/usuarios"
          className="block rounded-lg px-4 py-2 hover:bg-zinc-800"
        >
          👥 Usuários
        </Link>

        <Link 
          href="/admin/planos"
          className="block rounded-lg px-4 py-2 hover:bg-zinc-800"
        >
          💳 Planos
        </Link>

        <Link 
          href="/admin/assinaturas"
          className="block rounded-lg px-4 py-2 hover:bg-zinc-800"
        >
          🚀 Assinaturas
        </Link>

        <Link 
          href="/admin/sites"
          className="block rounded-lg px-4 py-2 hover:bg-zinc-800"
        >
          🌐 Sites
        </Link>

      </nav>
    </aside>
  );
}