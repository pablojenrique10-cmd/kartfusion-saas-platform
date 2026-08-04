import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { getCurrentUser } from "@/lib/auth";
import { TRIAL_DAYS, formatPrice } from "@/lib/plans";

import { db } from "@/db";
import { plans } from "@/db/schema";
import { desc } from "drizzle-orm";


export const metadata: Metadata = {
  title: "Planos e preços",
};


export const dynamic = "force-dynamic";



const FAQ = [
  {
    q: "Como funciona o teste grátis?",
    a: `Todo novo usuário recebe automaticamente ${TRIAL_DAYS} dias com o plano Premium completo, sem limitações e sem cartão de crédito.`,
  },

  {
    q: "O que acontece quando o teste acaba?",
    a: "Seus projetos continuam salvos. Apenas os recursos Premium ficam bloqueados até você contratar um plano.",
  },

  {
    q: "Posso trocar de plano depois?",
    a: "Sim. Você pode fazer upgrade ou downgrade a qualquer momento direto no painel.",
  },

  {
    q: "Posso usar meu próprio domínio?",
    a: "Sim, no plano Premium. Nos outros planos o site utiliza o endereço padrão do KartFusion.",
  },
];





export default async function PricingPage() {


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
        h-[480px]
        w-[840px]
        -translate-x-1/2
        rounded-full
        bg-fusion-500/18
        blur-[140px]
        " />

        <div className="
        absolute
        inset-0
        grid-noise
        opacity-35
        " />

      </div>







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



          <div className="
          flex
          items-center
          gap-2.5
          ">


            <Link
              href="/"
              className="kf-btn kf-btn-ghost"
            >
              Início
            </Link>



            <Link
              href={
                user
                ? "/dashboard"
                : "/cadastro"
              }
              className="kf-btn kf-btn-primary"
            >

              {
                user
                ? "Painel"
                : "Criar grátis"
              }

            </Link>



          </div>


        </div>


      </header>








      <section className="
      mx-auto
      w-full
      max-w-7xl
      px-5
      py-20
      text-center
      ">



        <span className="
        kf-chip
        mx-auto
        text-neon-400
        ">
          Planos
        </span>





        <h1 className="
        mt-5
        text-4xl
        font-extrabold
        tracking-tight
        text-white
        sm:text-5xl
        ">

          Preços simples e transparentes

        </h1>





        <p className="
        mx-auto
        mt-4
        max-w-xl
        text-slate-400
        ">

          Comece com {TRIAL_DAYS} dias de Premium liberado.
          Depois escolha o plano ideal para seu negócio.

        </p>









        <div className="
        mt-14
        grid
        gap-5
        text-left
        lg:grid-cols-3
        ">





        {
          PLANS.map((plan)=>(


          <article

          key={plan.id}

          className={`kf-card kf-card-hover relative p-7 ${
            plan.highlighted
            ? "border-fusion-500/50"
            : ""
          }`}

          >





          {
            plan.highlighted && (

            <span className="
            absolute
            -top-3
            left-7
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






          <h2 className="
          text-lg
          font-extrabold
          text-white
          ">

            {plan.name}

          </h2>





          <p className="
          mt-1.5
          min-h-[42px]
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








          <div className="
          mt-4
          grid
          grid-cols-3
          gap-2
          rounded-xl
          border
          border-white/5
          bg-white/[0.02]
          p-3
          text-center
          ">


            <div>

              <p className="
              text-sm
              font-bold
              text-white
              ">

                {
                  plan.maxSites > 100
                  ? "∞"
                  : plan.maxSites
                }

              </p>

              <p className="
              text-[10px]
              text-slate-500
              ">
                sites
              </p>

            </div>





            <div>

              <p className="
              text-sm
              font-bold
              text-white
              ">

                {
                  plan.maxPages > 100
                  ? "∞"
                  : plan.maxPages
                }

              </p>

              <p className="
              text-[10px]
              text-slate-500
              ">
                páginas
              </p>

            </div>






            <div>

              <p className="
              text-sm
              font-bold
              text-white
              ">

              {
                plan.storageMb >= 1000
                ? `${plan.storageMb / 1000}GB`
                : `${plan.storageMb}MB`
              }

              </p>

              <p className="
              text-[10px]
              text-slate-500
              ">
                mídia
              </p>

            </div>



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
              ">

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









          <Link

          href={
            user
            ? "/dashboard/planos"
            : "/cadastro"
          }

          className={`kf-btn mt-7 w-full ${
            plan.highlighted
            ? "kf-btn-primary"
            : "kf-btn-ghost"
          }`}

          >

          {
            user
            ? "Escolher plano"
            : `Testar ${TRIAL_DAYS} dias grátis`
          }

          </Link>







          </article>


          ))

        }




        </div>









        <div className="
        mx-auto
        mt-20
        max-w-3xl
        text-left
        ">


          <h2 className="
          text-center
          text-2xl
          font-extrabold
          text-white
          ">

            Perguntas frequentes

          </h2>





          <div className="
          mt-8
          grid
          gap-3
          ">



          {
            FAQ.map((item)=>(

            <details

            key={item.q}

            className="
            kf-card
            group
            p-5
            "

            >


              <summary className="
              cursor-pointer
              list-none
              text-sm
              font-semibold
              text-white
              ">

                <span className="
                mr-2
                text-fusion-400
                transition
                group-open:rotate-90
                inline-block
                ">

                  ▸

                </span>


                {item.q}


              </summary>





              <p className="
              mt-3
              pl-5
              text-sm
              leading-relaxed
              text-slate-400
              ">

                {item.a}

              </p>



            </details>

            ))
          }



          </div>


        </div>





      </section>






      <footer className="
      border-t
      border-white/5
      py-8
      text-center
      text-xs
      text-slate-600
      ">

        © {new Date().getFullYear()} KartFusion · Todos os direitos reservados

      </footer>



    </div>

  );

}