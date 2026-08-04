import type { CSSProperties } from "react";
import type { BlockItem, EditorSection, SectionStyles } from "@/lib/blocks";
import LeadForm from "@/components/site/LeadForm";

export interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface Props {
  section: EditorSection;
  theme: SiteTheme;
  siteId?: string;
  interactive?: boolean;
}

const SHADOWS: Record<string, string> = {
  none: "none",
  soft: "0 10px 30px -12px rgba(15,23,42,0.18)",
  medium: "0 24px 60px -20px rgba(15,23,42,0.28)",
  strong: "0 40px 90px -30px rgba(15,23,42,0.45)",
};

function containerStyle(styles: SectionStyles, theme: SiteTheme): CSSProperties {
  const bgMode = styles.bgMode ?? "solid";
  const css: CSSProperties = {
    paddingTop: styles.paddingY ?? 80,
    paddingBottom: styles.paddingY ?? 80,
    paddingLeft: styles.paddingX ?? 24,
    paddingRight: styles.paddingX ?? 24,
    color: styles.textColor ?? "#0b1220",
    fontFamily: `${styles.fontFamily ?? theme.fontFamily}, ui-sans-serif, system-ui, sans-serif`,
    textAlign: styles.align ?? "center",
    position: "relative",
    overflow: "hidden",
  };

  if (bgMode === "gradient") {
    css.background = `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`;
  } else if (bgMode === "transparent") {
    css.background = "transparent";
  } else if (bgMode !== "image") {
    css.background = styles.bgColor ?? "#ffffff";
  } else {
    css.background = styles.bgColor ?? "#0b1220";
  }

  return css;
}

function innerStyle(styles: SectionStyles): CSSProperties {
  return {
    maxWidth: styles.maxWidth ?? 1160,
    margin: "0 auto",
    position: "relative",
    zIndex: 2,
    width: "100%",
  };
}

function gridCols(count: number | undefined, fallback = 3): string {
  const columns = count ?? fallback;
  if (columns <= 1) return "repeat(1, minmax(0, 1fr))";
  if (columns === 2) return "repeat(auto-fit, minmax(260px, 1fr))";
  if (columns === 4) return "repeat(auto-fit, minmax(200px, 1fr))";
  return "repeat(auto-fit, minmax(240px, 1fr))";
}

export default function SectionRenderer({ section, theme, siteId, interactive = false }: Props) {
  const { content, styles, type } = section;
  const accent = styles.accentColor ?? theme.primaryColor;
  const buttonColor = styles.buttonColor ?? theme.primaryColor;
  const buttonTextColor = styles.buttonTextColor ?? "#ffffff";
  const radius = styles.radius ?? 18;
  const items: BlockItem[] = Array.isArray(content.items) ? content.items : [];
  const shadow = SHADOWS[styles.shadow ?? "soft"];

  const titleStyle: CSSProperties = {
    fontSize: styles.titleSize ?? 40,
    lineHeight: 1.15,
    letterSpacing: `${styles.letterSpacing ?? 0}px`,
    fontWeight: 800,
  };
  const bodyStyle: CSSProperties = {
    fontSize: styles.fontSize ?? 16,
    lineHeight: styles.lineHeight ?? 1.6,
    opacity: 0.85,
  };

  const button = (label?: string, link?: string, variant: "solid" | "ghost" = "solid") => {
    if (!label) return null;
    return (
      <a
        href={link || "#"}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5"
        style={
          variant === "solid"
            ? { background: buttonColor, color: buttonTextColor, borderRadius: radius, boxShadow: shadow }
            : {
                background: "transparent",
                color: styles.textColor ?? "#0b1220",
                borderRadius: radius,
                border: `1px solid ${styles.textColor ?? "#0b1220"}44`,
              }
        }
      >
        {label}
        {content.buttonIcon ? <span>{String(content.buttonIcon)}</span> : null}
      </a>
    );
  };

  const heading = (extraClass = "mb-10") => (
    <div className={extraClass}>
      {content.eyebrow ? (
        <span
          className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {content.eyebrow}
        </span>
      ) : null}
      {content.title ? (
        <h2 style={titleStyle} className="mb-3">
          {content.title}
        </h2>
      ) : null}
      {content.subtitle ? (
        <p style={{ ...bodyStyle, maxWidth: 720, margin: styles.align === "center" ? "0 auto" : undefined }}>
          {content.subtitle}
        </p>
      ) : null}
    </div>
  );

  const wrapperClass = "kf-section";

  /* ------------------------------- HEADER -------------------------------- */
  if (type === "header") {
    return (
      <header className={wrapperClass} style={{ ...containerStyle(styles, theme), textAlign: "left" }}>
        <div
          style={innerStyle(styles)}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <span className="text-lg font-extrabold tracking-tight">{content.logoText ?? "Logo"}</span>
          <nav className="flex flex-wrap items-center gap-6 text-sm font-medium opacity-90">
            {items.map((item) => (
              <a key={item.id} href={item.link || "#"} className="transition hover:opacity-60">
                {item.title}
              </a>
            ))}
          </nav>
          {button(content.buttonLabel, content.buttonLink)}
        </div>
      </header>
    );
  }

  /* ------------------------------- BANNER -------------------------------- */
  if (type === "banner") {
    const overlay = (content.overlay ?? 65) / 100;
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        {content.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={String(content.imageUrl)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ zIndex: 0 }}
          />
        ) : null}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: `linear-gradient(120deg, rgba(5,7,13,${overlay}), rgba(5,7,13,${Math.max(
              overlay - 0.25,
              0,
            )}))`,
          }}
        />
        <div style={innerStyle(styles)}>
          {heading("mb-8")}
          <div
            className="flex flex-wrap gap-3"
            style={{ justifyContent: styles.align === "center" ? "center" : styles.align === "right" ? "flex-end" : "flex-start" }}
          >
            {button(content.buttonLabel, content.buttonLink)}
            {button(content.secondaryLabel, content.secondaryLink, "ghost")}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------- TEXT --------------------------------- */
  if (type === "text") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading("mb-4")}
          {content.text ? (
            <p style={{ ...bodyStyle, maxWidth: 760, margin: styles.align === "center" ? "0 auto" : undefined }}>
              {content.text}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  /* ------------------------------- BUTTON -------------------------------- */
  if (type === "button") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>{button(content.buttonLabel, content.buttonLink)}</div>
      </section>
    );
  }

  /* -------------------------------- IMAGE -------------------------------- */
  if (type === "image") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {content.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={String(content.imageUrl)}
              alt={String(content.title ?? "")}
              className="w-full object-cover"
              style={{
                height: styles.imageHeight ?? 420,
                borderRadius: radius,
                boxShadow: shadow,
                border: styles.borderWidth
                  ? `${styles.borderWidth}px solid ${styles.borderColor ?? accent}`
                  : undefined,
              }}
            />
          ) : null}
          {content.title ? (
            <p className="mt-4 text-sm opacity-70" style={bodyStyle}>
              {content.title}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  /* ------------------------------- GALLERY ------------------------------- */
  if (type === "gallery") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="grid gap-5" style={{ gridTemplateColumns: gridCols(content.columns, 3) }}>
            {items.map((item) => (
              <figure
                key={item.id}
                className="group overflow-hidden transition-transform duration-300 hover:-translate-y-1"
                style={{ borderRadius: radius, boxShadow: shadow }}
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title ?? ""}
                    className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                {item.title ? (
                  <figcaption className="bg-black/80 px-4 py-3 text-sm font-medium text-white">
                    {item.title}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------- VIDEO -------------------------------- */
  if (type === "video") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div
            className="relative w-full overflow-hidden"
            style={{ paddingTop: "56.25%", borderRadius: radius, boxShadow: shadow }}
          >
            <iframe
              src={String(content.videoUrl ?? "")}
              title={String(content.title ?? "Vídeo")}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------- CARDS -------------------------------- */
  if (type === "cards") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="grid gap-5" style={{ gridTemplateColumns: gridCols(content.columns, 3) }}>
            {items.map((item) => (
              <article
                key={item.id}
                className="h-full bg-white p-7 text-left transition-transform duration-300 hover:-translate-y-1"
                style={{ borderRadius: radius, boxShadow: shadow, color: "#0b1220" }}
              >
                {item.icon ? (
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center text-xl"
                    style={{ background: `${accent}1a`, borderRadius: radius * 0.6 }}
                  >
                    {item.icon}
                  </div>
                ) : null}
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title ?? ""}
                    className="mb-4 h-40 w-full object-cover"
                    style={{ borderRadius: radius * 0.6 }}
                  />
                ) : null}
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed opacity-70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------- FAQ --------------------------------- */
  if (type === "faq") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={{ ...innerStyle(styles), maxWidth: 860 }}>
          {heading()}
          <div className="grid gap-3 text-left">
            {items.map((item) => (
              <details
                key={item.id}
                className="group bg-white/90 p-5 transition"
                style={{ borderRadius: radius, boxShadow: shadow, color: "#0b1220" }}
              >
                <summary className="cursor-pointer list-none text-base font-semibold marker:hidden">
                  <span className="mr-2" style={{ color: accent }}>
                    ▸
                  </span>
                  {item.title}
                </summary>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{item.text}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ----------------------------- TESTIMONIALS ---------------------------- */
  if (type === "testimonials") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="grid gap-5" style={{ gridTemplateColumns: gridCols(2, 2) }}>
            {items.map((item) => (
              <blockquote
                key={item.id}
                className="bg-white p-7 text-left"
                style={{ borderRadius: radius, boxShadow: shadow, color: "#0b1220" }}
              >
                <div className="mb-3 text-lg" style={{ color: accent }}>
                  ★★★★★
                </div>
                <p className="mb-5 text-base leading-relaxed opacity-80">“{item.text}”</p>
                <footer className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center text-sm font-bold text-white"
                    style={{ background: accent, borderRadius: 999 }}
                  >
                    {(item.author ?? "?").charAt(0)}
                  </span>
                  <span>
                    <strong className="block text-sm">{item.author}</strong>
                    <span className="text-xs opacity-60">{item.role}</span>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------ COUNTERS ------------------------------- */
  if (type === "counters") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading("mb-8")}
          <div className="grid gap-6" style={{ gridTemplateColumns: gridCols(items.length || 3, 3) }}>
            {items.map((item) => (
              <div key={item.id}>
                <div className="text-4xl font-extrabold" style={{ color: accent }}>
                  {item.value}
                  {item.suffix}
                </div>
                <p className="mt-1 text-sm uppercase tracking-widest opacity-70">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------- ICONS -------------------------------- */
  if (type === "icons") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="grid gap-5" style={{ gridTemplateColumns: gridCols(content.columns, 4) }}>
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-3">
                <span
                  className="flex h-14 w-14 items-center justify-center text-2xl"
                  style={{ background: `${accent}1f`, borderRadius: 999 }}
                >
                  {item.icon}
                </span>
                <strong className="text-sm font-semibold">{item.title}</strong>
                {item.text ? <p className="text-xs opacity-70">{item.text}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------- PRICING ------------------------------- */
  if (type === "pricing") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="grid gap-5" style={{ gridTemplateColumns: gridCols(items.length || 3, 3) }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex h-full flex-col bg-white p-7 text-left"
                style={{
                  borderRadius: radius,
                  boxShadow: shadow,
                  color: "#0b1220",
                  border: index === 1 ? `2px solid ${accent}` : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">{item.title}</h3>
                <div className="my-3 text-3xl font-extrabold" style={{ color: accent }}>
                  {item.price}
                </div>
                <p className="mb-6 flex-1 text-sm opacity-70">{item.text}</p>
                <a
                  href={item.link || "#contato"}
                  className="inline-flex justify-center px-5 py-3 text-sm font-semibold"
                  style={{ background: buttonColor, color: buttonTextColor, borderRadius: radius * 0.7 }}
                >
                  Contratar
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------- FORM -------------------------------- */
  if (type === "form") {
    return (
      <section id="contato" className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={{ ...innerStyle(styles), maxWidth: 760 }}>
          {heading()}
          <LeadForm
            siteId={siteId}
            interactive={interactive}
            buttonLabel={String(content.buttonLabel ?? "Enviar")}
            accent={buttonColor}
            buttonTextColor={buttonTextColor}
            radius={radius * 0.7}
          />
        </div>
      </section>
    );
  }

  /* ---------------------------------- MAP -------------------------------- */
  if (type === "map") {
    const query = encodeURIComponent(String(content.address ?? "Brasil"));
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading()}
          <div className="overflow-hidden" style={{ borderRadius: radius, boxShadow: shadow }}>
            <iframe
              title="Mapa"
              src={`https://maps.google.com/maps?q=${query}&output=embed`}
              className="h-[360px] w-full border-0"
              loading="lazy"
            />
          </div>
          {content.address ? <p className="mt-4 text-sm opacity-70">📍 {String(content.address)}</p> : null}
        </div>
      </section>
    );
  }

  /* -------------------------------- SOCIAL ------------------------------- */
  if (type === "social") {
    const whatsapp = String(content.whatsapp ?? "");
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading("mb-6")}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                style={{ background: `${accent}17`, color: styles.textColor ?? "#0b1220", borderRadius: 999 }}
              >
                <span>{item.icon}</span>
                {item.title}
              </a>
            ))}
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                style={{ background: "#25D366", borderRadius: 999 }}
              >
                💬 WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------------------------- CTA -------------------------------- */
  if (type === "cta") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {heading("mb-7")}
          <div className="flex flex-wrap justify-center gap-3">
            {button(content.buttonLabel, content.buttonLink)}
          </div>
        </div>
      </section>
    );
  }

  /* --------------------------------- LOGOS ------------------------------- */
  if (type === "logos") {
    return (
      <section className={wrapperClass} style={containerStyle(styles, theme)}>
        <div style={innerStyle(styles)}>
          {content.title ? (
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.28em] opacity-50">
              {content.title}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {items.map((item) => (
              <span key={item.id} className="text-lg font-black tracking-tight opacity-40">
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------- FOOTER ------------------------------- */
  if (type === "footer") {
    return (
      <footer className={wrapperClass} style={containerStyle(styles, theme)}>
        <div
          style={{ ...innerStyle(styles), display: "grid", gap: 32, gridTemplateColumns: gridCols(3, 3) }}
          className="text-left"
        >
          <div>
            <strong className="text-lg font-extrabold">{content.logoText ?? "Marca"}</strong>
            <p className="mt-2 text-sm opacity-60">{content.text}</p>
          </div>
          <div className="grid gap-2 text-sm">
            {items.map((item) => (
              <a key={item.id} href={item.link || "#"} className="opacity-70 transition hover:opacity-100">
                {item.title}
              </a>
            ))}
          </div>
          <div className="grid gap-1 text-sm opacity-70">
            {content.email ? <span>✉ {String(content.email)}</span> : null}
            {content.phone ? <span>☎ {String(content.phone)}</span> : null}
            {content.address ? <span>📍 {String(content.address)}</span> : null}
          </div>
        </div>
        <div
          style={innerStyle(styles)}
          className="mt-8 border-t border-white/10 pt-5 text-center text-xs opacity-50"
        >
          © {new Date().getFullYear()} {content.logoText ?? "Marca"} · Feito com KartFusion
        </div>
      </footer>
    );
  }

  return null;
}
