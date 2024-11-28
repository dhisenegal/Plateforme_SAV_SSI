import Sidebar from "@/components/admin/Sidebar1";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      {/* Sidebar spécifique à l'admin */}
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        {" "}
        {/* Contenu principal */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
