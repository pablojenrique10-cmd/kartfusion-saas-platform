"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "◧" },
  { href: "/dashboard/criar", label: "Criar Site", icon: "＋" },
  { href: "/dashboard/sites", label: "Meus Sites", icon: "▤" },
  { href: "/dashboard/templates", label: "Templates", icon: "◫" },
  { href: "/dashboard/biblioteca", label: "Biblioteca", icon: "❖" },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: "⚙" },
  { href: "/dashboard/perfil", label: "Perfil", icon: "◉" },
];

interface Props {
  planName: string;
  trialing: boolean;
  trialDaysLeft: number;
}

export default function Sidebar({
  planName,
  trialing,
  trialDaysLeft,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="grid gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-gradient-to-r from-fusion-500/20 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(47,123,255,0.28)]"
                : "text-slate-400 hover:bg-white/[0.04] hover:text-white",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg text-xs transition",
                active
                  ? "bg-fusion-500 text-white"
                  : "bg-white/5 text-slate-400 group-hover:text-white",
              )}
            >
              {item.icon}
            </span>

            {item.label}
          </Link>
        );
      })}
    </nav>
  );


  const planBox = (
    <div className="mt-auto grid gap-3">
      <div className="rounded-xl border border-white/8 bg-gradient-to-br from-fusion-500/12 to-neon-500/8 p-4">

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Plano atual
        </p>

        <p className="mt-1 text-sm font-extrabold text-white">
          {planName}
        </p>


        {trialing && (
          <p className="mt-1 text-[11px] text-neon-400">
            {trialDaysLeft}{" "}
            {trialDaysLeft === 1
              ? "dia restante"
              : "dias restantes"}
          </p>
        )}


        <Link
          href="/dashboard/planos"
          className="kf-btn kf-btn-primary mt-3 w-full py-2 text-xs"
        >
          Gerenciar plano
        </Link>

      </div>
    </div>
  );


  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-fusion-500 text-white shadow-lg lg:hidden"
        aria-label="Abrir menu"
      >
        ☰
      </button>


      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}


      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col gap-6 border-r border-white/6 bg-ink-900/95 p-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
          open
            ? "translate-x-0"
            : "-translate-x-full",
        )}
      >

        <div className="flex items-center justify-between">

          {/* Logo clicável para página inicial */}
          <Logo href="/" size={34} />


          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-slate-500 lg:hidden"
            aria-label="Fechar menu"
          >
            ✕
          </button>

        </div>


        {nav}


        {planBox}


      </aside>
    </>
  );
}