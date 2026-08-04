import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getCurrentUser } from "@/lib/auth";
import { TRIAL_DAYS, formatPrice } from "@/lib/plans";

import { db } from "@/db";
import { plans } from "@/db/schema";
import { desc } from "drizzle-orm";

import { TEMPLATES } from "@/lib/templates";
import { BLOCK_LIBRARY } from "@/lib/blocks";

export const dynamic = "force-dynamic";


const FEATURES = [
  {
    icon: "🧩",
    title: "Editor visual drag & drop",
    text: "Monte páginas arrastando blocos prontos. Sem código, sem plugins, sem dor de cabeça.",
  },
  {
    icon: "⚡",
    title: "Publicação instantânea",
    text: "Um clique e o seu site fica no ar em kartfusion.com/site/sua-marca com SSL e CDN.",
  },
  {
    icon: "📱",
    title: "Preview multi-dispositivo",
    text: "Veja em tempo real como fica no desktop, tablet e celular antes de publicar.",
  },
  {
    icon: "🕘",
    title: "Autosave e histórico",
    text: "Salvamento automático, revisões, desfazer e refazer. Você nunca perde nada.",
  },
  {
    icon: "🔍",
    title: "SEO completo",
    text: "Título, descrição, keywords, Open Graph, favicon e sitemap gerado automaticamente.",
  },
  {
    icon: "🛒",
    title: "Pronto para vender",
    text: "Estrutura preparada para e-commerce, integrações e domínio personalizado.",
  },
];


const STEPS = [
  {
    n: "01",
    title: "Escolha um template",
    text: "Mais de 11 modelos profissionais por segmento.",
  },
  {
    n: "02",
    title: "Personalize tudo",
    text: "Cores, fontes, textos, imagens e blocos no editor visual.",
  },
  {
    n: "03",
    title: "Publique",
    text: "Seu site no ar em segundos, otimizado e responsivo.",
  },
];



export default async function HomePage() {


  const user =
    await getCurrentUser();



  const PLANS =
    await db
      .select()
      .from(plans)
      .orderBy(
        desc(plans.level)
      );



  return (
    <div className="relative overflow-hidden">

      <div className="pointer-events-none absolute inset-0 -z-10">

        <div className="
          absolute
          -top-40
          left-1/2
          h-[520px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          bg-fusion-500/22
          blur-[140px]
        " />

        <div className="
          absolute
          right-[-10%]
          top-[45%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-neon-500/12
          blur-[130px]
        " />

        <div className="
          absolute
          inset-0
          grid-noise
          opacity-40
        " />

      </div>
      {/* NAV */}
      <header className="
        sticky
        top-0
        z-50
        border-b
        border-white/5
        bg-ink-950/70
        backdrop-blur-xl
      ">

        <div className="
          mx-auto
          flex
          h-16
          w-full
          max-w-7xl
          items-center
          justify-between
          px-5
        ">

          <Logo />


          <nav className="
            hidden
            items-center
            gap-8
            text-sm
            text-slate-400
            md:flex
          ">

            <a href="#recursos" className="transition hover:text-white">
              Recursos
            </a>

            <a href="#templates" className="transition hover:text-white">
              Templates
            </a>

            <a href="#editor" className="transition hover:text-white">
              Editor
            </a>

            <Link
              href="/precos"
              className="transition hover:text-white"
            >
              Planos
            </Link>

          </nav>



          <div className="
            flex
            items-center
            gap-2.5
          ">


            {
              user ? (

                <Link
                  href="/dashboard"
                  className="kf-btn kf-btn-primary"
                >
                  Ir para o painel
                </Link>

              ) : (

                <>

                  <Link
                    href="/login"
                    className="kf-btn kf-btn-ghost"
                  >
                    Entrar
                  </Link>


                  <Link
                    href="/cadastro"
                    className="kf-btn kf-btn-success"
                  >
                    Criar grátis
                  </Link>

                </>

              )
            }


          </div>

        </div>

      </header>





      {/* HERO */}
      <section className="
        mx-auto
        w-full
        max-w-7xl
        px-5
        pb-20
        pt-20
        text-center
        md:pt-28
      ">


        <span className="
          kf-chip
          kf-fade-up
          mx-auto
          border-neon-500/30
          bg-neon-500/10
          text-neon-400
        ">

          <span className="
            h-1.5
            w-1.5
            rounded-full
            bg-neon-500
            kf-pulse
          " />

          {TRIAL_DAYS} dias de Premium grátis · sem cartão

        </span>





        <h1 className="
          kf-fade-up
          mx-auto
          mt-7
          max-w-4xl
          text-[2.6rem]
          font-extrabold
          leading-[1.05]
          tracking-tight
          text-white
          sm:text-6xl
          lg:text-7xl
        ">

          Crie o site da sua empresa

          <span className="text-gradient">
            sem escrever uma linha
          </span>

          de código

        </h1>





        <p className="
          kf-fade-up
          mx-auto
          mt-6
          max-w-2xl
          text-base
          leading-relaxed
          text-slate-400
          sm:text-lg
        ">

          KartFusion é o construtor de sites brasileiro com editor visual estilo Wix,
          templates premium, blocos ilimitados, autosave e publicação em um clique.

        </p>
        <div className="
          kf-fade-up
          mt-9
          flex
          flex-wrap
          items-center
          justify-center
          gap-3
        ">


          <Link
            href="/cadastro"
            className="
              kf-btn
              kf-btn-success
              px-7
              py-3.5
              text-base
            "
          >

            🚀 Começar teste grátis

          </Link>



          <Link
            href="/precos"
            className="
              kf-btn
              kf-btn-ghost
              px-7
              py-3.5
              text-base
            "
          >

            Ver planos e preços

          </Link>


        </div>




        {/* Mock do editor */}
        <div className="kf-fade-up mx-auto mt-16 max-w-5xl">

          <div className="
            glass-strong
            overflow-hidden
            rounded-2xl
            p-2
            shadow-[0_60px_140px_-60px_rgba(47,123,255,0.75)]
          ">


            <div className="
              flex
              items-center
              gap-2
              px-3
              py-2
            ">

              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />


              <span className="
                ml-3
                rounded-md
                bg-white/5
                px-3
                py-1
                text-[11px]
                text-slate-400
              ">

                kartfusion.com/editor

              </span>

            </div>





            <div className="
              grid
              gap-2
              rounded-xl
              bg-ink-900/70
              p-2
              md:grid-cols-[190px_1fr_210px]
            ">


              <div className="
                hidden
                flex-col
                gap-1.5
                rounded-lg
                bg-ink-800/70
                p-3
                md:flex
              ">


                <p className="
                  mb-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                ">

                  Elementos

                </p>



                {
                  BLOCK_LIBRARY
                    .slice(0,8)
                    .map((block)=>(

                    <div
                      key={block.type}
                      className="
                        flex
                        items-center
                        gap-2
                        rounded-md
                        bg-white/[0.03]
                        px-2.5
                        py-1.5
                        text-[11px]
                        text-slate-300
                      "
                    >

                      <span className="text-slate-500">
                        {block.icon}
                      </span>

                      {block.label}

                    </div>

                  ))
                }


              </div>
              <div className="
                min-h-[320px]
                rounded-lg
                bg-white
                p-4
                text-left
              ">


                <div className="
                  rounded-lg
                  bg-gradient-to-br
                  from-slate-900
                  via-blue-900
                  to-slate-800
                  p-8
                  text-center
                ">


                  <p className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-neon-400
                  ">

                    Bem-vindo

                  </p>


                  <p className="
                    mt-2
                    text-xl
                    font-extrabold
                    text-white
                  ">

                    Seu novo site profissional

                  </p>


                  <span className="
                    mt-4
                    inline-block
                    rounded-lg
                    bg-fusion-500
                    px-4
                    py-2
                    text-[11px]
                    font-semibold
                    text-white
                  ">

                    Começar agora

                  </span>


                </div>





                <div className="
                  mt-3
                  grid
                  grid-cols-3
                  gap-2
                ">


                  {
                    ["⚡","🎯","🛡"]
                    .map((icon)=>(

                    <div
                      key={icon}
                      className="
                        rounded-lg
                        border
                        border-slate-200
                        p-3
                      "
                    >

                      <div className="text-base">
                        {icon}
                      </div>


                      <div className="
                        mt-2
                        h-1.5
                        w-3/4
                        rounded
                        bg-slate-200
                      " />


                      <div className="
                        mt-1.5
                        h-1.5
                        w-full
                        rounded
                        bg-slate-100
                      " />

                    </div>

                  ))
                  }


                </div>


              </div>






              <div className="
                hidden
                flex-col
                gap-2
                rounded-lg
                bg-ink-800/70
                p-3
                md:flex
              ">


                <p className="
                  mb-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                ">

                  Propriedades

                </p>



                {
                  [
                    "Cor de fundo",
                    "Tipografia",
                    "Espaçamento",
                    "Alinhamento",
                    "Raio da borda"
                  ]
                  .map((label)=>(

                  <div
                    key={label}
                    className="
                      rounded-md
                      bg-white/[0.03]
                      px-2.5
                      py-2
                    "
                  >

                    <p className="
                      text-[10px]
                      text-slate-500
                    ">

                      {label}

                    </p>


                    <div className="
                      mt-1.5
                      h-1.5
                      w-full
                      rounded
                      bg-white/10
                    " />


                  </div>

                  ))
                }



                <div className="
                  mt-auto
                  rounded-md
                  bg-neon-500/15
                  px-2.5
                  py-2
                  text-center
                  text-[11px]
                  font-semibold
                  text-neon-400
                ">

                  💾 Salvo automaticamente

                </div>


              </div>



            </div>


          </div>


        </div>





        <div className="
          mt-14
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-4
        ">


          {
            [
              {
                value:"11+",
                label:"Templates prontos"
              },
              {
                value:"19",
                label:"Blocos no editor"
              },
              {
                value:"3",
                label:"Modos de preview"
              },
              {
                value:"100%",
                label:"Responsivo"
              },
            ]
            .map((stat)=>(


              <div
                key={stat.label}
                className="kf-card p-5"
              >

                <p className="
                  text-2xl
                  font-extrabold
                  text-white
                  sm:text-3xl
                ">

                  {stat.value}

                </p>


                <p className="
                  mt-1
                  text-xs
                  text-slate-500
                ">

                  {stat.label}

                </p>


              </div>


            ))
          }


        </div>


      </section>





      {/* PLANOS */}
      <section
        id="planos"
        className="
          mx-auto
          w-full
          max-w-7xl
          px-5
          py-20
        "
      >


        <div className="
          mx-auto
          max-w-2xl
          text-center
        ">


          <span className="kf-chip text-neon-400">
            Planos
          </span>


          <h2 className="
            mt-4
            text-3xl
            font-extrabold
            tracking-tight
            text-white
            sm:text-4xl
          ">


            Comece grátis, evolua quando quiser


          </h2>


          <p className="
            mt-3
            text-slate-400
          ">


            Todo novo usuário recebe {TRIAL_DAYS} dias com o Premium completo liberado.


          </p>


        </div>
        <div className="
          mt-12
          grid
          gap-5
          lg:grid-cols-3
        ">


          {
            PLANS.map((plan)=>(


              <article
                key={plan.id}
                className={`kf-card relative p-7 ${
                  plan.highlighted
                  ? "border-fusion-500/50 shadow-[0_40px_100px_-50px_rgba(47,123,255,0.9)]"
                  : ""
                }`}
              >


                {
                  plan.highlighted && (

                    <span className="
                      absolute
                      -top-3
                      left-1/2
                      -translate-x-1/2
                      rounded-full
                      bg-gradient-to-r
                      from-fusion-500
                      to-neon-500
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-widest
                      text-white
                    ">

                      Mais popular

                    </span>

                  )
                }



                <h3 className="
                  text-lg
                  font-extrabold
                  text-white
                ">

                  {plan.name}

                </h3>



                <p className="
                  mt-1.5
                  min-h-[40px]
                  text-xs
                  leading-relaxed
                  text-slate-400
                ">

                  {plan.tagline}

                </p>




                <div className="
                  mt-5
                  flex
                  items-end
                  gap-1
                ">


                  <span className="
                    text-4xl
                    font-extrabold
                    text-white
                  ">

                    {formatPrice(plan.priceCents)}

                  </span>


                  <span className="
                    mb-1.5
                    text-xs
                    text-slate-500
                  ">

                    /mês

                  </span>


                </div>





                <ul className="
                  mt-6
                  grid
                  gap-2.5
                ">


                  {
                    plan.features.map((feature)=>(


                      <li
                        key={feature}
                        className="
                          flex
                          items-start
                          gap-2
                          text-sm
                          text-slate-300
                        "
                      >

                        <span className="
                          mt-0.5
                          text-neon-500
                        ">

                          ✓

                        </span>


                        {feature}


                      </li>


                    ))
                  }


                </ul>





                <a
                  href={`https://wa.me/5543996317934?text=${encodeURIComponent(
                    `Olá, tenho interesse no plano ${plan.name} do KartFusion. Gostaria de contratar.`
                  )}`}
                  target="_blank"
                  className={`kf-btn mt-7 w-full ${
                    plan.highlighted
                    ? "kf-btn-primary"
                    : "kf-btn-ghost"
                  }`}
                >

                  💬 Contratar pelo WhatsApp

                </a>




              </article>


            ))
          }


        </div>


      </section>






      {/* CTA FINAL */}

      <section className="
        mx-auto
        w-full
        max-w-7xl
        px-5
        pb-24
      ">


        <div className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-fusion-600/25
          via-ink-800
          to-neon-600/15
          p-10
          text-center
          sm:p-16
        ">


          <div className="
            absolute
            inset-0
            grid-noise
            opacity-30
          " />


          <div className="relative">


            <h2 className="
              text-3xl
              font-extrabold
              tracking-tight
              text-white
              sm:text-5xl
            ">

              Seu site profissional começa hoje

            </h2>



            <p className="
              mx-auto
              mt-4
              max-w-xl
              text-slate-300
            ">

              Fale comigo pelo WhatsApp e escolha o melhor plano para sua empresa.

            </p>





            <div className="
              mt-8
              flex
              flex-wrap
              justify-center
              gap-3
            ">


              <a
                href="https://wa.me/5543996317934?text=Olá, quero criar meu site no KartFusion."
                target="_blank"
                className="
                  kf-btn
                  kf-btn-success
                  px-8
                  py-3.5
                  text-base
                "
              >

                💬 Falar no WhatsApp

              </a>



              <Link
                href="/login"
                className="
                  kf-btn
                  kf-btn-ghost
                  px-8
                  py-3.5
                  text-base
                "
              >

                Já tenho conta

              </Link>


            </div>


          </div>


        </div>


            </section>


      <footer className="
        border-t
        border-white/5
        bg-ink-950/80
      ">

        <div className="
          mx-auto
          max-w-7xl
          px-5
          py-10
          text-center
          text-sm
          text-slate-500
        ">

          © {new Date().getFullYear()} KartFusion · Feito no Brasil 🇧🇷

        </div>

      </footer>


    </div>
  );
}