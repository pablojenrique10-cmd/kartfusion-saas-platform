"use client";

import { useEffect, useRef, useState } from "react";
import { formatBytes } from "@/lib/utils";

export interface MediaRecord {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  folder: string;
}

interface Props {
  storageMb: number;
  compact?: boolean;
  onPick?: (url: string) => void;
}

export default function MediaLibrary({ storageMb, compact = false, onPick }: Props) {
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [usedBytes, setUsedBytes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = (await res.json()) as { media?: MediaRecord[]; usedBytes?: number };
      setItems(data.media ?? []);
      setUsedBytes(data.usedBytes ?? 0);
    } catch {
      setError("Não foi possível carregar a biblioteca.");
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(payload: Record<string, unknown>) {
    setError(null);
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Falha ao salvar mídia.");
      return;
    }
    await load();
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) {
      setError("Arquivo muito grande. Máximo de 2.5MB por imagem.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      await save({
        name: file.name,
        url: String(reader.result),
        mimeType: file.type,
        sizeBytes: file.size,
        folder: "uploads",
      });
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.readAsDataURL(file);
  }

  async function addUrl() {
    if (!urlInput.trim()) return;
    await save({ name: urlInput.split("/").pop() ?? "imagem", url: urlInput.trim(), folder: "links" });
    setUrlInput("");
  }

  async function remove(id: string) {
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    await load();
  }

  const pct = Math.min(100, (usedBytes / (storageMb * 1024 * 1024)) * 100);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="flex gap-2">
          <input
            className="kf-input"
            placeholder="Cole a URL de uma imagem..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="button" onClick={addUrl} className="kf-btn kf-btn-ghost text-xs">Adicionar</button>
        </div>
        <label className="kf-btn kf-btn-primary cursor-pointer text-xs">
          ⬆ Enviar imagem
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      </div>

      {!compact && (
        <div className="rounded-xl border border-white/6 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Armazenamento usado</span>
            <span className="font-semibold text-white">
              {formatBytes(usedBytes)} / {storageMb >= 1000 ? `${storageMb / 1000} GB` : `${storageMb} MB`}
            </span>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fusion-500 to-neon-500 transition-all"
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-xs text-slate-500">Carregando biblioteca...</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <p className="text-3xl">🖼️</p>
          <p className="mt-3 text-sm font-semibold text-white">Sua biblioteca está vazia</p>
          <p className="mt-1 text-xs text-slate-500">Envie imagens ou adicione por URL para reutilizar nos sites.</p>
        </div>
      ) : (
        <div className={`grid gap-3 ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-white/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.name} className="h-24 w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/70 p-2 opacity-0 transition group-hover:opacity-100">
                <p className="truncate text-[10px] text-white">{item.name}</p>
                <div className="flex gap-1">
                  {onPick && (
                    <button
                      type="button"
                      onClick={() => onPick(item.url)}
                      className="flex-1 rounded bg-neon-500 px-1.5 py-1 text-[10px] font-bold text-black"
                    >
                      Usar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded bg-rose-500/80 px-1.5 py-1 text-[10px] font-bold text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
