"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const initialInterventions = [
  { id: "1", client: "Client 1", technician: "Technicien 1", requestDate: "2023-01-01", interventionDate: "2023-01-02", system: "Système 1" },
  { id: "2", client: "Client 2", technician: "Technicien 2", requestDate: "2023-01-01", interventionDate: "2023-01-04", system: "Système 2" },
  // Ajoutez plus de données fictives ici
];

const clients = ["Client 1", "Client 2", "Client 3"];

const ReportingsPage = () => {
  const [interventions, setInterventions] = useState(initialInterventions);
  const [filteredInterventions, setFilteredInterventions] = useState(initialInterventions);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    let filtered = interventions;


    if (startDate) {
      filtered = filtered.filter(intervention => new Date(intervention.requestDate) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(intervention => new Date(intervention.requestDate) <= new Date(endDate));
    }

    setFilteredInterventions(filtered);
  };

  const calculateDelays = (interventions) => {
    let onTime = 0;
    let late = 0;

    interventions.forEach(intervention => {
      const requestDate = new Date(intervention.requestDate);
      const interventionDate = new Date(intervention.interventionDate);
      const diffTime = Math.abs(interventionDate - requestDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) {
        onTime++;
      } else {
        late++;
      }
    });

    return { onTime, late };
  };

  const { onTime, late } = calculateDelays(filteredInterventions);

  const data = {
    labels: ["Sur délais", "Hors délais"],
    datasets: [
      {
        data: [onTime, late],
        backgroundColor: ["#4CAF50", "#F44336"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reportings</h1>
      <div className="flex space-x-4 mb-6">
        <Input
          type="date"
          placeholder="Date de début"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-48"
        />
        <Input
          type="date"
          placeholder="Date de fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-48"
        />
        <Button onClick={handleFilter} className="bg-blue-500 text-white">
          Filtrer
        </Button>
      </div>
      <div className="mb-6 flex justify-center">
        <div className="w-1/2 md:w-1/3 lg:w-1/4">
          <Pie data={data} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Date de demande</TableHead>
            <TableHead>Date d'intervention</TableHead>
            <TableHead>Système concerné</TableHead>
            <TableHead>Délais</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInterventions.map((intervention) => {
            const requestDate = new Date(intervention.requestDate);
            const interventionDate = new Date(intervention.interventionDate);
            const diffTime = Math.abs(interventionDate - requestDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isOnTime = diffDays <= 2;

            return (
              <TableRow key={intervention.id}>
                <TableCell>{intervention.client}</TableCell>
                <TableCell>{intervention.technician}</TableCell>
                <TableCell>{intervention.requestDate}</TableCell>
                <TableCell>{intervention.interventionDate}</TableCell>
                <TableCell>{intervention.system}</TableCell>
                <TableCell>
                  {isOnTime ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportingsPage;