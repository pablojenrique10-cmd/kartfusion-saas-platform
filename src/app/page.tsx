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
    text: "Um clique e o seu site fica no ar com SSL e CDN.",
  },
  {
    icon: "📱",
    title: "Preview multi-dispositivo",
    text: "Veja em tempo real como fica no desktop, tablet e celular.",
  },
  {
    icon: "🕘",
    title: "Autosave e histórico",
    text: "Salvamento automático, revisões e desfazer/refazer.",
  },
  {
    icon: "🔍",
    title: "SEO completo",
    text: "Título, descrição, keywords, Open Graph, favicon e sitemap.",
  },
  {
    icon: "🛒",
    title: "Pronto para vender",
    text: "Estrutura preparada para e-commerce, integrações e domínio próprio.",
  },
];


const STEPS = [
  {
    n: "01",
    title: "Escolha um template",
    text: "Modelos profissionais prontos por segmento.",
  },
  {
    n: "02",
    title: "Personalize tudo",
    text: "Cores, fontes, textos, imagens e blocos.",
  },
  {
    n: "03",
    title: "Publique",
    text: "Seu site no ar rapidamente.",
  },
];



export default async function HomePage() {


  const user = await getCurrentUser();



  const PLANS =
    await db
      .select()
      .from(plans)
      .orderBy(
        desc(plans.level)
      );



  return (
    <div className="relative overflow-hidden">


      {/* BACKGROUND */}
      <div className="
        pointer-events-none
        absolute
        inset-0
        -z-10
      ">

        <div className="
          absolute
          -top-40
          left-1/2
          h-[520px]
          w-[900px]
          -translate-x-1/2
          rounded-full
          bg-fusion-500/20
          blur-[140px]
        "/>


        <div className="
          absolute
          right-[-10%]
          top-[45%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-neon-500/10
          blur-[130px]
        "/>


        <div className="
          absolute
          inset-0
          grid-noise
          opacity-40
        "/>


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


            <a
              href="#recursos"
              className="transition hover:text-white"
            >
              Recursos
            </a>


            <a
              href="#templates"
              className="transition hover:text-white"
            >
              Templates
            </a>


            <a
              href="#editor"
              className="transition hover:text-white"
            >
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


            {user ? (

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

            )}


          </div>


        </div>


      </header>





      {/* HERO */}
      <section className="
        mx-auto
        max-w-7xl
        px-5
        pb-20
        pt-20
        text-center
        md:pt-28
      ">


        <span className="
          kf-chip
          mx-auto
          border-neon-500/30
          bg-neon-500/10
          text-neon-400
        ">


          <span className="
            mr-2
            inline-block
            h-1.5
            w-1.5
            rounded-full
            bg-neon-500
          "/>


          {TRIAL_DAYS} dias de Premium grátis · sem cartão


        </span>
        <h1 className="
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
          mx-auto
          mt-6
          max-w-2xl
          text-base
          leading-relaxed
          text-slate-400
          sm:text-lg
        ">

          KartFusion é o construtor de sites brasileiro com editor visual,
          templates premium, blocos ilimitados, autosave e publicação rápida.

        </p>




        <div className="
          mt-9
          flex
          flex-wrap
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





        {/* MOCK EDITOR */}
        <div className="
          mx-auto
          mt-16
          max-w-5xl
        ">


          <div className="
            glass-strong
            overflow-hidden
            rounded-2xl
            p-2
          ">


            <div className="
              flex
              items-center
              gap-2
              px-3
              py-2
            ">


              <span className="
                h-2.5
                w-2.5
                rounded-full
                bg-rose-500/70
              "/>


              <span className="
                h-2.5
                w-2.5
                rounded-full
                bg-amber-400/70
              "/>


              <span className="
                h-2.5
                w-2.5
                rounded-full
                bg-emerald-400/70
              "/>


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
                gap-2
                rounded-lg
                bg-ink-800/70
                p-3
                md:flex
              ">


                <p className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                ">

                  Elementos

                </p>



                {BLOCK_LIBRARY
                  .slice(0,8)
                  .map((block)=>(


                    <div
                      key={block.type}
                      className="
                        rounded-md
                        bg-white/[0.03]
                        px-2.5
                        py-2
                        text-[11px]
                        text-slate-300
                      "
                    >

                      {block.icon} {block.label}

                    </div>


                  ))}



              </div>





              <div className="
                min-h-[320px]
                rounded-lg
                bg-white
                p-4
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
                    text-xs
                    uppercase
                    tracking-widest
                    text-neon-400
                  ">

                    Bem-vindo

                  </p>


                  <h3 className="
                    mt-2
                    text-xl
                    font-extrabold
                    text-white
                  ">

                    Seu novo site profissional

                  </h3>


                  <span className="
                    mt-4
                    inline-block
                    rounded-lg
                    bg-fusion-500
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    text-white
                  ">

                    Começar agora

                  </span>


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
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-slate-500
                ">

                  Propriedades

                </p>


                {[
                  "Cor de fundo",
                  "Tipografia",
                  "Espaçamento",
                  "Alinhamento",
                  "Raio da borda"
                ].map((item)=>(

                  <div
                    key={item}
                    className="
                      rounded-md
                      bg-white/[0.03]
                      px-3
                      py-2
                    "
                  >

                    <span className="
                      text-xs
                      text-slate-400
                    ">
                      {item}
                    </span>

                  </div>

                ))}


              </div>


            </div>


          </div>


        </div>

      </section>






      {/* RECURSOS */}
      <section
        id="recursos"
        className="
          mx-auto
          max-w-7xl
          px-5
          py-20
        "
      >


        <div className="
          text-center
          mx-auto
          max-w-2xl
        ">


          <span className="kf-chip text-neon-400">
            Recursos
          </span>


          <h2 className="
            mt-4
            text-3xl
            font-extrabold
            text-white
            sm:text-4xl
          ">

            Tudo para criar sites profissionais

          </h2>


        </div>





        <div className="
          mt-12
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">


          {FEATURES.map((feature)=>(

            <article
              key={feature.title}
              className="kf-card p-6"
            >

              <div className="text-3xl">
                {feature.icon}
              </div>


              <h3 className="
                mt-4
                font-bold
                text-white
              ">

                {feature.title}

              </h3>


              <p className="
                mt-2
                text-sm
                text-slate-400
              ">

                {feature.text}

              </p>


            </article>

          ))}


        </div>


      </section>
      {/* TEMPLATES */}
      <section
        id="templates"
        className="
          mx-auto
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
            Templates
          </span>


          <h2 className="
            mt-4
            text-3xl
            font-extrabold
            text-white
            sm:text-4xl
          ">

            Templates profissionais prontos

          </h2>


          <p className="
            mt-3
            text-slate-400
          ">

            Escolha um modelo e personalize do seu jeito.

          </p>


        </div>





        <div className="
          mt-12
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">


          {TEMPLATES.slice(0,6).map((template)=>(


            <article
              key={template.id}
              className="
                kf-card
                overflow-hidden
              "
            >


              {template.preview ? (

                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={template.preview}
                  alt={template.name}
                  className="
                    h-48
                    w-full
                    object-cover
                  "
                />

              ) : (

                <div className="
                  flex
                  h-48
                  items-center
                  justify-center
                  bg-white/5
                  text-slate-500
                ">

                  Preview

                </div>

              )}




              <div className="p-5">

                <h3 className="
                  text-lg
                  font-bold
                  text-white
                ">

                  {template.name}

                </h3>


                <p className="
                  mt-2
                  text-sm
                  text-slate-400
                ">

                  {template.description}

                </p>


              </div>


            </article>


          ))}


        </div>


      </section>







      {/* EDITOR */}
      <section
        id="editor"
        className="
          mx-auto
          max-w-7xl
          px-5
          py-20
        "
      >


        <div className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-fusion-600/20
          via-ink-900
          to-neon-600/10
          p-10
          text-center
          sm:p-16
        ">


          <h2 className="
            text-3xl
            font-extrabold
            text-white
            sm:text-5xl
          ">

            Editor visual poderoso

          </h2>



          <p className="
            mx-auto
            mt-4
            max-w-2xl
            text-slate-300
          ">

            Arraste blocos, altere cores, imagens e textos em tempo real.
            Crie páginas completas sem programar.

          </p>





          <div className="
            mt-8
            grid
            gap-4
            sm:grid-cols-3
          ">


            {[
              "🧩 Arrastar e soltar",
              "📱 Preview responsivo",
              "💾 Salvamento automático",
            ].map((item)=>(


              <div
                key={item}
                className="
                  rounded-xl
                  bg-white/5
                  p-5
                  text-sm
                  font-semibold
                  text-white
                "
              >

                {item}

              </div>


            ))}


          </div>


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

            Todo novo usuário recebe {TRIAL_DAYS} dias com Premium completo.

          </p>


        </div>





        <div className="
          mt-12
          grid
          gap-5
          lg:grid-cols-3
        ">


          {PLANS.map((plan)=>(


            <article
              key={plan.id}
              className={`kf-card relative p-7 ${
                plan.highlighted
                ? "border-fusion-500/50"
                : ""
              }`}
            >


              {plan.highlighted && (

                <span className="
                  absolute
                  -top-3
                  left-1/2
                  -translate-x-1/2
                  rounded-full
                  bg-fusion-500
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-white
                ">

                  Mais popular

                </span>

              )}



              <h3 className="
                text-lg
                font-bold
                text-white
              ">

                {plan.name}

              </h3>



              <p className="
                mt-2
                text-sm
                text-slate-400
              ">

                {plan.tagline}

              </p>



              <div className="
                mt-5
                text-4xl
                font-extrabold
                text-white
              ">

                {formatPrice(plan.priceCents)}

              </div>
              <span className="
                text-xs
                text-slate-500
              ">

                /mês

              </span>



              <ul className="
                mt-6
                grid
                gap-2.5
              ">


                {plan.features.map((feature)=>(

                  <li
                    key={feature}
                    className="
                      flex
                      gap-2
                      text-sm
                      text-slate-300
                    "
                  >

                    <span className="text-neon-500">
                      ✓
                    </span>


                    {feature}

                  </li>


                ))}


              </ul>





              <Link
                href="/cadastro"
                className={`kf-btn mt-7 w-full ${
                  plan.highlighted
                  ? "kf-btn-primary"
                  : "kf-btn-ghost"
                }`}
              >

                Testar grátis por {TRIAL_DAYS} dias

              </Link>



            </article>


          ))}


        </div>


      </section>







      {/* CTA FINAL */}
      <section className="
        mx-auto
        max-w-7xl
        px-5
        pb-24
      ">


        <div className="
          rounded-3xl
          border
          border-white/10
          bg-gradient-to-br
          from-fusion-600/30
          via-ink-900
          to-neon-600/20
          p-10
          text-center
          sm:p-16
        ">


          <h2 className="
            text-3xl
            font-extrabold
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

            Crie sua presença digital com o KartFusion.

          </p>




          <div className="
            mt-8
            flex
            flex-wrap
            justify-center
            gap-3
          ">


            <Link
              href="/cadastro"
              className="
                kf-btn
                kf-btn-success
                px-8
                py-3.5
              "
            >

              Criar conta grátis

            </Link>




            <Link
              href="/login"
              className="
                kf-btn
                kf-btn-ghost
                px-8
                py-3.5
              "
            >

              Já tenho conta

            </Link>


          </div>


        </div>


      </section>







      {/* FOOTER */}
      <footer className="
        border-t
        border-white/5
        bg-ink-950/80
      ">


        <div className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          px-5
          py-12
          sm:grid-cols-2
          lg:grid-cols-4
        ">


          <div>

            <Logo />

            <p className="
              mt-3
              text-sm
              text-slate-500
            ">

              Plataforma brasileira para criar sites profissionais.

            </p>


          </div>





          <div>

            <h3 className="
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-slate-500
            ">

              Produto

            </h3>



            <div className="
              mt-3
              grid
              gap-2
              text-sm
              text-slate-400
            ">


              <a href="#recursos">
                Recursos
              </a>


              <a href="#templates">
                Templates
              </a>


              <a href="#editor">
                Editor
              </a>


              <Link href="/precos">
                Planos
              </Link>


            </div>


          </div>






          <div>

            <h3 className="
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-slate-500
            ">

              Conta

            </h3>



            <div className="
              mt-3
              grid
              gap-2
              text-sm
              text-slate-400
            ">


              <Link href="/login">
                Entrar
              </Link>


              <Link href="/cadastro">
                Criar conta
              </Link>


              <Link href="/dashboard">
                Painel
              </Link>


            </div>


          </div>






          <div>

            <h3 className="
              text-xs
              font-bold
              uppercase
              tracking-widest
              text-slate-500
            ">

              Em breve

            </h3>



            <div className="
              mt-3
              grid
              gap-2
              text-sm
              text-slate-500
            ">


              <span>
                Mercado Pago
              </span>


              <span>
                Marketplace de templates
              </span>


              <span>
                Loja de plugins
              </span>


            </div>


          </div>



        </div>





        <div className="
          border-t
          border-white/5
          py-5
          text-center
          text-xs
          text-slate-600
        ">


          © {new Date().getFullYear()} KartFusion · Feito no Brasil 🇧🇷


        </div>


      </footer>



    </div>
  );

}