/**
 * KartFusion — Sistema de Blocos
 * Cada elemento do editor é um bloco independente e serializável.
 */

export type BlockType =
  | "header"
  | "banner"
  | "text"
  | "button"
  | "image"
  | "gallery"
  | "video"
  | "cards"
  | "faq"
  | "testimonials"
  | "counters"
  | "icons"
  | "pricing"
  | "form"
  | "map"
  | "social"
  | "cta"
  | "logos"
  | "footer";

export interface BlockItem {
  id: string;
  title?: string;
  text?: string;
  imageUrl?: string;
  icon?: string;
  link?: string;
  value?: string;
  suffix?: string;
  author?: string;
  role?: string;
  price?: string;
}

export interface SectionContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  buttonLabel?: string;
  buttonLink?: string;
  buttonIcon?: string;
  secondaryLabel?: string;
  secondaryLink?: string;
  imageUrl?: string;
  videoUrl?: string;
  overlay?: number;
  logoText?: string;
  address?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  columns?: number;
  items?: BlockItem[];
  [key: string]: unknown;
}

export interface SectionStyles {
  align?: "left" | "center" | "right";
  bgColor?: string;
  bgMode?: "solid" | "gradient" | "image" | "transparent";
  textColor?: string;
  accentColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  fontFamily?: string;
  fontSize?: number;
  titleSize?: number;
  letterSpacing?: number;
  lineHeight?: number;
  paddingY?: number;
  paddingX?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: "none" | "soft" | "medium" | "strong";
  maxWidth?: number;
  imageHeight?: number;
  [key: string]: unknown;
}

export interface EditorSection {
  id: string;
  type: BlockType;
  name: string;
  position: number;
  visible: boolean;
  content: SectionContent;
  styles: SectionStyles;
}

export interface EditorPage {
  id: string;
  name: string;
  path: string;
  isHome: boolean;
  position: number;
  seo: Record<string, unknown>;
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  group: "Estrutura" | "Conteúdo" | "Mídia" | "Conversão" | "Social";
  minPlanLevel: 1 | 2 | 3;
  description: string;
}

export const BLOCK_LIBRARY: BlockDefinition[] = [
  { type: "header", label: "Cabeçalho", icon: "▤", group: "Estrutura", minPlanLevel: 1, description: "Menu de navegação fixo com logo e CTA." },
  { type: "banner", label: "Banner", icon: "🖼", group: "Estrutura", minPlanLevel: 1, description: "Hero de destaque com imagem, overlay e botões." },
  { type: "text", label: "Texto", icon: "T", group: "Conteúdo", minPlanLevel: 1, description: "Bloco de título e parágrafo com tipografia editável." },
  { type: "button", label: "Botão", icon: "⬢", group: "Conversão", minPlanLevel: 1, description: "Chamada para ação com link e ícone." },
  { type: "image", label: "Imagem", icon: "🌄", group: "Mídia", minPlanLevel: 1, description: "Imagem única com borda, raio e legenda." },
  { type: "form", label: "Formulário", icon: "✉", group: "Conversão", minPlanLevel: 1, description: "Captação de leads com nome, email e mensagem." },
  { type: "footer", label: "Rodapé", icon: "▂", group: "Estrutura", minPlanLevel: 1, description: "Rodapé com contatos, links e direitos autorais." },
  { type: "cards", label: "Cards", icon: "▦", group: "Conteúdo", minPlanLevel: 2, description: "Grade de serviços, produtos ou diferenciais." },
  { type: "gallery", label: "Galeria", icon: "❖", group: "Mídia", minPlanLevel: 2, description: "Mosaico de imagens responsivo." },
  { type: "faq", label: "FAQ", icon: "?", group: "Conteúdo", minPlanLevel: 2, description: "Perguntas frequentes em acordeão." },
  { type: "testimonials", label: "Depoimentos", icon: "★", group: "Social", minPlanLevel: 2, description: "Provas sociais dos seus clientes." },
  { type: "social", label: "Redes sociais", icon: "◎", group: "Social", minPlanLevel: 2, description: "Ícones das suas redes + WhatsApp." },
  { type: "counters", label: "Contadores", icon: "#", group: "Conteúdo", minPlanLevel: 2, description: "Números e métricas de impacto." },
  { type: "cta", label: "Chamada final", icon: "➤", group: "Conversão", minPlanLevel: 2, description: "Faixa de conversão com destaque." },
  { type: "video", label: "Vídeo", icon: "▶", group: "Mídia", minPlanLevel: 3, description: "Player incorporado do YouTube/Vimeo." },
  { type: "icons", label: "Ícones", icon: "✦", group: "Conteúdo", minPlanLevel: 3, description: "Lista de benefícios com ícones." },
  { type: "pricing", label: "Planos", icon: "💳", group: "Conversão", minPlanLevel: 3, description: "Tabela de preços pronta para e-commerce." },
  { type: "map", label: "Mapa", icon: "📍", group: "Conteúdo", minPlanLevel: 3, description: "Mapa incorporado do endereço." },
  { type: "logos", label: "Parceiros", icon: "◇", group: "Social", minPlanLevel: 3, description: "Faixa de logos e parceiros." },
];

export const BLOCK_MAP: Record<BlockType, BlockDefinition> = BLOCK_LIBRARY.reduce(
  (acc, block) => {
    acc[block.type] = block;
    return acc;
  },
  {} as Record<BlockType, BlockDefinition>,
);

export function uid(prefix = "blk"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

const IMG = {
  hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  product: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  food: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
};

export function defaultContent(type: BlockType): SectionContent {
  switch (type) {
    case "header":
      return {
        logoText: "Minha Marca",
        buttonLabel: "Fale conosco",
        buttonLink: "#contato",
        items: [
          { id: uid("nav"), title: "Início", link: "#inicio" },
          { id: uid("nav"), title: "Serviços", link: "#servicos" },
          { id: uid("nav"), title: "Sobre", link: "#sobre" },
          { id: uid("nav"), title: "Contato", link: "#contato" },
        ],
      };
    case "banner":
      return {
        eyebrow: "Bem-vindo",
        title: "Seu novo site profissional começa aqui",
        subtitle:
          "Crie uma presença digital moderna, rápida e otimizada para converter visitantes em clientes.",
        buttonLabel: "Começar agora",
        buttonLink: "#contato",
        secondaryLabel: "Saiba mais",
        secondaryLink: "#servicos",
        imageUrl: IMG.hero,
        overlay: 65,
      };
    case "text":
      return {
        eyebrow: "Sobre nós",
        title: "Uma equipe pronta para o seu desafio",
        text: "Escreva aqui a história da sua empresa, o seu diferencial e por que os clientes devem confiar no seu trabalho. Use este espaço para transmitir autoridade.",
      };
    case "button":
      return { buttonLabel: "Quero um orçamento", buttonLink: "#contato", buttonIcon: "→" };
    case "image":
      return { imageUrl: IMG.team, title: "Legenda da imagem" };
    case "gallery":
      return {
        title: "Nossa galeria",
        columns: 3,
        items: [
          { id: uid("img"), imageUrl: IMG.product, title: "Projeto 01" },
          { id: uid("img"), imageUrl: IMG.team, title: "Projeto 02" },
          { id: uid("img"), imageUrl: IMG.food, title: "Projeto 03" },
        ],
      };
    case "video":
      return {
        title: "Assista nossa apresentação",
        videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
      };
    case "cards":
      return {
        eyebrow: "O que fazemos",
        title: "Nossos serviços",
        columns: 3,
        items: [
          { id: uid("card"), icon: "⚡", title: "Alta performance", text: "Sites rápidos com carregamento otimizado em qualquer dispositivo." },
          { id: uid("card"), icon: "🎯", title: "Foco em resultado", text: "Estrutura pensada para gerar contatos e vendas todos os dias." },
          { id: uid("card"), icon: "🛡", title: "Segurança total", text: "Infraestrutura confiável, backups e certificado SSL incluso." },
        ],
      };
    case "faq":
      return {
        title: "Perguntas frequentes",
        items: [
          { id: uid("faq"), title: "Quanto tempo leva para publicar?", text: "Você pode publicar o seu site em poucos minutos direto pelo editor." },
          { id: uid("faq"), title: "Posso usar meu domínio?", text: "Sim, o plano Premium permite conectar domínio personalizado." },
          { id: uid("faq"), title: "Preciso saber programar?", text: "Não. Tudo é feito visualmente com arrastar e soltar." },
        ],
      };
    case "testimonials":
      return {
        title: "O que dizem sobre nós",
        items: [
          { id: uid("dep"), text: "Resultado impecável. Nosso site ficou moderno e começou a gerar contatos na primeira semana.", author: "Marina Alves", role: "CEO, Studio Nova" },
          { id: uid("dep"), text: "Processo simples e atendimento excelente. Recomendo para qualquer negócio.", author: "Rafael Souza", role: "Diretor, RS Log" },
        ],
      };
    case "counters":
      return {
        title: "Nossos números",
        items: [
          { id: uid("num"), value: "1200", suffix: "+", title: "Clientes atendidos" },
          { id: uid("num"), value: "98", suffix: "%", title: "Satisfação" },
          { id: uid("num"), value: "15", suffix: " anos", title: "De mercado" },
        ],
      };
    case "icons":
      return {
        title: "Por que escolher a gente",
        columns: 4,
        items: [
          { id: uid("ico"), icon: "🚀", title: "Entrega rápida" },
          { id: uid("ico"), icon: "💎", title: "Design premium" },
          { id: uid("ico"), icon: "🤝", title: "Suporte humano" },
          { id: uid("ico"), icon: "📈", title: "Foco em vendas" },
        ],
      };
    case "pricing":
      return {
        title: "Escolha seu plano",
        items: [
          { id: uid("pl"), title: "Essencial", price: "R$ 97", text: "Site institucional, 5 páginas, SEO básico." },
          { id: uid("pl"), title: "Profissional", price: "R$ 197", text: "Blog, galeria, depoimentos e estatísticas." },
          { id: uid("pl"), title: "Premium", price: "R$ 397", text: "Tudo liberado, domínio próprio e integrações." },
        ],
      };
    case "form":
      return {
        title: "Fale com a gente",
        subtitle: "Preencha o formulário e retornaremos em até 24 horas.",
        buttonLabel: "Enviar mensagem",
      };
    case "map":
      return {
        title: "Onde estamos",
        address: "Av. Paulista, 1000 - São Paulo, SP",
      };
    case "social":
      return {
        title: "Siga nas redes",
        whatsapp: "5511999999999",
        items: [
          { id: uid("soc"), icon: "📸", title: "Instagram", link: "https://instagram.com" },
          { id: uid("soc"), icon: "📘", title: "Facebook", link: "https://facebook.com" },
          { id: uid("soc"), icon: "💼", title: "LinkedIn", link: "https://linkedin.com" },
        ],
      };
    case "cta":
      return {
        title: "Pronto para começar?",
        subtitle: "Fale com nosso time e receba uma proposta ainda hoje.",
        buttonLabel: "Solicitar orçamento",
        buttonLink: "#contato",
      };
    case "logos":
      return {
        title: "Parceiros que confiam",
        items: [
          { id: uid("lg"), title: "NORTHWIND" },
          { id: uid("lg"), title: "ACME CO" },
          { id: uid("lg"), title: "LUMEN" },
          { id: uid("lg"), title: "VERTEX" },
        ],
      };
    case "footer":
      return {
        logoText: "Minha Marca",
        text: "Todos os direitos reservados.",
        email: "contato@minhamarca.com.br",
        phone: "(11) 99999-9999",
        address: "São Paulo, SP",
        items: [
          { id: uid("fl"), title: "Início", link: "#inicio" },
          { id: uid("fl"), title: "Serviços", link: "#servicos" },
          { id: uid("fl"), title: "Contato", link: "#contato" },
        ],
      };
    default:
      return {};
  }
}

export function defaultStyles(type: BlockType): SectionStyles {
  const base: SectionStyles = {
    align: "center",
    bgMode: "solid",
    bgColor: "#ffffff",
    textColor: "#0b1220",
    paddingY: 80,
    paddingX: 24,
    radius: 18,
    fontSize: 16,
    titleSize: 40,
    lineHeight: 1.6,
    letterSpacing: 0,
    shadow: "soft",
    maxWidth: 1160,
  };

  switch (type) {
    case "header":
      return { ...base, paddingY: 18, bgColor: "#0b1220", textColor: "#ffffff", align: "left", shadow: "none" };
    case "banner":
      return { ...base, bgMode: "image", paddingY: 140, textColor: "#ffffff", titleSize: 56 };
    case "text":
      return { ...base, align: "left", paddingY: 72 };
    case "button":
      return { ...base, paddingY: 40, bgColor: "#f5f7fb" };
    case "image":
      return { ...base, paddingY: 48, imageHeight: 420 };
    case "cards":
    case "gallery":
    case "icons":
    case "pricing":
      return { ...base, bgColor: "#f5f7fb", paddingY: 88 };
    case "counters":
      return { ...base, bgColor: "#0b1220", textColor: "#ffffff", paddingY: 72 };
    case "cta":
      return { ...base, bgMode: "gradient", textColor: "#ffffff", paddingY: 90 };
    case "footer":
      return { ...base, bgColor: "#0b1220", textColor: "#ffffff", paddingY: 56, align: "left", shadow: "none" };
    case "logos":
      return { ...base, paddingY: 48, bgColor: "#ffffff" };
    default:
      return base;
  }
}

export function createSection(type: BlockType, position: number): EditorSection {
  return {
    id: uid("sec"),
    type,
    name: BLOCK_MAP[type]?.label ?? type,
    position,
    visible: true,
    content: defaultContent(type),
    styles: defaultStyles(type),
  };
}
