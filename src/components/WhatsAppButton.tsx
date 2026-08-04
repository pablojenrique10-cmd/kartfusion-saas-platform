"use client";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5543996317934?text=Olá,%20vim%20pelo%20KartFusion%20e%20quero%20saber%20mais."
      target="_blank"
      rel="noopener noreferrer"
      className="
      fixed
      bottom-6
      right-6
      z-50
      flex
      h-14
      w-14
      items-center
      justify-center
      rounded-full
      bg-green-500
      text-3xl
      shadow-xl
      transition
      hover:scale-110
      hover:bg-green-400
      "
    >
      💬
    </a>
  );
}