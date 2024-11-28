"use client";

import React from "react";
<<<<<<< HEAD
=======
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaTools,
  FaClipboardList,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

// Données pour le graphique des demandes
const demandeData = [
  { name: "Extincteurs", value: 25 },
  { name: "Alarmes", value: 15 },
  { name: "Sprinklers", value: 10 },
  { name: "Autres", value: 20 },
];

// Données pour le graphique des statuts d'interventions
const statutData = [
  { name: "En Cours", value: 35 },
  { name: "Terminé", value: 75 },
  { name: "Planifié", value: 10 },
];

const COLORS = ["#1D4ED8", "#F59E0B", "#10B981", "#EF4444"];

const AdminPage = () => {
<<<<<<< HEAD
=======
  const { data: session } = useSession(); 

  const handleLogout = () => {
    signOut(); // Déconnexion via next-auth
  };
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
  const barChartData = [
    { month: "Janvier", requests: 120 },
    { month: "Février", requests: 200 },
    { month: "Mars", requests: 150 },
    { month: "Avril", requests: 250 },
    { month: "Mai", requests: 300 },
    { month: "Juin", requests: 100 },
    { month: "Juillet", requests: 50 },
    { month: "Août", requests: 75 },
    { month: "Septembre", requests: 100 },
    { month: "Octobre", requests: 150 },
    { month: "Novembre", requests: 200 },
    { month: "Décembre", requests: 250 },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 mb-6 text-center">
        Tableau de bord Administrateur
      </h1>

<<<<<<< HEAD
=======
      {/* Section déconnexion */}
      {session && (
        <Link href="/" onClick={handleLogout} 
        className="ml-4 hover:text-blue-400 cursor-pointer">
          Déconnexion
        </Link>
      )}

>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-blue-300">
          <CardHeader className="flex items-center space-x-4">
            <FaTools size={24} className="text-blue-700" />
            <CardTitle>Total Demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">120</p>
          </CardContent>
        </Card>

        <Card className="bg-yellow-300">
          <CardHeader className="flex items-center space-x-4">
            <FaClipboardList size={24} className="text-yellow-700" />
            <CardTitle>En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">35</p>
          </CardContent>
        </Card>

        <Card className="bg-green-300">
          <CardHeader className="flex items-center space-x-4">
            <FaCheckCircle size={24} className="text-green-700" />
            <CardTitle>Terminé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">75</p>
          </CardContent>
        </Card>

        <Card className="bg-red-300">
          <CardHeader className="flex items-center space-x-4">
            <FaCalendarAlt size={24} className="text-red-700" />
            <CardTitle>Planifié Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl md:text-2xl font-bold">10</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Nombre de Demandes par Mois</CardTitle>
            <CardDescription>
              Évolution des demandes de Janvier à Décembre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <Tooltip />
                <Bar dataKey="requests" fill="#1D4ED8">
                  <LabelList dataKey="requests" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Demandes par Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demandeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {demandeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
