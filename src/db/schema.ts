import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";


/* -------------------------------------------------------------------------- */
/*                                    PLANS                                   */
/* -------------------------------------------------------------------------- */

export const plans = pgTable(
  "plans",
  {
    id: text("id").primaryKey(),

    name: text("name")
      .notNull(),

    tagline: text("tagline")
      .notNull()
      .default(""),

    level: integer("level")
      .notNull()
      .default(1),

    priceCents: integer("price_cents")
      .notNull()
      .default(0),

    currency: text("currency")
      .notNull()
      .default("BRL"),

    maxSites: integer("max_sites")
      .notNull()
      .default(1),

    maxPages: integer("max_pages")
      .notNull()
      .default(5),

    storageMb: integer("storage_mb")
      .notNull()
      .default(500),

    features: jsonb("features")
      .$type<string[]>()
      .notNull()
      .default([]),

    highlighted: boolean("highlighted")
      .notNull()
      .default(false),

    createdAt: timestamp(
      "created_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),
  }
);



/* -------------------------------------------------------------------------- */
/*                                    USERS                                   */
/* -------------------------------------------------------------------------- */

export const users = pgTable(
  "users",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    name: text("name")
      .notNull(),


    email: text("email")
      .notNull(),


    passwordHash: text("password_hash")
      .notNull(),


    // owner | admin | editor | viewer
    role: text("role").notNull().default("cliente"),


    planId: text("plan_id")
      .notNull()
      .default("basic"),


    trialEndsAt: timestamp(
      "trial_ends_at",
      {
        withTimezone:true,
      }
    ),


    company: text("company"),


    phone: text("phone"),


    avatarColor: text("avatar_color")
      .notNull()
      .default("#2f7bff"),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),


    updatedAt: timestamp(
      "updated_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),

  },

  (table)=>[
    uniqueIndex(
      "users_email_unique"
    )
    .on(table.email)
  ]

);



/* -------------------------------------------------------------------------- */
/*                              SUBSCRIPTIONS                                 */
/* -------------------------------------------------------------------------- */


export const subscriptions = pgTable(
  "subscriptions",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    userId: uuid("user_id")
      .notNull()
      .references(
        ()=>users.id,
        {
          onDelete:"cascade"
        }
      ),


    planId:text("plan_id")
      .notNull(),


    status:text("status")
      .notNull()
      .default("trialing"),


    provider:text("provider")
      .notNull()
      .default("internal"),


    providerRef:text("provider_ref"),


    startedAt:timestamp(
      "started_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),


    currentPeriodEnd:timestamp(
      "current_period_end",
      {
        withTimezone:true
      }
    ),


    canceledAt:timestamp(
      "canceled_at",
      {
        withTimezone:true
      }
    ),


    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),


  },

  (table)=>[
    index(
      "subscriptions_user_idx"
    )
    .on(table.userId)
  ]

);
/* -------------------------------------------------------------------------- */
/*                                TEMPLATES                                   */
/* -------------------------------------------------------------------------- */

export const templates = pgTable(
  "templates",
  {

    id: text("id")
      .primaryKey(),


    name: text("name")
      .notNull(),


    category: text("category")
      .notNull(),


    description: text("description")
      .notNull()
      .default(""),


    emoji: text("emoji")
      .notNull()
      .default("✨"),


    gradient: text("gradient")
      .notNull()
      .default("from-blue-600 to-cyan-500"),


    minPlanLevel: integer("min_plan_level")
      .notNull()
      .default(1),


    primaryColor: text("primary_color")
      .notNull()
      .default("#2f7bff"),


    secondaryColor: text("secondary_color")
      .notNull()
      .default("#22e58a"),


    fontFamily: text("font_family")
      .notNull()
      .default("Inter"),


    featured: boolean("featured")
      .notNull()
      .default(false),


    usageCount: integer("usage_count")
      .notNull()
      .default(0),


    blueprint: jsonb("blueprint")
      .$type<unknown>()
      .notNull(),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),

  },

  (table)=>[
    index(
      "templates_category_idx"
    )
    .on(table.category)
  ]

);





/* -------------------------------------------------------------------------- */
/*                                    SITES                                   */
/* -------------------------------------------------------------------------- */


export const sites = pgTable(
  "sites",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),



    userId: uuid("user_id")
      .notNull()
      .references(
        ()=>users.id,
        {
          onDelete:"cascade"
        }
      ),



    name: text("name")
      .notNull(),



    slug: text("slug")
      .notNull(),



    description: text("description")
      .notNull()
      .default(""),



    templateId: text("template_id")
      .notNull()
      .default("empresa"),



    status:text("status")
      .notNull()
      .default("draft"),
      // draft | published



    primaryColor:text("primary_color")
      .notNull()
      .default("#2f7bff"),



    secondaryColor:text("secondary_color")
      .notNull()
      .default("#22e58a"),



    fontFamily:text("font_family")
      .notNull()
      .default("Inter"),



    customDomain:text("custom_domain"),



    settings:jsonb("settings")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),



    seo:jsonb("seo")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),



    publishedAt:timestamp(
      "published_at",
      {
        withTimezone:true,
      }
    ),



    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),



    updatedAt:timestamp(
      "updated_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),

  },


  (table)=>[

    uniqueIndex(
      "sites_slug_unique"
    )
    .on(table.slug),


    index(
      "sites_user_idx"
    )
    .on(table.userId)

  ]

);





/* -------------------------------------------------------------------------- */
/*                                    PAGES                                   */
/* -------------------------------------------------------------------------- */


export const pages = pgTable(
  "pages",
  {


    id:text("id")
      .primaryKey(),



    siteId:uuid("site_id")
      .notNull()
      .references(
        ()=>sites.id,
        {
          onDelete:"cascade"
        }
      ),



    name:text("name")
      .notNull(),



    path:text("path")
      .notNull()
      .default("/"),



    isHome:boolean("is_home")
      .notNull()
      .default(false),



    position:integer("position")
      .notNull()
      .default(0),



    seo:jsonb("seo")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),



    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true,
      }
    )
    .notNull()
    .defaultNow(),


  },


  (table)=>[

    index(
      "pages_site_idx"
    )
    .on(table.siteId)

  ]

);
/* -------------------------------------------------------------------------- */
/*                                  SECTIONS                                  */
/* -------------------------------------------------------------------------- */

export const sections = pgTable(
  "sections",
  {

    id:text("id")
      .primaryKey(),


    siteId:uuid("site_id")
      .notNull()
      .references(
        ()=>sites.id,
        {
          onDelete:"cascade"
        }
      ),


    pageId:text("page_id")
      .references(
        ()=>pages.id,
        {
          onDelete:"cascade"
        }
      ),


    type:text("type")
      .notNull(),


    name:text("name")
      .notNull()
      .default(""),


    position:integer("position")
      .notNull()
      .default(0),


    visible:boolean("visible")
      .notNull()
      .default(true),


    content:jsonb("content")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),


    styles:jsonb("styles")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),


    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),


    updatedAt:timestamp(
      "updated_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),

  },


  (table)=>[

    index(
      "sections_site_idx"
    )
    .on(table.siteId)

  ]

);







/* -------------------------------------------------------------------------- */
/*                                    MEDIA                                   */
/* -------------------------------------------------------------------------- */


export const media = pgTable(
  "media",
  {

    id:uuid("id")
      .defaultRandom()
      .primaryKey(),



    userId:uuid("user_id")
      .notNull()
      .references(
        ()=>users.id,
        {
          onDelete:"cascade"
        }
      ),



    siteId:uuid("site_id")
      .references(
        ()=>sites.id,
        {
          onDelete:"set null"
        }
      ),



    name:text("name")
      .notNull(),



    url:text("url")
      .notNull(),



    provider:text("provider")
      .notNull()
      .default("inline"),



    mimeType:text("mime_type")
      .notNull()
      .default("image/jpeg"),



    sizeBytes:integer("size_bytes")
      .notNull()
      .default(0),



    folder:text("folder")
      .notNull()
      .default("geral"),



    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),

  },


  (table)=>[

    index(
      "media_user_idx"
    )
    .on(table.userId)

  ]

);







/* -------------------------------------------------------------------------- */
/*                                 REVISIONS                                  */
/* -------------------------------------------------------------------------- */


export const revisions = pgTable(
  "revisions",
  {


    id:uuid("id")
      .defaultRandom()
      .primaryKey(),



    siteId:uuid("site_id")
      .notNull()
      .references(
        ()=>sites.id,
        {
          onDelete:"cascade"
        }
      ),



    userId:uuid("user_id")
      .references(
        ()=>users.id,
        {
          onDelete:"set null"
        }
      ),



    label:text("label")
      .notNull()
      .default("Autosave"),



    kind:text("kind")
      .notNull()
      .default("autosave"),
      // autosave | manual | publish



    snapshot:jsonb("snapshot")
      .$type<unknown>()
      .notNull(),



    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),


  },


  (table)=>[

    index(
      "revisions_site_idx"
    )
    .on(table.siteId)

  ]

);







/* -------------------------------------------------------------------------- */
/*                                 ACTIVITIES                                 */
/* -------------------------------------------------------------------------- */


export const activities = pgTable(
  "activities",
  {


    id:uuid("id")
      .defaultRandom()
      .primaryKey(),



    userId:uuid("user_id")
      .notNull()
      .references(
        ()=>users.id,
        {
          onDelete:"cascade"
        }
      ),



    siteId:uuid("site_id")
      .references(
        ()=>sites.id,
        {
          onDelete:"cascade"
        }
      ),



    type:text("type")
      .notNull(),



    message:text("message")
      .notNull(),



    meta:jsonb("meta")
      .$type<Record<string,unknown>>()
      .notNull()
      .default({}),



    createdAt:timestamp(
      "created_at",
      {
        withTimezone:true
      }
    )
    .notNull()
    .defaultNow(),

  },


  (table)=>[

    index(
      "activities_user_idx"
    )
    .on(table.userId)

  ]

);
/* -------------------------------------------------------------------------- */
/*                                    LEADS                                   */
/* -------------------------------------------------------------------------- */

export const leads = pgTable(
  "leads",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    siteId: uuid("site_id")
      .notNull()
      .references(
        () => sites.id,
        {
          onDelete: "cascade",
        }
      ),


    name: text("name")
      .notNull()
      .default(""),


    email: text("email")
      .notNull()
      .default(""),


    phone: text("phone")
      .notNull()
      .default(""),


    message: text("message")
      .notNull()
      .default(""),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
    .notNull()
    .defaultNow(),

  },

  (table) => [
    index(
      "leads_site_idx"
    )
    .on(table.siteId),
  ]

);






/* -------------------------------------------------------------------------- */
/*                              NOTIFICATIONS                                 */
/* -------------------------------------------------------------------------- */

export const notifications = pgTable(
  "notifications",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    userId: uuid("user_id")
      .references(
        () => users.id,
        {
          onDelete: "cascade",
        }
      ),


    title: text("title")
      .notNull(),


    message: text("message")
      .notNull(),


    read: boolean("read")
      .notNull()
      .default(false),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
    .notNull()
    .defaultNow(),

  }

);








/* -------------------------------------------------------------------------- */
/*                              ADMIN ROLES                                   */
/* -------------------------------------------------------------------------- */

export const adminRoles = pgTable(
  "admin_roles",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    name: text("name")
      .notNull(),


    permissions: jsonb("permissions")
      .$type<string[]>()
      .notNull()
      .default([]),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
    .notNull()
    .defaultNow(),

  }

);








/* -------------------------------------------------------------------------- */
/*                              USER ROLES                                    */
/* -------------------------------------------------------------------------- */

export const userRoles = pgTable(
  "user_roles",
  {

    id: uuid("id")
      .defaultRandom()
      .primaryKey(),


    userId: uuid("user_id")
      .notNull()
      .references(
        () => users.id,
        {
          onDelete: "cascade",
        }
      ),


    roleId: uuid("role_id")
      .notNull()
      .references(
        () => adminRoles.id,
        {
          onDelete: "cascade",
        }
      ),


    createdAt: timestamp(
      "created_at",
      {
        withTimezone: true,
      }
    )
    .notNull()
    .defaultNow(),

  }

);








/* -------------------------------------------------------------------------- */
/*                              PERMISSIONS                                   */
/* -------------------------------------------------------------------------- */

export const PERMISSIONS = {

  USERS_VIEW:
    "users.view",

  USERS_EDIT:
    "users.edit",

  USERS_DELETE:
    "users.delete",


  SITES_VIEW:
    "sites.view",

  SITES_EDIT:
    "sites.edit",

  SITES_DELETE:
    "sites.delete",

  SITES_PUBLISH:
    "sites.publish",


  PAYMENTS_VIEW:
    "payments.view",

  PAYMENTS_MANAGE:
    "payments.manage",


  SETTINGS_MANAGE:
    "settings.manage",


  SUPPORT_MANAGE:
    "support.manage",

} as const;
/* -------------------------------------------------------------------------- */
/*                              DEFAULT ROLES                                 */
/* -------------------------------------------------------------------------- */

export const DEFAULT_ROLES = [
  {
    name: "owner",
    permissions: [
      "users.view",
      "users.edit",
      "users.delete",

      "sites.view",
      "sites.edit",
      "sites.delete",
      "sites.publish",

      "payments.view",
      "payments.manage",

      "settings.manage",

      "support.manage",
    ],
  },


  {
    name: "admin",
    permissions: [
      "users.view",
      "users.edit",

      "sites.view",
      "sites.edit",
      "sites.publish",

      "support.manage",
    ],
  },


  {
    name: "editor",
    permissions: [
      "sites.view",
      "sites.edit",
      "sites.publish",
    ],
  },


  {
    name: "support",
    permissions: [
      "users.view",
      "support.manage",
    ],
  },


  {
    name: "viewer",
    permissions: [
      "users.view",
      "sites.view",
    ],
  },

] as const;







/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */


export type User =
  typeof users.$inferSelect;


export type Plan =
  typeof plans.$inferSelect;


export type Subscription =
  typeof subscriptions.$inferSelect;


export type TemplateRow =
  typeof templates.$inferSelect;


export type Site =
  typeof sites.$inferSelect;


export type Page =
  typeof pages.$inferSelect;


export type Section =
  typeof sections.$inferSelect;


export type MediaItem =
  typeof media.$inferSelect;


export type Revision =
  typeof revisions.$inferSelect;


export type Activity =
  typeof activities.$inferSelect;


export type Lead =
  typeof leads.$inferSelect;


export type Notification =
  typeof notifications.$inferSelect;


export type AdminRole =
  typeof adminRoles.$inferSelect;


export type UserRole =
  typeof userRoles.$inferSelect;