"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  siteId: string;
  slug: string;
  status: string;
}

export default function SiteActions({ siteId, slug, status }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function togglePublish() {
    setBusy(true);
    await fetch(`/api/sites/${siteId}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unpublish: status === "published" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Excluir este site permanentemente? Esta ação não pode ser desfeita.")) return;
    setBusy(true);
    await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  function copyLink() {
    void navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={togglePublish} disabled={busy} className="kf-btn kf-btn-ghost py-2 text-xs">
        {status === "published" ? "Despublicar" : "🚀 Publicar"}
      </button>
      <button type="button" onClick={copyLink} className="kf-btn kf-btn-ghost py-2 text-xs">
        {copied ? "✓ Copiado" : "Copiar link"}
      </button>
      <button type="button" onClick={remove} disabled={busy} className="kf-btn kf-btn-danger py-2 text-xs">
        Excluir
      </button>
    </div>
  );
}
