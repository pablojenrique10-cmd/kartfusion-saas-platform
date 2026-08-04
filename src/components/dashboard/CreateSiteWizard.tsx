"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { TemplateDefinition } from "@/lib/templates";
import { cn, slugify } from "@/lib/utils";

const FONTS = ["Inter", "Poppins", "Sora", "Montserrat", "Playfair Display", "Merriweather", "Oswald"];
const COLOR_PRESETS = [
  { primary: "#2f7bff", secondary: "#22e58a", name: "Tech" },
  { primary: "#10b981", secondary: "#0ea5e9", name: "Natureza" },
  { primary: "#a855f7", secondary: "#f43f5e", name: "Criativo" },
  { primary: "#f97316", secondary: "#facc15", name: "Energia" },
  { primary: "#1d4ed8", secondary: "#d4af37", name: "Corporativo" },
  { primary: "#0f172a", secondary: "#22e58a", name: "Minimal" },
];

interface Props {
  templates: TemplateDefinition[];
  planLevel: number;
  initialTemplate?: string;
}

export default function CreateSiteWizard({ templates, planLevel, initialTemplate }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialTemplate ? 2 : 1);
  const [templateId, setTemplateId] = useState(initialTemplate ?? templates[0]?.id ?? "empresa");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#2f7bff");
  const [secondaryColor, setSecondaryColor] = useState("#22e58a");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("Todos");

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(templates.map((t) => t.category)))],
    [templates],
  );

  const visible = useMemo(
    () => (category === "Todos" ? templates : templates.filter((t) => t.category === category)),
    [templates, category],
  );

  const selected = templates.find((t) => t.id === templateId);

  function chooseTemplate(template: TemplateDefinition) {
    if (template.minPlanLevel > planLevel) return;
    setTemplateId(template.id);
    setPrimaryColor(template.primaryColor);
    setSecondaryColor(template.secondaryColor);
    setFontFamily(template.fontFamily);
    setStep(2);
  }

  async function handleCreate() {
    if (name.trim().length < 2) {
      setError("Dê um nome ao seu site.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, templateId, primaryColor, secondaryColor, fontFamily }),
      });
      const data = (await res.json()) as { error?: string; site?: { id: string } };
      if (!res.ok || !data.site) {
        setError(data.error ?? "Não foi possível criar o site.");
        setLoading(false);
        return;
      }
      router.push(`/editor/${data.site.id}`);
    } catch {
      setError("Falha de conexão.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {/* Steps */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: "Template" },
          { n: 2, label: "Identidade" },
        ].map((item) => (
          <button
            key={item.n}
            type="button"
            onClick={() => setStep(item.n)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold transition",
              step === item.n
                ? "border-fusion-500/50 bg-fusion-500/12 text-white"
                : "border-white/8 bg-white/[0.02] text-slate-400 hover:text-white",
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                step === item.n ? "bg-fusion-500 text-white" : "bg-white/10",
              )}
            >
              {item.n}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="kf-card p-6 kf-fade-up">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-white">Escolha um template</h2>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[11px] font-semibold transition",
                    category === item ? "bg-fusion-500 text-white" : "bg-white/5 text-slate-400 hover:text-white",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((template) => {
              const locked = template.minPlanLevel > planLevel;
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => chooseTemplate(template)}
                  disabled={locked}
                  className={cn(
                    "group overflow-hidden rounded-xl border text-left transition-all duration-200",
                    templateId === template.id
                      ? "border-neon-500/60 shadow-[0_0_0_1px_rgba(34,229,138,0.4)]"
                      : "border-white/8 hover:border-fusion-500/40",
                    locked && "cursor-not-allowed opacity-45",
                  )}
                >
                  <div className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${template.gradient}`}>
                    <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
                      {template.emoji}
                    </span>
                    {locked && (
                      <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                        🔒 {template.minPlanLevel === 3 ? "Premium" : "Intermediário"}
                      </span>
                    )}
                  </div>
                  <div className="bg-ink-800/70 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-white">{template.name}</p>
                      <span className="text-[10px] text-slate-500">{template.category}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
                      {template.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr] kf-fade-up">
          <div className="kf-card p-6">
            <h2 className="text-base font-bold text-white">Identidade do site</h2>
            <p className="mt-1 text-xs text-slate-500">
              Template selecionado: <strong className="text-white">{selected?.name}</strong>
            </p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="kf-label" htmlFor="site-name">Nome do site</label>
                <input
                  id="site-name"
                  className="kf-input"
                  placeholder="Ex.: Studio Nova Arquitetura"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {name && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    URL: kartfusion.com/site/<span className="text-neon-400">{slugify(name) || "meu-site"}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="kf-label" htmlFor="site-desc">Descrição</label>
                <textarea
                  id="site-desc"
                  className="kf-input min-h-[90px] resize-y"
                  placeholder="Uma frase que resume o que sua empresa faz."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <span className="kf-label">Paletas sugeridas</span>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium transition",
                        primaryColor === preset.primary
                          ? "border-fusion-500/60 bg-fusion-500/10 text-white"
                          : "border-white/8 bg-white/[0.02] text-slate-400 hover:text-white",
                      )}
                    >
                      <span className="flex">
                        <span className="h-4 w-4 rounded-l" style={{ background: preset.primary }} />
                        <span className="h-4 w-4 rounded-r" style={{ background: preset.secondary }} />
                      </span>
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="kf-label" htmlFor="c1">Cor principal</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="c1"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                    />
                    <input className="kf-input" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="kf-label" htmlFor="c2">Cor secundária</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="c2"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                    />
                    <input className="kf-input" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="kf-label" htmlFor="font">Fonte</label>
                  <select id="font" className="kf-input" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                    {FONTS.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setStep(1)} className="kf-btn kf-btn-ghost">
                  ← Trocar template
                </button>
                <button type="button" onClick={handleCreate} disabled={loading} className="kf-btn kf-btn-success flex-1">
                  {loading ? "Gerando estrutura..." : "🚀 Criar site e abrir editor"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="kf-card overflow-hidden p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Pré-visualização</p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/8">
              <div className="flex items-center gap-1.5 bg-ink-800 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-rose-500/60" />
                <span className="h-2 w-2 rounded-full bg-amber-400/60" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/60" />
              </div>
              <div
                className="p-6 text-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  fontFamily: `${fontFamily}, sans-serif`,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
                  {selected?.category}
                </p>
                <p className="mt-2 text-xl font-extrabold">{name || "Nome do seu site"}</p>
                <p className="mt-2 text-xs opacity-85">{description || selected?.description}</p>
                <span className="mt-4 inline-block rounded-lg bg-white/20 px-4 py-2 text-[11px] font-semibold backdrop-blur">
                  Começar agora
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 bg-white p-4">
                {["⚡", "🎯", "🛡"].map((icon) => (
                  <div key={icon} className="rounded-lg border border-slate-200 p-2.5 text-center">
                    <div className="text-sm">{icon}</div>
                    <div className="mx-auto mt-2 h-1 w-8 rounded" style={{ background: primaryColor }} />
                    <div className="mx-auto mt-1 h-1 w-12 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-white/6 bg-white/[0.02] p-4">
              <p className="text-xs font-semibold text-white">O que será gerado</p>
              <ul className="mt-2 grid gap-1.5 text-[11px] text-slate-400">
                <li>✓ Estrutura completa de páginas do template</li>
                <li>✓ Blocos prontos com conteúdo de exemplo</li>
                <li>✓ Configurações de SEO iniciais</li>
                <li>✓ Primeira revisão salva no histórico</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
