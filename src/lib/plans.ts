export type PlanId = "basic" | "intermediate" | "premium";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  level: 1 | 2 | 3;
  priceCents: number;
  currency: string;
  maxSites: number;
  maxPages: number;
  storageMb: number;
  highlighted: boolean;
  features: string[];
}

export const TRIAL_DAYS = 14;

export const PLANS: PlanDefinition[] = [
  {
    id: "basic",
    name: "Básico",
    tagline: "Para quem quer um site simples, bonito e no ar rapidamente.",
    level: 1,
    priceCents: 3900,
    currency: "BRL",
    maxSites: 1,
    maxPages: 5,
    storageMb: 500,
    highlighted: false,
    features: [
      "Site institucional",
      "Até 5 páginas",
      "Templates básicos",
      "Editor simplificado",
      "Textos, botões e imagens",
      "Formulário de contato",
      "SEO básico",
      "100% responsivo",
      "Publicação em kartfusion.com",
    ],
  },
  {
    id: "intermediate",
    name: "Intermediário",
    tagline: "Mais componentes, mais páginas e recursos de crescimento.",
    level: 2,
    priceCents: 8900,
    currency: "BRL",
    maxSites: 5,
    maxPages: 20,
    storageMb: 5000,
    highlighted: true,
    features: [
      "Tudo do plano Básico",
      "Templates profissionais",
      "Galerias de imagens",
      "Blog e artigos",
      "FAQ e depoimentos",
      "Botão de WhatsApp",
      "Até 20 páginas por site",
      "Mais componentes e personalização",
      "SEO avançado",
      "Estatísticas de acesso",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Tudo liberado. O poder completo do KartFusion sem limites.",
    level: 3,
    priceCents: 17900,
    currency: "BRL",
    maxSites: 999,
    maxPages: 999,
    storageMb: 50000,
    highlighted: false,
    features: [
      "Todos os templates",
      "Editor completo estilo Wix",
      "Drag and drop total",
      "Biblioteca completa de blocos",
      "Blocos e sites ilimitados",
      "Upload de imagens e biblioteca de mídia",
      "Histórico de revisões e autosave",
      "Preview desktop, tablet e mobile",
      "SEO completo + Open Graph",
      "Domínio personalizado",
      "Landing pages e área administrativa",
      "Integrações e base para e-commerce",
      "Performance otimizada",
    ],
  },
];

export const PLAN_MAP: Record<PlanId, PlanDefinition> = PLANS.reduce(
  (acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  },
  {} as Record<PlanId, PlanDefinition>,
);

export function isPlanId(value: string): value is PlanId {
  return value === "basic" || value === "intermediate" || value === "premium";
}

export function getPlan(id: string): PlanDefinition {
  return isPlanId(id) ? PLAN_MAP[id] : PLAN_MAP.basic;
}

export interface PlanContext {
  planId: PlanId;
  planName: string;
  level: 1 | 2 | 3;
  trialing: boolean;
  trialDaysLeft: number;
  maxSites: number;
  maxPages: number;
  storageMb: number;
}

export function resolvePlanContext(user: {
  planId: string;
  trialEndsAt: Date | string | null;
}): PlanContext {
  const basePlan = getPlan(user.planId);
  const trialEnds = user.trialEndsAt ? new Date(user.trialEndsAt) : null;
  const now = Date.now();
  const trialing = Boolean(trialEnds && trialEnds.getTime() > now);
  const trialDaysLeft = trialing && trialEnds
    ? Math.max(0, Math.ceil((trialEnds.getTime() - now) / 86_400_000))
    : 0;

  const effective = trialing ? PLAN_MAP.premium : basePlan;

  return {
    planId: basePlan.id,
    planName: trialing ? "Teste Premium" : basePlan.name,
    level: effective.level,
    trialing,
    trialDaysLeft,
    maxSites: effective.maxSites,
    maxPages: effective.maxPages,
    storageMb: effective.storageMb,
  };
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
