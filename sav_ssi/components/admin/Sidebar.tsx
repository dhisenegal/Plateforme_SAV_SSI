"use client";

import React, { useState } from "react";
import { FaBars, FaTimes, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { FaHouse, FaPersonChalkboard } from "react-icons/fa6";
import { TbReportSearch } from "react-icons/tb";
import { AiFillTool } from "react-icons/ai";
import { FaTasks, FaCalendarCheck, FaWarehouse } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction pour gérer l'ouverture du menu hamburger
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton Hamburger pour les petits écrans */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleMenu} className="text-white">
          {isOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="rounded-full" />
        </div>

        {/* Navigation Scrollable */}
        <ul className="space-y-4 overflow-y-auto h-[calc(100vh-180px)] scrollbar-hide">
          <li>
            <Link
              href="/admin"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaHouse size={20} />
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/maintenances"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <AiFillTool size={20} />
              <span>Maintenances</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/interventions"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaTasks size={20} />
              <span>Interventions</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/clients"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaUserAlt size={20} />
              <span>Clients</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/techniciens"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaPersonChalkboard size={20} />
              <span>Techniciens</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/planning"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaCalendarCheck size={20} />
              <span>Planning</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/equipements"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaWarehouse size={20} />
              <span>Équipements</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/rapports"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <TbReportSearch size={20} />
              <span>Rapports</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay pour fermer le menu sur mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
