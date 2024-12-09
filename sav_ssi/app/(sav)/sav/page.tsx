"use client";

import React from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaClipboardList,
  FaCalendarAlt,
  FaPauseCircle,
  FaTools,
  FaUserAlt,
  FaTasks,
  FaWarehouse,
  FaCalendarCheck,
} from "react-icons/fa";
import { FaPersonChalkboard } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";

const SavPage = () => {
  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="p-4 bg-white rounded-md shadow-md hover:bg-green-200 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-200 rounded-full">
              <FaCheckCircle size={24} className="text-green-700" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">10</p>
              <span>Interventions validées aujourd'hui</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-slate-200 rounded-full">
              <FaClipboardList size={24} className="text-gray-400" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">20</p>
              <span>Interventions à faire</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow-md hover:bg-purple-200 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-200 rounded-full">
              <FaCalendarAlt size={24} className="text-purple-400" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">15</p>
              <span>Interventions planifiées</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-md shadow-md hover:bg-red-200 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-200 rounded-full">
              <FaPauseCircle size={24} className="text-red-700" />
            </div>
            <div>
              <p className="text-xl md:text-2xl font-bold">5</p>
              <span>Interventions suspendues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-4">
          Accès rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Link href="/admin/maintenances" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaTools size={24} className="text-gray-700 mb-2" />
            <span>Maintenances</span>
          </Link>
          <Link href="/admin/interventions" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaTasks size={24} className="text-gray-700 mb-2" />
            <span>Interventions</span>
          </Link>
          <Link href="/admin/clients" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaUserAlt size={24} className="text-gray-700 mb-2" />
            <span>Clients</span>
          </Link>
          <Link href="/admin/techniciens" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaPersonChalkboard size={24} className="text-gray-700 mb-2" />
            <span>Techniciens</span>
          </Link>
          <Link href="/admin/planning" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaCalendarCheck size={24} className="text-gray-700 mb-2" />
            <span>Planning</span>
          </Link>
          <Link href="/admin/equipements" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <FaWarehouse size={24} className="text-gray-700 mb-2" />
            <span>Équipements</span>
          </Link>
          <Link href="/admin/rapports" className="p-4 bg-white rounded-md shadow-md hover:bg-gray-200 transition-colors">
            <TbReportSearch size={24} className="text-gray-700 mb-2" />
            <span>Rapports</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SavPage;