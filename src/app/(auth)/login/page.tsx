import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="glass-strong rounded-2xl p-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-white">Bem-vindo de volta</h1>
      <p className="mt-1.5 mb-7 text-sm text-slate-400">
        Acesse sua conta para continuar criando sites incríveis.
      </p>
      <AuthForm mode="login" />
      <div className="mt-5 rounded-xl border border-fusion-500/25 bg-fusion-500/8 px-4 py-3 text-xs text-slate-300">
        <p className="font-semibold text-fusion-300">Conta de demonstração</p>
        <p className="mt-1">
          E-mail: <span className="font-mono text-white">demo@kartfusion.com</span>
          <br />
          Senha: <span className="font-mono text-white">kartfusion</span>
        </p>
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-fusion-400 transition hover:text-fusion-300">
          Criar conta grátis
        </Link>
      </p>
      <Link href="/" className="mt-3 block text-center text-xs text-slate-600 transition hover:text-slate-400">
        ← Voltar para o site
      </Link>
    </div>
  );
}
