import React from "react";
import { FaClipboardList, FaTasks, FaUserAlt, FaCalendarCheck, FaWarehouse } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-700 text-white p-6 fixed">
      <Image src="/logo.svg" alt="Logo" width={100} height={100} />
      
      {/* Navigation */}
      <ul className="space-y-4">
        <li>
          <Link 
            href="/admin/demandes"
            className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600"
          >
            <FaClipboardList size={20} />
            <span>Demandes de maintenance</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/interventions" 
            className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600"
          >
            <FaTasks size={20} />
            <span>Demandes Interventions</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/utilisateurs" 
            className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600"
          >
            <FaUserAlt size={20} />
            <span>Gestion Utilisateurs</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/planning" 
            className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600"
          >
            <FaCalendarCheck size={20} />
            <span>Gestion Planning</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/admin/equipements" 
            className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600"
          >
            <FaWarehouse size={20} />
            <span>Gestion Équipements</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
