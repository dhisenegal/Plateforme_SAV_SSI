"use client";

import React, { useState } from "react";
import { FaBars, FaTimes, FaUserAlt, FaChevronDown, FaWarehouse, FaTachometerAlt } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { MdSettings } from "react-icons/md";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEquipmentsOpen, setIsEquipmentsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);

  // Fonction pour gérer l'ouverture du menu hamburger
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fonction pour gérer l'ouverture du sous-menu "Gestion des équipements"
  const toggleEquipmentsMenu = () => {
    setIsEquipmentsOpen(!isEquipmentsOpen);
  };

  // Fonction pour gérer l'ouverture du sous-menu "Gestion des utilisateurs"
  const toggleUsersMenu = () => {
    setIsUsersOpen(!isUsersOpen);
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
              <FaTachometerAlt size={20} />
              <span>Tableau de bord</span>
            </Link>
          </li>
          <li>
            <button
              onClick={toggleUsersMenu}
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors w-full text-left"
            >
              <FaUserAlt size={20} />
              <span>Gestion des utilisateurs</span>
              <FaChevronDown className={`ml-auto transform ${isUsersOpen ? "rotate-180" : ""}`} />
            </button>
            {isUsersOpen && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link
                    href="/admin/utilisateurs/roles"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaUserAlt size={16} />
                    <span>Rôles</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/utilisateurs"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaUserAlt size={16} />
                    <span>Utilisateurs</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={toggleEquipmentsMenu}
              className="flex items-center space-x-3 p-3 rounded-md hover:bg-blue-600 transition-colors w-full text-left"
            >
              <MdSettings size={20} />
              <span>Gestion des équipements</span>
              <FaChevronDown className={`ml-auto transform ${isEquipmentsOpen ? "rotate-180" : ""}`} />
            </button>
            {isEquipmentsOpen && (
              <ul className="pl-6 space-y-2">
                <li>
                  <Link
                    href="/admin/equipements/systeme"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaWarehouse size={16} />
                    <span>Système</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/equipements/marque"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaWarehouse size={16} />
                    <span>Marque</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/equipements/modele"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaWarehouse size={16} />
                    <span>Modèle</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/equipements"
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FaWarehouse size={16} />
                    <span>Equipements</span>
                  </Link>
                </li>
              </ul>
            )}
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