"use client";

import { TRIAL_DAYS, formatPrice, PLANS } from "@/lib/plans";

interface Props {
  currentPlanId: string;
  trialing: boolean;
  trialDaysLeft: number;
}

export default function PlanSelector({
  currentPlanId,
  trialing,
  trialDaysLeft,
}: Props) {

  const WHATSAPP_NUMBER = "5543996317934";


  function whatsapp(planName: string) {

    const message =
      `Olá, quero ativar o plano ${planName} do KartFusion.`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  }


  return (
    <div className="grid gap-5">


      {trialing && (
        <div className="
        rounded-2xl
        border
        border-neon-500/25
        bg-neon-500/8
        p-5
        ">

          <p className="text-sm font-bold text-neon-400">

            🎁 Você está no período de teste Premium — {trialDaysLeft}{" "}
            {trialDaysLeft === 1 ? "dia restante" : "dias restantes"}

          </p>


          <p className="
          mt-1.5
          text-xs
          text-slate-300
          ">

            Aproveite todos os recursos. 
            Para continuar usando após o teste,
            solicite a ativação do seu plano pelo WhatsApp.

          </p>


        </div>
      )}





      <div className="
      grid
      gap-5
      lg:grid-cols-3
      ">


        {PLANS.map((plan)=>{


          const active =
            plan.id === currentPlanId;



          return (

            <article

              key={plan.id}

              className={`
              kf-card
              relative
              p-7
              ${
                plan.highlighted
                ? "border-fusion-500/45"
                : ""
              }
              `}

            >



              {active && (

                <span className="
                absolute
                -top-3
                left-7
                rounded-full
                bg-neon-500
                px-3
                py-1
                text-[10px]
                font-bold
                uppercase
                tracking-widest
                text-black
                ">

                  Plano atual

                </span>

              )}






              {plan.highlighted && !active && (

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

              )}






              <h3 className="
              text-lg
              font-extrabold
              text-white
              ">

                {plan.name}

              </h3>





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
              mt-4
              flex
              items-end
              gap-1
              ">


                <span className="
                text-3xl
                font-extrabold
                text-white
                ">

                  {formatPrice(plan.priceCents)}

                </span>



                <span className="
                mb-1
                text-xs
                text-slate-500
                ">

                  /mês

                </span>


              </div>








              <ul className="
              mt-6
              grid
              gap-2
              ">


                {plan.features.map((feature)=>(

                  <li

                    key={feature}

                    className="
                    flex
                    items-start
                    gap-2
                    text-[13px]
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









              <a

                href={whatsapp(plan.name)}

                target="_blank"

                rel="noopener noreferrer"

                className={`
                kf-btn
                mt-7
                block
                w-full
                text-center
                ${
                  plan.highlighted
                  ? "kf-btn-primary"
                  : "kf-btn-ghost"
                }
                `}

              >

                💬 Solicitar ativação

              </a>





            </article>


          );


        })}



      </div>








      <div className="
      kf-card
      p-6
      ">


        <h3 className="
        text-sm
        font-bold
        text-white
        ">

          Pagamentos

        </h3>



        <p className="
        mt-1.5
        text-xs
        text-slate-400
        ">

          A ativação dos planos é feita manualmente.
          Entre em contato pelo WhatsApp para contratar
          ou alterar seu plano.

        </p>


      </div>



    </div>
  );
}