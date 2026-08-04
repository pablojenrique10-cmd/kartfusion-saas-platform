"use client";

import { useState } from "react";
import MediaLibrary from "@/components/dashboard/MediaLibrary";
import { uid, type BlockItem, type EditorSection, type SectionContent, type SectionStyles } from "@/lib/blocks";
import { cn } from "@/lib/utils";

const FONTS = ["Inter", "Poppins", "Sora", "Montserrat", "Playfair Display", "Merriweather", "Oswald"];

interface Props {
  section: EditorSection | null;
  storageMb: number;
  onChangeContent: (patch: SectionContent) => void;
  onChangeStyles: (patch: SectionStyles) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="kf-label">{label}</span>
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-white/10 bg-transparent"
        />
        <input className="kf-input py-2 text-xs" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "px",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="kf-label mb-0">{label}</span>
        <span className="text-[11px] font-semibold text-slate-300">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#2f7bff]"
      />
    </div>
  );
}

export default function Inspector({
  section,
  storageMb,
  onChangeContent,
  onChangeStyles,
  onDuplicate,
  onDelete,
  onToggleVisible,
}: Props) {
  const [tab, setTab] = useState<"content" | "style" | "items">("content");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<string | null>(null);

  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="text-3xl">🎛️</span>
        <p className="mt-3 text-sm font-semibold text-white">Nenhum bloco selecionado</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          Clique em um bloco no canvas para editar textos, cores, espaçamentos e imagens.
        </p>
      </div>
    );
  }

  const content = section.content;
  const styles = section.styles;
  const items: BlockItem[] = Array.isArray(content.items) ? content.items : [];

  const setItems = (next: BlockItem[]) => onChangeContent({ items: next });
  const updateItem = (id: string, patch: Partial<BlockItem>) =>
    setItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const hasItems = [
    "cards",
    "gallery",
    "faq",
    "testimonials",
    "counters",
    "icons",
    "pricing",
    "social",
    "header",
    "footer",
    "logos",
  ].includes(section.type);

  function openMedia(target: string) {
    setMediaTarget(target);
    setMediaOpen(true);
  }

  function pickMedia(url: string) {
    if (!mediaTarget) return;
    if (mediaTarget === "section") onChangeContent({ imageUrl: url });
    else updateItem(mediaTarget, { imageUrl: url });
    setMediaOpen(false);
    setMediaTarget(null);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Head */}
      <div className="border-b border-white/6 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{section.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">{section.type}</p>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onToggleVisible}
              title={section.visible ? "Ocultar bloco" : "Mostrar bloco"}
              className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
            >
              {section.visible ? "👁" : "🚫"}
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              title="Duplicar"
              className="rounded-lg bg-white/5 px-2 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
            >
              ⧉
            </button>
            <button
              type="button"
              onClick={onDelete}
              title="Excluir"
              className="rounded-lg bg-rose-500/15 px-2 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/25"
            >
              🗑
            </button>
          </div>
        </div>

        <div className="mt-3 flex gap-1 rounded-lg bg-white/4 p-1">
          {([
            { id: "content", label: "Conteúdo" },
            { id: "style", label: "Estilo" },
            ...(hasItems ? [{ id: "items" as const, label: "Itens" }] : []),
          ] as { id: "content" | "style" | "items"; label: string }[]).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition",
                tab === item.id ? "bg-fusion-500 text-white" : "text-slate-400 hover:text-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "content" && (
          <div className="grid gap-4">
            {"logoText" in content || section.type === "header" || section.type === "footer" ? (
              <Field label="Logo / Marca">
                <input
                  className="kf-input py-2 text-xs"
                  value={String(content.logoText ?? "")}
                  onChange={(e) => onChangeContent({ logoText: e.target.value })}
                />
              </Field>
            ) : null}

            <Field label="Eyebrow (texto pequeno)">
              <input
                className="kf-input py-2 text-xs"
                placeholder="Ex.: Bem-vindo"
                value={String(content.eyebrow ?? "")}
                onChange={(e) => onChangeContent({ eyebrow: e.target.value })}
              />
            </Field>

            <Field label="Título">
              <textarea
                className="kf-input min-h-[64px] resize-y py-2 text-xs"
                value={String(content.title ?? "")}
                onChange={(e) => onChangeContent({ title: e.target.value })}
              />
            </Field>

            <Field label="Subtítulo">
              <textarea
                className="kf-input min-h-[64px] resize-y py-2 text-xs"
                value={String(content.subtitle ?? "")}
                onChange={(e) => onChangeContent({ subtitle: e.target.value })}
              />
            </Field>

            {section.type === "text" && (
              <Field label="Parágrafo">
                <textarea
                  className="kf-input min-h-[130px] resize-y py-2 text-xs"
                  value={String(content.text ?? "")}
                  onChange={(e) => onChangeContent({ text: e.target.value })}
                />
              </Field>
            )}

            {["banner", "image", "gallery"].includes(section.type) && (
              <>
                <Field label="Imagem (URL)">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.imageUrl ?? "")}
                    onChange={(e) => onChangeContent({ imageUrl: e.target.value })}
                  />
                </Field>
                <button type="button" onClick={() => openMedia("section")} className="kf-btn kf-btn-ghost py-2 text-xs">
                  🖼 Escolher da biblioteca
                </button>
              </>
            )}

            {section.type === "banner" && (
              <RangeField
                label="Escurecer imagem (overlay)"
                value={Number(content.overlay ?? 65)}
                min={0}
                max={95}
                suffix="%"
                onChange={(v) => onChangeContent({ overlay: v })}
              />
            )}

            {section.type === "video" && (
              <Field label="URL de incorporação (embed)">
                <input
                  className="kf-input py-2 text-xs"
                  placeholder="https://www.youtube.com/embed/..."
                  value={String(content.videoUrl ?? "")}
                  onChange={(e) => onChangeContent({ videoUrl: e.target.value })}
                />
              </Field>
            )}

            {section.type === "map" && (
              <Field label="Endereço">
                <input
                  className="kf-input py-2 text-xs"
                  value={String(content.address ?? "")}
                  onChange={(e) => onChangeContent({ address: e.target.value })}
                />
              </Field>
            )}

            {["banner", "button", "cta", "header", "form"].includes(section.type) && (
              <>
                <Field label="Texto do botão">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.buttonLabel ?? "")}
                    onChange={(e) => onChangeContent({ buttonLabel: e.target.value })}
                  />
                </Field>
                <Field label="Link do botão">
                  <input
                    className="kf-input py-2 text-xs"
                    placeholder="#contato ou https://..."
                    value={String(content.buttonLink ?? "")}
                    onChange={(e) => onChangeContent({ buttonLink: e.target.value })}
                  />
                </Field>
                <Field label="Ícone do botão">
                  <input
                    className="kf-input py-2 text-xs"
                    placeholder="→"
                    value={String(content.buttonIcon ?? "")}
                    onChange={(e) => onChangeContent({ buttonIcon: e.target.value })}
                  />
                </Field>
              </>
            )}

            {section.type === "banner" && (
              <>
                <Field label="Botão secundário">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.secondaryLabel ?? "")}
                    onChange={(e) => onChangeContent({ secondaryLabel: e.target.value })}
                  />
                </Field>
                <Field label="Link secundário">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.secondaryLink ?? "")}
                    onChange={(e) => onChangeContent({ secondaryLink: e.target.value })}
                  />
                </Field>
              </>
            )}

            {section.type === "social" && (
              <Field label="WhatsApp (somente números com DDI)">
                <input
                  className="kf-input py-2 text-xs"
                  placeholder="5511999999999"
                  value={String(content.whatsapp ?? "")}
                  onChange={(e) => onChangeContent({ whatsapp: e.target.value })}
                />
              </Field>
            )}

            {section.type === "footer" && (
              <>
                <Field label="Texto do rodapé">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.text ?? "")}
                    onChange={(e) => onChangeContent({ text: e.target.value })}
                  />
                </Field>
                <Field label="E-mail">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.email ?? "")}
                    onChange={(e) => onChangeContent({ email: e.target.value })}
                  />
                </Field>
                <Field label="Telefone">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.phone ?? "")}
                    onChange={(e) => onChangeContent({ phone: e.target.value })}
                  />
                </Field>
                <Field label="Endereço">
                  <input
                    className="kf-input py-2 text-xs"
                    value={String(content.address ?? "")}
                    onChange={(e) => onChangeContent({ address: e.target.value })}
                  />
                </Field>
              </>
            )}

            {["cards", "gallery", "icons"].includes(section.type) && (
              <RangeField
                label="Colunas"
                value={Number(content.columns ?? 3)}
                min={1}
                max={4}
                suffix=""
                onChange={(v) => onChangeContent({ columns: v })}
              />
            )}
          </div>
        )}

        {tab === "style" && (
          <div className="grid gap-4">
            <Field label="Alinhamento">
              <div className="flex gap-1 rounded-lg bg-white/4 p-1">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => onChangeStyles({ align })}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-[11px] font-semibold capitalize transition",
                      (styles.align ?? "center") === align
                        ? "bg-fusion-500 text-white"
                        : "text-slate-400 hover:text-white",
                    )}
                  >
                    {align === "left" ? "Esq." : align === "center" ? "Centro" : "Dir."}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Fundo">
              <div className="flex gap-1 rounded-lg bg-white/4 p-1">
                {(
                  [
                    { id: "solid", label: "Cor" },
                    { id: "gradient", label: "Gradiente" },
                    { id: "image", label: "Imagem" },
                    { id: "transparent", label: "Vazio" },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onChangeStyles({ bgMode: mode.id })}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-[10px] font-semibold transition",
                      (styles.bgMode ?? "solid") === mode.id
                        ? "bg-fusion-500 text-white"
                        : "text-slate-400 hover:text-white",
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </Field>

            <ColorField
              label="Cor de fundo"
              value={String(styles.bgColor ?? "#ffffff")}
              onChange={(v) => onChangeStyles({ bgColor: v })}
            />
            <ColorField
              label="Cor do texto"
              value={String(styles.textColor ?? "#0b1220")}
              onChange={(v) => onChangeStyles({ textColor: v })}
            />
            <ColorField
              label="Cor de destaque"
              value={String(styles.accentColor ?? "#2f7bff")}
              onChange={(v) => onChangeStyles({ accentColor: v })}
            />
            <ColorField
              label="Cor do botão"
              value={String(styles.buttonColor ?? "#2f7bff")}
              onChange={(v) => onChangeStyles({ buttonColor: v })}
            />
            <ColorField
              label="Texto do botão"
              value={String(styles.buttonTextColor ?? "#ffffff")}
              onChange={(v) => onChangeStyles({ buttonTextColor: v })}
            />

            <Field label="Fonte">
              <select
                className="kf-input py-2 text-xs"
                value={String(styles.fontFamily ?? "")}
                onChange={(e) => onChangeStyles({ fontFamily: e.target.value })}
              >
                <option value="">Usar fonte do site</option>
                {FONTS.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </Field>

            <RangeField label="Tamanho do título" value={Number(styles.titleSize ?? 40)} min={18} max={84} onChange={(v) => onChangeStyles({ titleSize: v })} />
            <RangeField label="Tamanho do texto" value={Number(styles.fontSize ?? 16)} min={11} max={28} onChange={(v) => onChangeStyles({ fontSize: v })} />
            <RangeField label="Altura da linha" value={Number(styles.lineHeight ?? 1.6)} min={1} max={2.4} step={0.05} suffix="" onChange={(v) => onChangeStyles({ lineHeight: v })} />
            <RangeField label="Espaçamento entre letras" value={Number(styles.letterSpacing ?? 0)} min={-2} max={8} step={0.5} onChange={(v) => onChangeStyles({ letterSpacing: v })} />
            <RangeField label="Espaçamento vertical" value={Number(styles.paddingY ?? 80)} min={0} max={220} step={4} onChange={(v) => onChangeStyles({ paddingY: v })} />
            <RangeField label="Espaçamento lateral" value={Number(styles.paddingX ?? 24)} min={0} max={120} step={4} onChange={(v) => onChangeStyles({ paddingX: v })} />
            <RangeField label="Raio das bordas" value={Number(styles.radius ?? 18)} min={0} max={48} onChange={(v) => onChangeStyles({ radius: v })} />
            <RangeField label="Largura máxima" value={Number(styles.maxWidth ?? 1160)} min={640} max={1600} step={20} onChange={(v) => onChangeStyles({ maxWidth: v })} />

            {section.type === "image" && (
              <>
                <RangeField label="Altura da imagem" value={Number(styles.imageHeight ?? 420)} min={140} max={800} step={10} onChange={(v) => onChangeStyles({ imageHeight: v })} />
                <RangeField label="Espessura da borda" value={Number(styles.borderWidth ?? 0)} min={0} max={12} onChange={(v) => onChangeStyles({ borderWidth: v })} />
                <ColorField label="Cor da borda" value={String(styles.borderColor ?? "#2f7bff")} onChange={(v) => onChangeStyles({ borderColor: v })} />
              </>
            )}

            <Field label="Sombra">
              <div className="flex gap-1 rounded-lg bg-white/4 p-1">
                {(["none", "soft", "medium", "strong"] as const).map((shadow) => (
                  <button
                    key={shadow}
                    type="button"
                    onClick={() => onChangeStyles({ shadow })}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-[10px] font-semibold capitalize transition",
                      (styles.shadow ?? "soft") === shadow ? "bg-fusion-500 text-white" : "text-slate-400 hover:text-white",
                    )}
                  >
                    {shadow === "none" ? "Sem" : shadow === "soft" ? "Suave" : shadow === "medium" ? "Média" : "Forte"}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {tab === "items" && (
          <div className="grid gap-3">
            {items.map((item, index) => (
              <div key={item.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Item {index + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (index === 0) return;
                        const next = [...items];
                        [next[index - 1], next[index]] = [next[index], next[index - 1]];
                        setItems(next);
                      }}
                      className="rounded bg-white/5 px-1.5 text-[11px] text-slate-300"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (index === items.length - 1) return;
                        const next = [...items];
                        [next[index + 1], next[index]] = [next[index], next[index + 1]];
                        setItems(next);
                      }}
                      className="rounded bg-white/5 px-1.5 text-[11px] text-slate-300"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
                      className="rounded bg-rose-500/15 px-1.5 text-[11px] text-rose-300"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <input
                    className="kf-input py-2 text-xs"
                    placeholder="Título"
                    value={item.title ?? ""}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                  />
                  {["cards", "faq", "testimonials", "icons", "pricing"].includes(section.type) && (
                    <textarea
                      className="kf-input min-h-[60px] resize-y py-2 text-xs"
                      placeholder="Descrição"
                      value={item.text ?? ""}
                      onChange={(e) => updateItem(item.id, { text: e.target.value })}
                    />
                  )}
                  {["cards", "icons", "social"].includes(section.type) && (
                    <input
                      className="kf-input py-2 text-xs"
                      placeholder="Ícone (emoji)"
                      value={item.icon ?? ""}
                      onChange={(e) => updateItem(item.id, { icon: e.target.value })}
                    />
                  )}
                  {["header", "footer", "social", "pricing"].includes(section.type) && (
                    <input
                      className="kf-input py-2 text-xs"
                      placeholder="Link"
                      value={item.link ?? ""}
                      onChange={(e) => updateItem(item.id, { link: e.target.value })}
                    />
                  )}
                  {section.type === "counters" && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="kf-input py-2 text-xs"
                        placeholder="Valor"
                        value={item.value ?? ""}
                        onChange={(e) => updateItem(item.id, { value: e.target.value })}
                      />
                      <input
                        className="kf-input py-2 text-xs"
                        placeholder="Sufixo (+, %)"
                        value={item.suffix ?? ""}
                        onChange={(e) => updateItem(item.id, { suffix: e.target.value })}
                      />
                    </div>
                  )}
                  {section.type === "pricing" && (
                    <input
                      className="kf-input py-2 text-xs"
                      placeholder="Preço (R$ 97)"
                      value={item.price ?? ""}
                      onChange={(e) => updateItem(item.id, { price: e.target.value })}
                    />
                  )}
                  {section.type === "testimonials" && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="kf-input py-2 text-xs"
                        placeholder="Autor"
                        value={item.author ?? ""}
                        onChange={(e) => updateItem(item.id, { author: e.target.value })}
                      />
                      <input
                        className="kf-input py-2 text-xs"
                        placeholder="Cargo"
                        value={item.role ?? ""}
                        onChange={(e) => updateItem(item.id, { role: e.target.value })}
                      />
                    </div>
                  )}
                  {["gallery", "cards"].includes(section.type) && (
                    <>
                      <input
                        className="kf-input py-2 text-xs"
                        placeholder="URL da imagem"
                        value={item.imageUrl ?? ""}
                        onChange={(e) => updateItem(item.id, { imageUrl: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => openMedia(item.id)}
                        className="kf-btn kf-btn-ghost py-1.5 text-[11px]"
                      >
                        🖼 Biblioteca
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setItems([...items, { id: uid("item"), title: "Novo item", text: "Descrição" }])}
              className="kf-btn kf-btn-ghost py-2 text-xs"
            >
              ＋ Adicionar item
            </button>
          </div>
        )}
      </div>

      {mediaOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-5 backdrop-blur">
          <div className="glass-strong max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Biblioteca de mídia</h3>
              <button type="button" onClick={() => setMediaOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <MediaLibrary storageMb={storageMb} compact onPick={pickMedia} />
          </div>
        </div>
      )}
    </div>
  );
}
