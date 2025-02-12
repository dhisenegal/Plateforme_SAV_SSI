"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaEye, FaArrowLeft, FaArrowRight, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getType, getPlanning, fetchDetails } from "@/actions/technicien/planning";

const PlanningTabContent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const technicienId = session?.user?.id;

  const [currentPlanning, setCurrentPlanning] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlanning();
   
  }, [currentPage]);

  const fetchPlanning = async () => {
    setLoading(true);
    try {
      // Récupère la liste du planning pour la page actuelle
      const planningData = await getPlanning(technicienId);
      const planningWithDetails = await Promise.all(
        planningData.map(async (plan) => {
          const type = await getType(plan);
          if (!plan.id || type === "Type inconnu") {
            console.error(
              `Erreur: ID ou type manquant ou inconnu pour le plan ${JSON.stringify(plan)}`
            );
            return null;
          }

          const {
            clientName,
            description,
            statut,
            urgent,
            technicienName,
            datePlanifiee,
            systeme,
          } = await fetchDetails(plan.id, type);

          return {
            ...plan,
            client: clientName,
            description,
            statut,
            date: datePlanifiee,
            urgent,
            technicienName,
            systeme,
            type,
          };
        })
      );

      const filteredPlanning = planningWithDetails.filter(
        (plan) => plan && plan.statut !== "TERMINE"
      );
      setCurrentPlanning(filteredPlanning);
  
      const urgentCount = filteredPlanning.filter((p) => p.urgent).length;
      localStorage.setItem("urgentInterventionsCount", String(urgentCount));
    } catch (error) {
      console.error("Erreur lors de la récupération du planning :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">  
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">PLANNING</h2>
        {loading && (
          <div className="text-sm text-gray-500 animate-pulse">Chargement...</div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Urgence</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPlanning.map((plan, index) => (
            <TableRow
              key={`${plan.id}-${index}`}
              className={`cursor-pointer hover:bg-blue-100 ${plan.urgent ? "bg-red-50" : ""}`}
              onClick={() => router.push(`/technicien/Planning/${plan.id}?type=${plan.type}`)}
            >
              <TableCell>
                {plan.date ? new Date(plan.date).toLocaleDateString() : "Non défini"}
              </TableCell>
              <TableCell>{plan.client}</TableCell>
              <TableCell>{plan.description}</TableCell>
              <TableCell>{plan.type}</TableCell>
              <TableCell>{plan.statut || "Non défini"}</TableCell>
              <TableCell>
                {plan.urgent ? (
                  <div className="flex items-center text-red-600">
                    <FaExclamationTriangle className="mr-2" />
                    <span className="text-sm font-semibold">Urgent</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <Link
                  href={`/technicien/Planning/${plan.id}?type=${plan.type}`}
                  passHref
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEye className="text-blue-500 cursor-pointer" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end items-center mt-4 gap-2">
        <span>Page {currentPage}</span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || loading}
          className="bg-blue-500 flex items-center"
        >
          <FaArrowLeft className="mr-1" />
        </Button>
        <Button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={loading}
          className="bg-blue-500 flex items-center"
        >
          <FaArrowRight className="ml-1" />
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PlanningTabContent;