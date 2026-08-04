import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";
import { TRIAL_DAYS } from "@/lib/plans";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <span className="kf-chip border-neon-500/30 bg-neon-500/10 text-neon-400">
        <span className="h-1.5 w-1.5 rounded-full bg-neon-500 kf-pulse" />
        {TRIAL_DAYS} dias de Premium grátis
      </span>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white">Crie sua conta</h1>
      <p className="mt-1.5 mb-7 text-sm text-slate-400">
        Acesso completo ao plano Premium, sem cartão de crédito e sem limitações durante o teste.
      </p>
      <AuthForm mode="register" />
      <p className="mt-6 text-center text-sm text-slate-400">
        Já possui conta?{" "}
        <Link href="/login" className="font-semibold text-fusion-400 transition hover:text-fusion-300">
          Entrar
        </Link>
      </p>
      <Link href="/" className="mt-3 block text-center text-xs text-slate-600 transition hover:text-slate-400">
        ← Voltar para o site
      </Link>
    </div>
  );
}
