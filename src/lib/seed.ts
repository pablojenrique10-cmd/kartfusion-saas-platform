import { eq } from "drizzle-orm";
import { db } from "@/db";
import { plans, sites, subscriptions, templates, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { PLANS, TRIAL_DAYS } from "@/lib/plans";
import { createSiteFromTemplate } from "@/lib/sites";
import { TEMPLATES } from "@/lib/templates";

let seedPromise: Promise<void> | null = null;

const DEMO_EMAIL = "demo@kartfusion.com";

async function seedDemoUser(): Promise<void> {
  const [existing] = await db.select().from(users).where(eq(users.email, DEMO_EMAIL)).limit(1);
  if (existing) return;

  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 86_400_000);
  const [user] = await db
    .insert(users)
    .values({
      name: "Equipe Demo",
      email: DEMO_EMAIL,
      passwordHash: hashPassword("kartfusion"),
      planId: "premium",
      trialEndsAt,
      company: "KartFusion",
      avatarColor: "#22e58a",
    })
    .returning();

  await db.insert(subscriptions).values({
    userId: user.id,
    planId: "premium",
    status: "active",
    provider: "internal",
    currentPeriodEnd: new Date(Date.now() + 365 * 86_400_000),
  });

  const demoSite = await createSiteFromTemplate({
    userId: user.id,
    name: "Nexus Corp",
    description: "Consultoria, software e infraestrutura para empresas que querem crescer com segurança.",
    templateId: "empresa",
  });

  await db
    .update(sites)
    .set({ status: "published", publishedAt: new Date() })
    .where(eq(sites.id, demoSite.id));

  await createSiteFromTemplate({
    userId: user.id,
    name: "Ana Ribeiro Studio",
    description: "Portfólio de projetos de branding, web e direção criativa.",
    templateId: "portfolio",
  });
}

async function runSeed(): Promise<void> {
  for (const plan of PLANS) {
    await db
      .insert(plans)
      .values({
        id: plan.id,
        name: plan.name,
        tagline: plan.tagline,
        level: plan.level,
        priceCents: plan.priceCents,
        currency: plan.currency,
        maxSites: plan.maxSites,
        maxPages: plan.maxPages,
        storageMb: plan.storageMb,
        features: plan.features,
        highlighted: plan.highlighted,
      })
      .onConflictDoUpdate({
        target: plans.id,
        set: {
          name: plan.name,
          tagline: plan.tagline,
          level: plan.level,
          priceCents: plan.priceCents,
          maxSites: plan.maxSites,
          maxPages: plan.maxPages,
          storageMb: plan.storageMb,
          features: plan.features,
          highlighted: plan.highlighted,
        },
      });
  }

  for (const template of TEMPLATES) {
    await db
      .insert(templates)
      .values({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        emoji: template.emoji,
        gradient: template.gradient,
        minPlanLevel: template.minPlanLevel,
        primaryColor: template.primaryColor,
        secondaryColor: template.secondaryColor,
        fontFamily: template.fontFamily,
        featured: template.featured,
        blueprint: template.blueprint,
      })
      .onConflictDoUpdate({
        target: templates.id,
        set: {
          name: template.name,
          category: template.category,
          description: template.description,
          emoji: template.emoji,
          gradient: template.gradient,
          minPlanLevel: template.minPlanLevel,
          primaryColor: template.primaryColor,
          secondaryColor: template.secondaryColor,
          fontFamily: template.fontFamily,
          featured: template.featured,
          blueprint: template.blueprint,
        },
      });
  }

  try {
    await seedDemoUser();
  } catch (error) {
    console.error("demo seed error", error);
  }
}

/** Garante que planos e templates existam no banco (idempotente). */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  try {
    await seedPromise;
  } catch (error) {
    console.error("seed error", error);
  }
}
