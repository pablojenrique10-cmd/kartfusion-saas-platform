import Link from "next/link";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg,#2f7bff 0%,#1d5fe0 45%,#22e58a 100%)",
        boxShadow: "0 10px 28px -12px rgba(47,123,255,0.9)",
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M5 3v18M5 12l9-9M5 12l9 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="18.5" cy="12" r="2.6" fill="#04240f" stroke="white" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

export default function Logo({ href = "/", size = 36 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <LogoMark size={size} />
      <span className="text-[1.05rem] font-extrabold tracking-tight text-white">
        Kart<span className="text-neon-500">Fusion</span>
      </span>
    </Link>
  );
}
