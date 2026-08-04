"use client";

import { useState } from "react";


interface Props {

  userId:string;

  currentRole:string;

}



export default function UserRoleSelect({
  userId,
  currentRole,
}:Props){


  const [role,setRole] =
  useState(currentRole);


  const [loading,setLoading] =
  useState(false);


  const [message,setMessage] =
  useState("");




  async function save(){


    setLoading(true);

    setMessage("");



    const res = await fetch(
      `/api/admin/users/${userId}/role`,
      {

        method:"PATCH",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          role
        })

      }
    );



    if(res.ok){

      setMessage(
        "✅ Cargo atualizado"
      );

    }else{

      setMessage(
        "❌ Erro ao atualizar"
      );

    }



    setLoading(false);


  }





  return (

    <div className="
    flex
    flex-col
    gap-3
    ">


      <select

      value={role}

      onChange={(e)=>
        setRole(e.target.value)
      }

      className="
      rounded-xl
      border
      border-zinc-700
      bg-zinc-950
      px-4
      py-3
      "
      >

        <option value="owner">
          👑 Owner
        </option>

        <option value="admin">
          🛡️ Admin
        </option>

        <option value="moderator">
          🔧 Moderador
        </option>

        <option value="client">
          👤 Cliente
        </option>


      </select>




      <button

      onClick={save}

      disabled={loading}

      className="
      rounded-xl
      bg-green-500
      px-5
      py-3
      font-bold
      text-black
      hover:bg-green-400
      "
      >

        {
          loading
          ?
          "Salvando..."
          :
          "Salvar cargo"
        }


      </button>



      {
        message &&
        <p className="text-sm text-zinc-400">
          {message}
        </p>
      }


    </div>

  );


}