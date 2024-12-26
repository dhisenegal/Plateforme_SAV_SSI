"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FaSpinner } from "react-icons/fa";

const SitesTabContent = dynamic(() => import("@/components/sav/SitesTabContent"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center gap-3">
    <FaSpinner className="animate-spin" />
     Chargement en cours...</div>,
});
const ContratTabContent = dynamic(() => import("@/components/sav/ContratTabContent"), {
  ssr: false,
});
const MaintenancesPage = () => {
  const [activeTab, setActiveTab] = useState("sites");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Add navigation logic here if needed
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-6 border-b-2 border-gray-200">
        <button
          className={`py-2 px-4 ${activeTab === "sites" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
          onClick={() => handleTabChange("sites")}
        >
          Mes Sites
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "equipments" ? "border-b-4 border-blue-500 text-blue-500" : "border-b-4 border-transparent text-gray-500"}`}
          onClick={() => handleTabChange("equipments")}
        >
          Mes Contrats
        </button>
      </div>

      {activeTab === "sites" && (
        <div>
          <SitesTabContent />
        </div>
      )}

      {activeTab === "equipments" && (
        <div>
          <ContratTabContent />
        </div>
      )}
    </div>
  );
};

export default MaintenancesPage;