"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const isRegister = mode === "register";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? form : { email: form.email, password: form.password },
        ),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Algo deu errado.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Falha de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {isRegister && (
        <div>
          <label className="kf-label" htmlFor="name">Nome completo</label>
          <input
            id="name"
            className="kf-input"
            placeholder="Ana Ribeiro"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoComplete="name"
          />
        </div>
      )}
      <div>
        <label className="kf-label" htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className="kf-input"
          placeholder="voce@empresa.com.br"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className="kf-label" htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          className="kf-input"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="kf-btn kf-btn-success mt-1 w-full py-3">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="kf-spin inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black" />
            Processando...
          </span>
        ) : isRegister ? (
          "Criar conta e testar Premium"
        ) : (
          "Entrar na plataforma"
        )}
      </button>
    </form>
  );
}
