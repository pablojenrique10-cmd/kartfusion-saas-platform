"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Inspector from "@/components/editor/Inspector";
import SectionRenderer from "@/components/site/SectionRenderer";
import {
  BLOCK_LIBRARY,
  createSection,
  uid,
  type BlockType,
  type EditorPage,
  type EditorSection,
  type SectionContent,
  type SectionStyles,
} from "@/lib/blocks";
import { cn, slugify } from "@/lib/utils";

export interface SiteMeta {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customDomain: string;
  seo: Record<string, unknown>;
  settings: Record<string, unknown>;
}

interface Snapshot {
  pages: EditorPage[];
  sections: Record<string, EditorSection[]>;
  meta: SiteMeta;
}

interface Props {
  initialMeta: SiteMeta;
  initialPages: EditorPage[];
  initialSections: Record<string, EditorSection[]>;
  planLevel: number;
  planName: string;
  maxPages: number;
  storageMb: number;
}

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: "🖥", width: 0 },
  { id: "tablet", label: "Tablet", icon: "📱", width: 834 },
  { id: "mobile", label: "Mobile", icon: "📲", width: 390 },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

const GROUPS = ["Estrutura", "Conteúdo", "Mídia", "Conversão", "Social"] as const;

export default function EditorShell({
  initialMeta,
  initialPages,
  initialSections,
  planLevel,
  planName,
  maxPages,
  storageMb,
}: Props) {
  const [state, setState] = useState<Snapshot>({
    pages: initialPages,
    sections: initialSections,
    meta: initialMeta,
  });
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [activePageId, setActivePageId] = useState(initialPages[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceId>("desktop");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [drawer, setDrawer] = useState<null | "seo" | "history" | "site">(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [revisions, setRevisions] = useState<
    { id: string; label: string; kind: string; createdAt: string }[]
  >([]);

  const dragSource = useRef<{ kind: "new"; type: BlockType } | { kind: "move"; index: number } | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const pageSections = useMemo(
    () => state.sections[activePageId] ?? [],
    [state.sections, activePageId],
  );
  const selected = pageSections.find((section) => section.id === selectedId) ?? null;

  /* ------------------------------- history -------------------------------- */
  const commit = useCallback(
    (next: Snapshot) => {
      setPast((prev) => [...prev.slice(-49), stateRef.current]);
      setFuture([]);
      setState(next);
      setDirty(true);
    },
    [],
  );

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      setFuture((f) => [stateRef.current, ...f].slice(0, 50));
      setState(previous);
      setDirty(true);
      return prevPast.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      setPast((p) => [...p, stateRef.current]);
      setState(next);
      setDirty(true);
      return prevFuture.slice(1);
    });
  }, []);

  /* ------------------------------ persistence ----------------------------- */
  const save = useCallback(
    async (kind: "manual" | "autosave") => {
      const snapshot = stateRef.current;
      setSaving(true);
      try {
        const res = await fetch(`/api/sites/${snapshot.meta.id}/content`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind,
            content: { pages: snapshot.pages, sections: snapshot.sections },
            site: {
              name: snapshot.meta.name,
              primaryColor: snapshot.meta.primaryColor,
              secondaryColor: snapshot.meta.secondaryColor,
              fontFamily: snapshot.meta.fontFamily,
              seo: snapshot.meta.seo,
              settings: snapshot.meta.settings,
            },
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setToast(data.error ?? "Erro ao salvar");
        } else {
          setSavedAt(new Date());
          setDirty(false);
          if (kind === "manual") setToast("💾 Alterações salvas com sucesso");
        }
      } catch {
        setToast("Falha de conexão ao salvar");
      }
      setSaving(false);
    },
    [],
  );

  // Autosave
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => void save("autosave"), 2200);
    return () => clearTimeout(timer);
  }, [dirty, state, save]);

  // Atalhos de teclado
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      if (event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if ((event.key.toLowerCase() === "z" && event.shiftKey) || event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save("manual");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, save]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  /* -------------------------------- blocks -------------------------------- */
  function setPageSections(next: EditorSection[]) {
    commit({
      ...state,
      sections: { ...state.sections, [activePageId]: next.map((s, i) => ({ ...s, position: i })) },
    });
  }

  function addBlock(type: BlockType, index?: number) {
    const definition = BLOCK_LIBRARY.find((block) => block.type === type);
    if (definition && definition.minPlanLevel > planLevel) {
      setToast(`🔒 O bloco "${definition.label}" exige um plano superior`);
      return;
    }
    const block = createSection(type, pageSections.length);
    const next = [...pageSections];
    next.splice(index ?? next.length, 0, block);
    setPageSections(next);
    setSelectedId(block.id);
  }

  function updateSelected(patch: Partial<EditorSection>) {
    if (!selected) return;
    setPageSections(pageSections.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)));
  }

  function updateContent(patch: SectionContent) {
    if (!selected) return;
    updateSelected({ content: { ...selected.content, ...patch } });
  }

  function updateStyles(patch: SectionStyles) {
    if (!selected) return;
    updateSelected({ styles: { ...selected.styles, ...patch } });
  }

  function duplicateSelected() {
    if (!selected) return;
    const index = pageSections.findIndex((s) => s.id === selected.id);
    const clone: EditorSection = {
      ...selected,
      id: uid("sec"),
      content: JSON.parse(JSON.stringify(selected.content)) as SectionContent,
      styles: { ...selected.styles },
    };
    const next = [...pageSections];
    next.splice(index + 1, 0, clone);
    setPageSections(next);
    setSelectedId(clone.id);
  }

  function deleteSelected() {
    if (!selected) return;
    setPageSections(pageSections.filter((s) => s.id !== selected.id));
    setSelectedId(null);
  }

  function moveBlock(from: number, to: number) {
    if (from === to) return;
    const next = [...pageSections];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setPageSections(next);
  }

  /* -------------------------------- pages --------------------------------- */
  function addPage() {
    if (state.pages.length >= maxPages) {
      setToast(`🔒 Seu plano permite até ${maxPages} páginas`);
      return;
    }
    const id = uid("page");
    const name = `Página ${state.pages.length + 1}`;
    const page: EditorPage = {
      id,
      name,
      path: `/${slugify(name)}`,
      isHome: false,
      position: state.pages.length,
      seo: {},
    };
    commit({
      ...state,
      pages: [...state.pages, page],
      sections: { ...state.sections, [id]: [createSection("header", 0), createSection("text", 1), createSection("footer", 2)] },
    });
    setActivePageId(id);
  }

  function removePage(id: string) {
    if (state.pages.length <= 1) {
      setToast("O site precisa ter ao menos uma página");
      return;
    }
    const nextPages = state.pages.filter((page) => page.id !== id);
    const nextSections = { ...state.sections };
    delete nextSections[id];
    if (!nextPages.some((page) => page.isHome)) nextPages[0].isHome = true;
    commit({ ...state, pages: nextPages, sections: nextSections });
    setActivePageId(nextPages[0].id);
  }

  function renamePage(id: string, name: string) {
    commit({
      ...state,
      pages: state.pages.map((page) =>
        page.id === id ? { ...page, name, path: page.isHome ? "/" : `/${slugify(name)}` } : page,
      ),
    });
  }

  /* -------------------------------- site ---------------------------------- */
  function updateMeta(patch: Partial<SiteMeta>) {
    commit({ ...state, meta: { ...state.meta, ...patch } });
  }

  function updateSeo(patch: Record<string, unknown>) {
    updateMeta({ seo: { ...state.meta.seo, ...patch } });
  }

  async function publish() {
    setPublishing(true);
    await save("manual");
    const res = await fetch(`/api/sites/${state.meta.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unpublish: state.meta.status === "published" }),
    });
    const data = (await res.json()) as { site?: { status: string } };
    if (data.site) setState((prev) => ({ ...prev, meta: { ...prev.meta, status: data.site!.status } }));
    setToast(data.site?.status === "published" ? "🚀 Site publicado!" : "Site voltou para rascunho");
    setPublishing(false);
  }

  async function loadRevisions() {
    const res = await fetch(`/api/sites/${state.meta.id}/revisions`);
    const data = (await res.json()) as { revisions?: typeof revisions };
    setRevisions(data.revisions ?? []);
  }

  async function restoreRevision(revisionId: string) {
    const res = await fetch(`/api/sites/${state.meta.id}/revisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revisionId }),
    });
    const data = (await res.json()) as {
      content?: { pages: EditorPage[]; sections: Record<string, EditorSection[]> };
    };
    if (data.content) {
      commit({ ...state, pages: data.content.pages, sections: data.content.sections });
      setActivePageId(data.content.pages[0]?.id ?? "");
      setSelectedId(null);
      setToast("Revisão restaurada");
      setDrawer(null);
    }
  }

  const theme = {
    primaryColor: state.meta.primaryColor,
    secondaryColor: state.meta.secondaryColor,
    fontFamily: state.meta.fontFamily,
  };
  const frameWidth = DEVICES.find((d) => d.id === device)?.width ?? 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-ink-950">
      {/* TOPBAR */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/6 bg-ink-900/90 px-4 backdrop-blur">
        <Link href="/dashboard/sites" className="kf-btn kf-btn-ghost px-3 py-1.5 text-xs">←</Link>
        <div className="min-w-0">
          <input
            value={state.meta.name}
            onChange={(e) => updateMeta({ name: e.target.value })}
            className="w-40 truncate rounded-md bg-transparent text-sm font-bold text-white outline-none focus:bg-white/5 sm:w-56"
          />
          <p className="text-[10px] text-slate-500">
            {saving ? "Salvando..." : dirty ? "Alterações não salvas" : savedAt ? `Salvo ${savedAt.toLocaleTimeString("pt-BR")}` : "Tudo salvo"}
          </p>
        </div>

        <div className="mx-auto hidden items-center gap-1 rounded-xl bg-white/4 p-1 lg:flex">
          {DEVICES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDevice(item.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                device === item.id ? "bg-fusion-500 text-white" : "text-slate-400 hover:text-white",
              )}
            >
              {item.icon} <span className="hidden xl:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={undo} disabled={past.length === 0} className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-xs" title="Desfazer (Ctrl+Z)">↶</button>
          <button type="button" onClick={redo} disabled={future.length === 0} className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-xs" title="Refazer (Ctrl+Shift+Z)">↷</button>
          <button
            type="button"
            onClick={() => setPreviewMode((v) => !v)}
            className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-xs"
            title="Modo pré-visualização"
          >
            {previewMode ? "✎" : "👁"}
          </button>
          <button type="button" onClick={() => { setDrawer("seo"); }} className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-xs">SEO</button>
          <button
            type="button"
            onClick={() => { setDrawer("history"); void loadRevisions(); }}
            className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-xs"
          >
            🕘
          </button>
          <button type="button" onClick={() => void save("manual")} disabled={saving} className="kf-btn kf-btn-ghost px-3 py-1.5 text-xs">
            💾 <span className="hidden sm:inline">Salvar</span>
          </button>
          <button type="button" onClick={publish} disabled={publishing} className="kf-btn kf-btn-success px-3 py-1.5 text-xs">
            {state.meta.status === "published" ? "✓ Publicado" : "🚀 Publicar"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* LEFT PALETTE */}
        {!previewMode && (
          <aside className="hidden w-[230px] shrink-0 flex-col overflow-y-auto border-r border-white/6 bg-ink-900/70 md:flex">
            <div className="border-b border-white/6 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Elementos</p>
              <p className="mt-1 text-[10px] text-slate-600">Clique ou arraste para o canvas</p>
            </div>
            <div className="grid gap-4 px-3 py-4">
              {GROUPS.map((group) => (
                <div key={group}>
                  <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">{group}</p>
                  <div className="grid gap-1.5">
                    {BLOCK_LIBRARY.filter((block) => block.group === group).map((block) => {
                      const locked = block.minPlanLevel > planLevel;
                      return (
                        <button
                          key={block.type}
                          type="button"
                          draggable={!locked}
                          onDragStart={() => {
                            dragSource.current = { kind: "new", type: block.type };
                          }}
                          onClick={() => addBlock(block.type)}
                          title={block.description}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg border border-white/6 bg-white/[0.02] px-2.5 py-2 text-left text-xs text-slate-300 transition hover:border-fusion-500/40 hover:bg-fusion-500/8 hover:text-white",
                            locked && "cursor-not-allowed opacity-40",
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/6 text-[11px] text-fusion-300">
                            {block.icon}
                          </span>
                          <span className="truncate">{block.label}</span>
                          {locked && <span className="ml-auto text-[9px] text-amber-400">🔒</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* CANVAS */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-ink-950">
          {/* Pages bar */}
          {!previewMode && (
            <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-white/6 bg-ink-900/50 px-4 py-2">
              {state.pages.map((page) => (
                <div
                  key={page.id}
                  className={cn(
                    "group flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition",
                    activePageId === page.id
                      ? "border-fusion-500/50 bg-fusion-500/12 text-white"
                      : "border-white/8 bg-white/[0.02] text-slate-400 hover:text-white",
                  )}
                >
                  <button type="button" onClick={() => { setActivePageId(page.id); setSelectedId(null); }}>
                    {page.isHome ? "🏠 " : ""}
                    {page.name}
                  </button>
                  {activePageId === page.id && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt("Nome da página", page.name);
                          if (name) renamePage(page.id, name);
                        }}
                        className="opacity-60 hover:opacity-100"
                      >
                        ✎
                      </button>
                      {!page.isHome && (
                        <button type="button" onClick={() => removePage(page.id)} className="text-rose-400 opacity-60 hover:opacity-100">
                          ✕
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPage} className="kf-btn kf-btn-ghost shrink-0 px-2.5 py-1.5 text-xs">
                ＋ Página
              </button>
              <span className="ml-auto shrink-0 text-[10px] text-slate-600">
                {pageSections.length} blocos · plano {planName}
              </span>
            </div>
          )}

          {/* Frame */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div
              className="kf-canvas-frame mx-auto overflow-hidden rounded-2xl bg-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
              style={{ width: frameWidth ? `${frameWidth}px` : "100%", maxWidth: "100%" }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const source = dragSource.current;
                if (source?.kind === "new") addBlock(source.type, dragOverIndex ?? undefined);
                dragSource.current = null;
                setDragOverIndex(null);
              }}
            >
              {pageSections.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-center text-slate-400">
                  <span className="text-4xl">🧱</span>
                  <p className="text-sm font-semibold text-slate-600">Página vazia</p>
                  <p className="max-w-xs text-xs text-slate-400">
                    Clique nos elementos da barra lateral para começar a montar sua página.
                  </p>
                </div>
              ) : (
                pageSections.map((section, index) => (
                  <div
                    key={section.id}
                    data-selected={selectedId === section.id}
                    className={cn(
                      "kf-block-shell group",
                      dragOverIndex === index && "kf-drag-over",
                      !section.visible && "opacity-40",
                      previewMode && "outline-none",
                    )}
                    draggable={!previewMode}
                    onDragStart={() => {
                      dragSource.current = { kind: "move", index };
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverIndex(index);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const source = dragSource.current;
                      if (source?.kind === "move") moveBlock(source.index, index);
                      else if (source?.kind === "new") addBlock(source.type, index);
                      dragSource.current = null;
                      setDragOverIndex(null);
                    }}
                    onClick={() => !previewMode && setSelectedId(section.id)}
                  >
                    {!previewMode && (
                      <div className="pointer-events-none absolute left-2 top-2 z-20 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <span className="pointer-events-auto cursor-grab rounded-md bg-ink-900/90 px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
                          ⠿ {section.name}
                        </span>
                      </div>
                    )}
                    {!previewMode && (
                      <div className="pointer-events-none absolute right-2 top-2 z-20 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(event) => { event.stopPropagation(); moveBlock(index, Math.max(0, index - 1)); }}
                          className="pointer-events-auto rounded-md bg-ink-900/90 px-2 py-1 text-[10px] text-white shadow-lg"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={(event) => { event.stopPropagation(); moveBlock(index, Math.min(pageSections.length - 1, index + 1)); }}
                          className="pointer-events-auto rounded-md bg-ink-900/90 px-2 py-1 text-[10px] text-white shadow-lg"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(section.id);
                            setTimeout(duplicateSelected, 0);
                          }}
                          className="pointer-events-auto rounded-md bg-ink-900/90 px-2 py-1 text-[10px] text-white shadow-lg"
                        >
                          ⧉
                        </button>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setPageSections(pageSections.filter((s) => s.id !== section.id));
                            if (selectedId === section.id) setSelectedId(null);
                          }}
                          className="pointer-events-auto rounded-md bg-rose-500/90 px-2 py-1 text-[10px] text-white shadow-lg"
                        >
                          🗑
                        </button>
                      </div>
                    )}
                    <SectionRenderer section={section} theme={theme} siteId={state.meta.id} interactive={false} />
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* RIGHT INSPECTOR */}
        {!previewMode && (
          <aside className="hidden w-[300px] shrink-0 border-l border-white/6 bg-ink-900/70 lg:block">
            <Inspector
              section={selected}
              storageMb={storageMb}
              onChangeContent={updateContent}
              onChangeStyles={updateStyles}
              onDuplicate={duplicateSelected}
              onDelete={deleteSelected}
              onToggleVisible={() => updateSelected({ visible: !selected?.visible })}
            />
          </aside>
        )}
      </div>

      {/* DRAWERS */}
      {drawer && (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(null)}>
          <div
            className="h-full w-full max-w-md overflow-y-auto border-l border-white/8 bg-ink-900 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {drawer === "seo" ? "SEO e domínio" : drawer === "history" ? "Histórico de revisões" : "Configurações do site"}
              </h2>
              <button type="button" onClick={() => setDrawer(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {drawer === "seo" && (
              <div className="grid gap-4">
                <div>
                  <span className="kf-label">Título da página (SEO)</span>
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(state.meta.seo.title ?? "")}
                    onChange={(e) => updateSeo({ title: e.target.value })}
                  />
                </div>
                <div>
                  <span className="kf-label">Descrição</span>
                  <textarea
                    className="kf-input min-h-[80px] py-2 text-xs"
                    value={String(state.meta.seo.description ?? "")}
                    onChange={(e) => updateSeo({ description: e.target.value })}
                  />
                </div>
                <div>
                  <span className="kf-label">Palavras-chave</span>
                  <input
                    className="kf-input py-2 text-xs"
                    placeholder="site, empresa, serviços"
                    value={String(state.meta.seo.keywords ?? "")}
                    onChange={(e) => updateSeo({ keywords: e.target.value })}
                  />
                </div>
                <div>
                  <span className="kf-label">Imagem Open Graph (URL)</span>
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(state.meta.seo.ogImage ?? "")}
                    onChange={(e) => updateSeo({ ogImage: e.target.value })}
                  />
                </div>
                <div>
                  <span className="kf-label">Ícone (emoji favicon)</span>
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(state.meta.seo.favicon ?? "")}
                    onChange={(e) => updateSeo({ favicon: e.target.value })}
                  />
                </div>
                <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                  <p className="text-xs font-semibold text-white">Endereço público</p>
                  <p className="mt-1 break-all text-[11px] text-neon-400">kartfusion.com/site/{state.meta.slug}</p>
                  <a
                    href={`/site/${state.meta.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="kf-btn kf-btn-ghost mt-3 w-full py-2 text-xs"
                  >
                    Abrir site publicado ↗
                  </a>
                  <p className="mt-3 text-[11px] text-slate-500">
                    Sitemap: <span className="text-slate-300">/sitemap.xml</span>
                  </p>
                </div>
                <div>
                  <span className="kf-label">Domínio personalizado {planLevel < 3 && "🔒 Premium"}</span>
                  <input
                    className="kf-input py-2 text-xs"
                    disabled={planLevel < 3}
                    placeholder="www.suaempresa.com.br"
                    value={state.meta.customDomain}
                    onChange={(e) => updateMeta({ customDomain: e.target.value })}
                  />
                </div>
                <div className="grid gap-3">
                  <span className="kf-label">Identidade visual</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="color"
                      value={state.meta.primaryColor}
                      onChange={(e) => updateMeta({ primaryColor: e.target.value })}
                      className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
                    />
                    <input
                      type="color"
                      value={state.meta.secondaryColor}
                      onChange={(e) => updateMeta({ secondaryColor: e.target.value })}
                      className="h-9 w-full cursor-pointer rounded-lg border border-white/10 bg-transparent"
                    />
                  </div>
                  <select
                    className="kf-input py-2 text-xs"
                    value={state.meta.fontFamily}
                    onChange={(e) => updateMeta({ fontFamily: e.target.value })}
                  >
                    {["Inter", "Poppins", "Sora", "Montserrat", "Playfair Display", "Merriweather", "Oswald"].map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={() => void save("manual")} className="kf-btn kf-btn-success w-full">
                  💾 Salvar configurações
                </button>
              </div>
            )}

            {drawer === "history" && (
              <div className="grid gap-2.5">
                <p className="text-xs text-slate-500">
                  Autosave a cada alteração + revisões manuais e de publicação. Restaure qualquer ponto.
                </p>
                {revisions.length === 0 && <p className="text-xs text-slate-600">Nenhuma revisão ainda.</p>}
                {revisions.map((revision) => (
                  <div
                    key={revision.id}
                    className="flex items-center justify-between rounded-xl border border-white/7 bg-white/[0.02] px-3.5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{revision.label}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(revision.createdAt).toLocaleString("pt-BR")} · {revision.kind}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void restoreRevision(revision.id)}
                      className="kf-btn kf-btn-ghost px-2.5 py-1.5 text-[11px]"
                    >
                      Restaurar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-xl border border-white/10 bg-ink-800/95 px-5 py-3 text-sm text-white shadow-2xl backdrop-blur kf-fade-up">
          {toast}
        </div>
      )}
    </div>
  );
}
