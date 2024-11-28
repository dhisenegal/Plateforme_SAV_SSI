"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { ModeToggle } from "./mode-toggle";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex justify-between items-center py-4 px-8 shadow-lg fixed w-full bg-white z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Image src="/logo.svg" alt="Logo" width={100} height={100} />
      </div>

      {/* Menu Desktop */}
      <ul className="hidden md:flex space-x-6">
        <li>
          <Link href="#services" className="text-gray-700 hover:text-blue-600">
            Services
          </Link>
        </li>
        <li>
          <Link href="#features" className="text-gray-700 hover:text-blue-600">
            Fonctionnalités
          </Link>
        </li>
        <li>
          <Link href="#workflow" className="text-gray-700 hover:text-blue-600">
            Processus
          </Link>
        </li>
        <li>
          <Link href="#testimonials" className="text-gray-700 hover:text-blue-600">
            Avis
          </Link>
        </li>
      </ul>

     <div className="flex items-center space-x-4">
      <ModeToggle />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hidden md:block">
          <Link href="/auth/login">Connexion</Link>
        </button>
     </div>
      
      {/* Icône Hamburger pour Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link href="#services" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
                Services
              </Link>
            </li>
            <li>
              <Link href="#features" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
                Fonctionnalités
              </Link>
            </li>
            <li>
              <Link href="#workflow" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
                Processus
              </Link>
            </li>
            <li>
              <Link href="#testimonials" onClick={toggleMenu} className="text-gray-700 hover:text-blue-600">
                Avis
              </Link>
            </li>
            <li>
              <button onClick={toggleMenu} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Connexion
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
