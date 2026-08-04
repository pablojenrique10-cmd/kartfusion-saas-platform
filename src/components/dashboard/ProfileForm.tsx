"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  initial: {
    name: string;
    email: string;
    company: string;
    phone: string;
    avatarColor: string;
  };
}

const COLORS = ["#2f7bff", "#22e58a", "#a855f7", "#f97316", "#0ea5e9", "#f43f5e", "#eab308", "#14b8a6"];

export default function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    const payload: Record<string, unknown> = { ...form };
    if (passwords.newPassword) {
      payload.currentPassword = passwords.currentPassword;
      payload.newPassword = passwords.newPassword;
    }
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) {
      setStatus({ type: "error", text: data.error ?? "Não foi possível salvar." });
      return;
    }
    setStatus({ type: "ok", text: "Perfil atualizado com sucesso!" });
    setPasswords({ currentPassword: "", newPassword: "" });
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="kf-card p-6">
        <h2 className="text-base font-bold text-white">Dados pessoais</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="kf-label" htmlFor="p-name">Nome</label>
            <input
              id="p-name"
              className="kf-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="kf-label" htmlFor="p-email">E-mail</label>
            <input
              id="p-email"
              type="email"
              className="kf-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="kf-label" htmlFor="p-company">Empresa</label>
            <input
              id="p-company"
              className="kf-input"
              placeholder="Opcional"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div>
            <label className="kf-label" htmlFor="p-phone">Telefone</label>
            <input
              id="p-phone"
              className="kf-input"
              placeholder="(11) 99999-9999"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>

        <h2 className="mt-8 text-base font-bold text-white">Alterar senha</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="kf-label" htmlFor="p-cur">Senha atual</label>
            <input
              id="p-cur"
              type="password"
              className="kf-input"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="kf-label" htmlFor="p-new">Nova senha</label>
            <input
              id="p-new"
              type="password"
              className="kf-input"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </div>
        </div>

        {status && (
          <p
            className={`mt-5 rounded-xl px-4 py-2.5 text-sm ${
              status.type === "ok"
                ? "border border-neon-500/30 bg-neon-500/10 text-neon-300"
                : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {status.text}
          </p>
        )}

        <button type="submit" disabled={busy} className="kf-btn kf-btn-success mt-6">
          {busy ? "Salvando..." : "💾 Salvar alterações"}
        </button>
      </div>

      <div className="kf-card p-6">
        <h2 className="text-base font-bold text-white">Avatar</h2>
        <div className="mt-5 flex items-center gap-4">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
            style={{ background: form.avatarColor }}
          >
            {form.name.charAt(0).toUpperCase() || "K"}
          </span>
          <div>
            <p className="text-sm font-semibold text-white">{form.name || "Seu nome"}</p>
            <p className="text-xs text-slate-500">{form.email}</p>
          </div>
        </div>
        <p className="mt-6 kf-label">Cor do avatar</p>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm({ ...form, avatarColor: color })}
              className={`h-9 w-9 rounded-xl transition ${
                form.avatarColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-ink-900" : ""
              }`}
              style={{ background: color }}
              aria-label={`Cor ${color}`}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
