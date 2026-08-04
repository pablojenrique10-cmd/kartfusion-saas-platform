"use client";

import { useEffect, useState } from "react";


type Notification = {

  id:string;

  title:string;

  message:string;

  read:boolean;

  createdAt:string;

};




export default function AdminNotifications(){


  const [notifications,setNotifications] =
  useState<Notification[]>([]);


  const [open,setOpen] =
  useState(false);






  async function loadNotifications(){


    const res = await fetch(
      "/api/admin/notifications"
    );


    const data =
    await res.json();


    setNotifications(data);


  }






  useEffect(()=>{


    loadNotifications();


    const interval =
    setInterval(
      loadNotifications,
      30000
    );


    return ()=>
    clearInterval(interval);


  },[]);







  async function markRead(
    id:string
  ){


    await fetch(
      `/api/admin/notifications/${id}`,
      {

        method:"PATCH"

      }
    );


    loadNotifications();


  }






  const unread =
  notifications.filter(
    item =>
    !item.read
  ).length;







  return (

    <div className="
    relative
    ">



      <button

      onClick={()=>
        setOpen(!open)
      }

      className="
      relative
      text-2xl
      "

      >

        🔔


        {
          unread > 0 &&

          <span className="
          absolute
          -top-2
          -right-2
          bg-red-600
          text-white
          text-xs
          rounded-full
          px-2
          py-1
          ">

            {unread}

          </span>

        }


      </button>








      {
        open &&


        <div className="
        absolute
        right-0
        mt-3
        w-80
        bg-zinc-900
        border
        border-zinc-800
        rounded-2xl
        p-4
        z-50
        ">


          <h3 className="
          font-bold
          mb-4
          ">

            🔔 Notificações

          </h3>





          {
            notifications.length === 0

            ?

            <p className="text-zinc-400">

              Nenhuma notificação

            </p>


            :


            notifications.slice(0,5)
            .map(item=>(


              <button

              key={item.id}

              onClick={()=>
                markRead(item.id)
              }

              className="
              w-full
              text-left
              bg-zinc-800
              rounded-xl
              p-3
              mb-3
              "

              >


                <p className="font-bold">

                  {item.title}

                </p>


                <p className="text-sm text-zinc-400">

                  {item.message}

                </p>


              </button>


            ))


          }



        </div>


      }



    </div>

  );


}