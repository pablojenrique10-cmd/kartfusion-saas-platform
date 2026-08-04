import {
  createSection,
  defaultContent,
  defaultStyles,
  uid,
  type BlockType,
  type EditorPage,
  type EditorSection,
  type SectionContent,
  type SectionStyles,
} from "@/lib/blocks";

export interface BlueprintSection {
  type: BlockType;
  content?: SectionContent;
  styles?: SectionStyles;
}

export interface BlueprintPage {
  name: string;
  path: string;
  isHome?: boolean;
  sections: BlueprintSection[];
}

export interface TemplateBlueprint {
  pages: BlueprintPage[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
  gradient: string;
  minPlanLevel: 1 | 2 | 3;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  featured: boolean;
  blueprint: TemplateBlueprint;
}

const s = (type: BlockType, content?: SectionContent, styles?: SectionStyles): BlueprintSection => ({
  type,
  content,
  styles,
});

const IMAGES = {
  corp: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  shop: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  portfolio: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80",
  restaurant: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  landing: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  barber: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80",
  clinic: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80",
  gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  law: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
  realestate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
  creator: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?auto=format&fit=crop&w=1600&q=80",
};

function institutionalPages(brand: string): BlueprintPage[] {
  return [
    {
      name: "Sobre",
      path: "/sobre",
      sections: [
        s("header", { logoText: brand }),
        s("text", { eyebrow: "Nossa história", title: `Conheça a ${brand}` }),
        s("counters"),
        s("footer", { logoText: brand }),
      ],
    },
    {
      name: "Contato",
      path: "/contato",
      sections: [
        s("header", { logoText: brand }),
        s("form", { title: "Fale conosco", subtitle: "Responderemos em até 24 horas úteis." }),
        s("footer", { logoText: brand }),
      ],
    },
  ];
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: "empresa",
    name: "Empresa",
    category: "Institucional",
    description: "Site institucional completo com serviços, números e formulário de contato.",
    emoji: "🏢",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    minPlanLevel: 1,
    primaryColor: "#2f7bff",
    secondaryColor: "#22e58a",
    fontFamily: "Inter",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Nexus Corp" }),
            s("banner", {
              eyebrow: "Soluções corporativas",
              title: "Tecnologia que impulsiona o seu negócio",
              subtitle: "Consultoria, software e infraestrutura para empresas que querem crescer com segurança.",
              imageUrl: IMAGES.corp,
              buttonLabel: "Solicitar proposta",
            }),
            s("cards", { title: "Nossos serviços" }),
            s("counters"),
            s("testimonials"),
            s("faq"),
            s("cta"),
            s("form"),
            s("footer", { logoText: "Nexus Corp" }),
          ],
        },
        ...institutionalPages("Nexus Corp"),
      ],
    },
  },
  {
    id: "loja-virtual",
    name: "Loja Virtual",
    category: "E-commerce",
    description: "Vitrine de produtos com destaque de ofertas, prova social e checkout externo.",
    emoji: "🛍️",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    minPlanLevel: 2,
    primaryColor: "#10b981",
    secondaryColor: "#2f7bff",
    fontFamily: "Poppins",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Studio Store" }),
            s("banner", {
              eyebrow: "Coleção 2026",
              title: "Produtos selecionados para você",
              subtitle: "Frete grátis acima de R$ 199 e parcelamento em até 12x sem juros.",
              imageUrl: IMAGES.shop,
              buttonLabel: "Ver produtos",
            }),
            s("gallery", { title: "Mais vendidos" }),
            s("pricing", { title: "Kits promocionais" }),
            s("icons", { title: "Compre com confiança" }),
            s("testimonials"),
            s("cta", { title: "Aproveite 10% OFF na primeira compra" }),
            s("footer", { logoText: "Studio Store" }),
          ],
        },
        ...institutionalPages("Studio Store"),
      ],
    },
  },
  {
    id: "portfolio",
    name: "Portfólio",
    category: "Criativo",
    description: "Vitrine minimalista para designers, fotógrafos e estúdios criativos.",
    emoji: "🎨",
    gradient: "from-fuchsia-600 via-purple-600 to-indigo-600",
    minPlanLevel: 1,
    primaryColor: "#a855f7",
    secondaryColor: "#22e58a",
    fontFamily: "Sora",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Ana Ribeiro" }),
            s("banner", {
              eyebrow: "Designer & Diretora de arte",
              title: "Identidades visuais que marcam",
              subtitle: "Portfólio de projetos de branding, web e direção criativa.",
              imageUrl: IMAGES.portfolio,
              buttonLabel: "Ver projetos",
            }),
            s("gallery", { title: "Projetos selecionados" }),
            s("text", { eyebrow: "Sobre", title: "Design com propósito" }),
            s("logos"),
            s("cta", { title: "Vamos criar algo juntos?" }),
            s("footer", { logoText: "Ana Ribeiro" }),
          ],
        },
        ...institutionalPages("Ana Ribeiro"),
      ],
    },
  },
  {
    id: "restaurante",
    name: "Restaurante",
    category: "Alimentação",
    description: "Cardápio, ambiente, reservas e integração com WhatsApp para delivery.",
    emoji: "🍽️",
    gradient: "from-amber-500 via-orange-600 to-red-500",
    minPlanLevel: 2,
    primaryColor: "#f97316",
    secondaryColor: "#22e58a",
    fontFamily: "Playfair Display",
    featured: false,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Cantina Bella" }),
            s("banner", {
              eyebrow: "Cozinha italiana",
              title: "Sabor artesanal em cada prato",
              subtitle: "Massas frescas, vinhos selecionados e ambiente acolhedor no coração da cidade.",
              imageUrl: IMAGES.restaurant,
              buttonLabel: "Reservar mesa",
            }),
            s("cards", { title: "Nosso cardápio" }),
            s("gallery", { title: "O ambiente" }),
            s("testimonials"),
            s("map"),
            s("social", { title: "Peça pelo WhatsApp" }),
            s("footer", { logoText: "Cantina Bella" }),
          ],
        },
        ...institutionalPages("Cantina Bella"),
      ],
    },
  },
  {
    id: "landing-page",
    name: "Landing Page",
    category: "Conversão",
    description: "Página única de alta conversão para campanhas e lançamentos.",
    emoji: "🚀",
    gradient: "from-sky-500 via-blue-600 to-violet-600",
    minPlanLevel: 1,
    primaryColor: "#2f7bff",
    secondaryColor: "#22e58a",
    fontFamily: "Inter",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("banner", {
              eyebrow: "Lançamento",
              title: "A oferta que vai transformar o seu negócio",
              subtitle: "Garanta condições exclusivas por tempo limitado.",
              imageUrl: IMAGES.landing,
              buttonLabel: "Quero garantir",
            }),
            s("icons"),
            s("counters"),
            s("testimonials"),
            s("pricing"),
            s("faq"),
            s("form"),
            s("footer"),
          ],
        },
      ],
    },
  },
  {
    id: "barbearia",
    name: "Barbearia",
    category: "Serviços",
    description: "Serviços, preços, equipe e agendamento direto no WhatsApp.",
    emoji: "💈",
    gradient: "from-zinc-700 via-slate-700 to-amber-600",
    minPlanLevel: 2,
    primaryColor: "#f59e0b",
    secondaryColor: "#2f7bff",
    fontFamily: "Oswald",
    featured: false,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Barber King" }),
            s("banner", {
              eyebrow: "Desde 2012",
              title: "Estilo clássico, atendimento premium",
              subtitle: "Cortes, barba e cuidados masculinos com hora marcada.",
              imageUrl: IMAGES.barber,
              buttonLabel: "Agendar horário",
            }),
            s("pricing", { title: "Tabela de serviços" }),
            s("gallery", { title: "Nossos cortes" }),
            s("testimonials"),
            s("social", { title: "Agende pelo WhatsApp" }),
            s("map"),
            s("footer", { logoText: "Barber King" }),
          ],
        },
        ...institutionalPages("Barber King"),
      ],
    },
  },
  {
    id: "clinica",
    name: "Clínica",
    category: "Saúde",
    description: "Especialidades, corpo clínico, convênios e agendamento online.",
    emoji: "🩺",
    gradient: "from-cyan-500 via-sky-500 to-blue-600",
    minPlanLevel: 2,
    primaryColor: "#0ea5e9",
    secondaryColor: "#22e58a",
    fontFamily: "Inter",
    featured: false,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Clínica Vitalis" }),
            s("banner", {
              eyebrow: "Cuidado humanizado",
              title: "Saúde com tecnologia e acolhimento",
              subtitle: "Equipe multidisciplinar, exames modernos e atendimento personalizado.",
              imageUrl: IMAGES.clinic,
              buttonLabel: "Agendar consulta",
            }),
            s("cards", { title: "Especialidades" }),
            s("icons", { title: "Nossa estrutura" }),
            s("testimonials"),
            s("faq"),
            s("form", { title: "Agende sua avaliação" }),
            s("map"),
            s("footer", { logoText: "Clínica Vitalis" }),
          ],
        },
        ...institutionalPages("Clínica Vitalis"),
      ],
    },
  },
  {
    id: "academia",
    name: "Academia",
    category: "Fitness",
    description: "Modalidades, planos, estrutura e matrícula online.",
    emoji: "🏋️",
    gradient: "from-lime-500 via-emerald-500 to-teal-600",
    minPlanLevel: 2,
    primaryColor: "#22c55e",
    secondaryColor: "#2f7bff",
    fontFamily: "Montserrat",
    featured: false,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Forge Fit" }),
            s("banner", {
              eyebrow: "Treine com propósito",
              title: "Sua melhor versão começa hoje",
              subtitle: "Musculação, funcional, crossfit e acompanhamento profissional.",
              imageUrl: IMAGES.gym,
              buttonLabel: "Matricule-se",
            }),
            s("cards", { title: "Modalidades" }),
            s("pricing", { title: "Planos e mensalidades" }),
            s("counters"),
            s("gallery", { title: "Nossa estrutura" }),
            s("testimonials"),
            s("cta", { title: "Primeira aula experimental grátis" }),
            s("footer", { logoText: "Forge Fit" }),
          ],
        },
        ...institutionalPages("Forge Fit"),
      ],
    },
  },
  {
    id: "advogado",
    name: "Advogado",
    category: "Jurídico",
    description: "Áreas de atuação, autoridade profissional e captação de casos.",
    emoji: "⚖️",
    gradient: "from-slate-700 via-blue-900 to-indigo-800",
    minPlanLevel: 1,
    primaryColor: "#1d4ed8",
    secondaryColor: "#d4af37",
    fontFamily: "Merriweather",
    featured: false,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Almeida & Associados" }),
            s("banner", {
              eyebrow: "Advocacia especializada",
              title: "Defesa técnica com estratégia e ética",
              subtitle: "Atuação em direito civil, trabalhista, empresarial e tributário.",
              imageUrl: IMAGES.law,
              buttonLabel: "Falar com advogado",
            }),
            s("cards", { title: "Áreas de atuação" }),
            s("text", { eyebrow: "Sobre o escritório", title: "20 anos defendendo direitos" }),
            s("counters"),
            s("faq"),
            s("form", { title: "Solicite uma análise do seu caso" }),
            s("footer", { logoText: "Almeida & Associados" }),
          ],
        },
        ...institutionalPages("Almeida & Associados"),
      ],
    },
  },
  {
    id: "imobiliaria",
    name: "Imobiliária",
    category: "Imóveis",
    description: "Catálogo de imóveis, busca, corretores e captação de leads.",
    emoji: "🏠",
    gradient: "from-orange-500 via-rose-500 to-fuchsia-600",
    minPlanLevel: 3,
    primaryColor: "#f43f5e",
    secondaryColor: "#2f7bff",
    fontFamily: "Poppins",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("header", { logoText: "Prime Imóveis" }),
            s("banner", {
              eyebrow: "Encontre seu lar",
              title: "Imóveis selecionados nas melhores regiões",
              subtitle: "Compra, venda e locação com assessoria completa.",
              imageUrl: IMAGES.realestate,
              buttonLabel: "Ver imóveis",
            }),
            s("gallery", { title: "Destaques da semana" }),
            s("cards", { title: "Como podemos ajudar" }),
            s("counters"),
            s("testimonials"),
            s("map"),
            s("form", { title: "Quero receber ofertas" }),
            s("footer", { logoText: "Prime Imóveis" }),
          ],
        },
        ...institutionalPages("Prime Imóveis"),
      ],
    },
  },
  {
    id: "criador-conteudo",
    name: "Criador de Conteúdo",
    category: "Criativo",
    description: "Bio link premium com redes, mídia kit, vídeos e parcerias.",
    emoji: "🎬",
    gradient: "from-violet-600 via-pink-600 to-orange-500",
    minPlanLevel: 3,
    primaryColor: "#8b5cf6",
    secondaryColor: "#22e58a",
    fontFamily: "Sora",
    featured: true,
    blueprint: {
      pages: [
        {
          name: "Início",
          path: "/",
          isHome: true,
          sections: [
            s("banner", {
              eyebrow: "Criador digital",
              title: "Conteúdo que conecta marcas e pessoas",
              subtitle: "+500 mil seguidores em campanhas com resultados reais.",
              imageUrl: IMAGES.creator,
              buttonLabel: "Mídia kit",
            }),
            s("counters", { title: "Alcance" }),
            s("video"),
            s("gallery", { title: "Últimos trabalhos" }),
            s("logos", { title: "Marcas parceiras" }),
            s("social"),
            s("form", { title: "Proposta de parceria" }),
            s("footer"),
          ],
        },
      ],
    },
  },
];

export const TEMPLATE_MAP: Record<string, TemplateDefinition> = TEMPLATES.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, TemplateDefinition>,
);

export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATE_MAP[id] ?? TEMPLATES[0];
}

export interface InstantiatedTemplate {
  pages: EditorPage[];
  sections: Record<string, EditorSection[]>;
}

/** Gera toda a estrutura inicial (páginas + blocos) a partir de um template. */
export function instantiateTemplate(templateId: string): InstantiatedTemplate {
  const template = getTemplate(templateId);
  const pages: EditorPage[] = [];
  const sections: Record<string, EditorSection[]> = {};

  template.blueprint.pages.forEach((blueprintPage, pageIndex) => {
    const pageId = uid("page");
    pages.push({
      id: pageId,
      name: blueprintPage.name,
      path: blueprintPage.path,
      isHome: blueprintPage.isHome ?? pageIndex === 0,
      position: pageIndex,
      seo: {
        title: `${blueprintPage.name} · ${template.name}`,
        description: template.description,
      },
    });

    sections[pageId] = blueprintPage.sections.map((blueprintSection, index) => {
      const base = createSection(blueprintSection.type, index);
      return {
        ...base,
        content: {
          ...defaultContent(blueprintSection.type),
          ...(blueprintSection.content ?? {}),
        },
        styles: {
          ...defaultStyles(blueprintSection.type),
          ...(blueprintSection.styles ?? {}),
        },
      };
    });
  });

  return { pages, sections };
}
