"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  name: string;
  email: string;
  planName: string;
  avatarColor: string;
}

export default function Topbar({ name, email, planName, avatarColor }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/6 bg-ink-950/80 px-5 backdrop-blur-xl">
      <div className="hidden text-sm text-slate-500 sm:block">
        Bem-vindo de volta, <span className="font-semibold text-white">{name.split(" ")[0]}</span> 👋
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link href="/dashboard/criar" className="kf-btn kf-btn-success py-2 text-xs">
          ＋ Novo site
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] py-1.5 pl-1.5 pr-3 transition hover:bg-white/[0.07]"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
              style={{ background: avatarColor }}
            >
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-semibold leading-tight text-white">{name}</span>
              <span className="block text-[10px] leading-tight text-slate-500">{planName}</span>
            </span>
            <span className="text-[10px] text-slate-500">▾</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="glass-strong absolute right-0 z-20 mt-2 w-60 rounded-xl p-2 kf-fade-up">
                <div className="border-b border-white/8 px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-white">{name}</p>
                  <p className="truncate text-xs text-slate-500">{email}</p>
                </div>
                <Link
                  href="/dashboard/perfil"
                  onClick={() => setOpen(false)}
                  className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  ◉ Meu perfil
                </Link>
                <Link
                  href="/dashboard/planos"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  ✦ Planos
                </Link>
                <Link
                  href="/dashboard/configuracoes"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  ⚙ Configurações
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                >
                  ⇥ Sair da conta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
