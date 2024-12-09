"use client";

import React, { useState } from "react";
import { FaBars, FaTimes, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import {
  FaTasks,
  FaCalendarCheck,
  FaWarehouse,
} from "react-icons/fa";
import {FaHouse,
  FaPersonChalkboard,} from "react-icons/fa6";
import { TbPresentationAnalytics, TbReportSearch } from "react-icons/tb";
import { AiFillTool } from "react-icons/ai";

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
        <button
          onClick={toggleMenu}
          className="text-gray-800 bg-white p-2 rounded-full shadow-lg"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 z-40 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>

        {/* Navigation Scrollable */}
        <ul className="space-y-4 overflow-y-auto h-[calc(100vh-180px)] scrollbar-hide">
          <li>
            <Link
              href="/sav"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaHouse size={20} />
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/maintenances"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <AiFillTool size={20} />
              <span>Maintenances</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/interventions"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaTasks size={20} />
              <span>Interventions</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/clients"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaUserAlt size={20} />
              <span>Clients</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/techniciens"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaPersonChalkboard size={20} />
              <span>Techniciens</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/planning"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <FaCalendarCheck size={20} />
              <span>Planning</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/rapports"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <TbReportSearch size={20} />
              <span>Rapports</span>
            </Link>
          </li>
          <li>
            <Link
              href="/sav/reportings"
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              <TbPresentationAnalytics size={20} />
              <span>Reportings</span>
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
