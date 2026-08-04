"use client";

import { useState } from "react";

interface Props {
  siteId?: string;
  buttonLabel: string;
  accent: string;
  buttonTextColor: string;
  radius: number;
  interactive?: boolean;
}

export default function LeadForm({
  siteId,
  buttonLabel,
  accent,
  buttonTextColor,
  radius,
  interactive = true,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white/80 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-black/30 focus:bg-white";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!interactive || !siteId) {
      setStatus("done");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          message: formData.get("message"),
        }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto grid w-full max-w-2xl gap-3 text-left">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder="Seu nome" className={inputClass} />
        <input name="email" type="email" required placeholder="Seu e-mail" className={inputClass} />
      </div>
      <input name="phone" placeholder="Telefone / WhatsApp" className={inputClass} />
      <textarea name="message" rows={4} placeholder="Como podemos ajudar?" className={inputClass} />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold transition hover:brightness-110 disabled:opacity-60"
        style={{ background: accent, color: buttonTextColor, borderRadius: radius }}
      >
        {status === "sending" ? "Enviando..." : buttonLabel}
      </button>
      {status === "done" && (
        <p className="text-sm font-medium text-emerald-600">Mensagem enviada com sucesso! 🎉</p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-rose-600">Não foi possível enviar. Tente novamente.</p>
      )}
    </form>
  );
}
