"use client";

import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getInterventionDelayAnalytics, DelayAnalytics } from "@/actions/sav/analytic";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportingsPage = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [analytics, setAnalytics] = useState<DelayAnalytics>({ 
    onTime: 0, 
    delayed: 0, 
    interventions: [] 
  });
  const [loading, setLoading] = useState(false);

  // Fonction pour formater la date en YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Fonction pour charger les données
  const loadData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const result = await getInterventionDelayAnalytics(start, end);
      setAnalytics(result);
      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    } catch (error) {
      console.error("Error fetching analytics:", error);
      alert("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données des 7 derniers jours au chargement initial
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    loadData(start, end);
  }, []);

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner une période");
      return;
    }

    await loadData(new Date(startDate), new Date(endDate));
  };

  const data = {
    labels: ["Dans les délais (≤48h)", "Hors délais (>48h)"],
    datasets: [
      {
        data: [analytics.onTime, analytics.delayed],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
      },
    ],
  };

  const total = analytics.onTime + analytics.delayed;
  const onTimePercentage = total > 0 ? ((analytics.onTime / total) * 100).toFixed(1) : "0";
  const delayedPercentage = total > 0 ? ((analytics.delayed / total) * 100).toFixed(1) : "0";

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analyse des Délais d'Intervention</h1>
      
      <div className="flex space-x-4 mb-6">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-48"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-48"
        />
        <Button 
          onClick={handleFilter} 
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? "Chargement..." : "Filtrer"}
        </Button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow h-[400px] w-[400px]">
            <h3 className="text-lg font-semibold mb-2">Statistiques</h3>
            <p>Total des interventions: {total}</p>
            <p>Dans les délais: {analytics.onTime} ({onTimePercentage}%)</p>
            <p>Hors délais: {analytics.delayed} ({delayedPercentage}%)</p>
          </div>
          {total > 0 && (
            <div className="bg-white p-4 rounded-lg shadow h-[400px] w-[400px]">
              <Pie data={data} />
            </div>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Date de déclaration</TableHead>
            <TableHead>Date d'intervention</TableHead>
            <TableHead>Système</TableHead>
            <TableHead>Délai (heures)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analytics.interventions.map((intervention) => (
            <TableRow key={intervention.id}>
              <TableCell>{intervention.client || "N/A"}</TableCell>
              <TableCell>{intervention.technicien || "N/A"}</TableCell>
              <TableCell>
                {new Date(intervention.dateDeclaration).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {intervention.dateIntervention
                  ? new Date(intervention.dateIntervention).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>{intervention.systeme || "N/A"}</TableCell>
              <TableCell>{Math.round(intervention.delayInHours)}h</TableCell>
              <TableCell>
                {intervention.isOnTime ? (
                  <FaCheckCircle className="text-green-500" />
                ) : (
                  <FaTimesCircle className="text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportingsPage;