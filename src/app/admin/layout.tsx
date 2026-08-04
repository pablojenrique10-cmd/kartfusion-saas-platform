import Sidebar from "@/components/admin/Sidebar";
import AdminNotifications from "@/components/AdminNotifications";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <div className="
    min-h-screen
    bg-zinc-950
    text-white
    flex
    ">


      <Sidebar />



      <main className="
      flex-1
      p-8
      ">



        <div className="
        flex
        justify-end
        mb-6
        ">

          <AdminNotifications />

        </div>



        {children}



      </main>



    </div>

  );

}