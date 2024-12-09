import Sidebar from "@/components/sav/Sidebar";
import Navbar from "@/components/sav/Nav";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar spécifique à l'admin */}
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar />
        <div className="p-8"> {/* Contenu principal */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;