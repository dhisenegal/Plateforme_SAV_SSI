"use client";

import React, { useState } from "react";
import { FaBell, FaMoon, FaUserAlt, FaBars } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    signOut(); // Déconnexion via next-auth
    
  };

  const handleManageAccount = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <button className="text-gray-800 bg-white p-2 rounded-full shadow-lg lg:hidden">
            <FaBars size={24} />
          </button>
          <input
            type="text"
            placeholder="Rechercher..."
            className="hidden lg:block p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-800 bg-white p-2 rounded-full shadow-lg">
            <FaMoon size={24} />
          </button>
          <button className="text-gray-800 bg-white p-2 rounded-full shadow-lg">
            <FaBell size={24} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex justify-center items-center bg-white p-4 rounded-full shadow-md hover:bg-gray-200 transition-colors">
                <FaUserAlt size={24} className="text-gray-700" />
                <span className="hidden lg:block">{session?.user?.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={handleManageAccount}>
                Gérer mon compte
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleLogout}>
                <Link href="/" className="text-red-700">Déconnexion</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modal pour gérer le compte */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Changer le mot de passe</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Ancien mot de passe</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 bg-gray-500 text-white rounded-md"
                >
                  Annuler
                </button>
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;