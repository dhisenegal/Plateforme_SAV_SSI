"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllMaintenances } from "@/actions/sav/maintenance";

// Type pour les données de maintenance basé sur votre schéma Prisma
type MaintenanceData = {
  id: number;
  numero: string;
  dateMaintenance: Date;
  description: string;
  statut: "PLANIFIE" | "EN_COURS" | "SUSPENDU" | "TERMINE" | "NON_PLANIFIE";
  typeMaintenance: string;
  Site: {
    nom: string;
    Client: {
      nom: string;
    };
  };
  Installation: {
    Systeme: {
      nom: string;
    };
  };
  Contact: {
    Client: {
      nom: string;
    };
  };
  Technicien: {
    nom: string;
    prenom: string;
  };
};

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function PlanningPage() {
  const [maintenances, setMaintenances] = useState<MaintenanceData[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const { maintenances } = await getAllMaintenances();
        setMaintenances(maintenances);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      }
    };

    fetchMaintenances();
  }, []);

  const events = maintenances.map((maintenance) => ({
    id: maintenance.id,
    title: `${maintenance.Contact.Client.nom} - ${maintenance.typeMaintenance}`,
    start: new Date(maintenance.dateMaintenance),
    end: new Date(maintenance.dateMaintenance),
    resource: maintenance, // Stocke toutes les données de maintenance pour le modal
  }));

  const getEventStyle = (event: any) => {
    const colors = {
      PLANIFIE: "bg-blue-500",
      SUSPENDU: "bg-red-500",
      TERMINE: "bg-green-500",
      EN_COURS: "bg-yellow-500",
      NON_PLANIFIE: "bg-gray-500"
    };

    const status = event.resource.statut;
    return {
      className: `${colors[status] || "bg-gray-500"} text-white rounded-md p-1`
    };
  };

  const handleEventSelect = (event: any) => {
    setSelectedMaintenance(event.resource);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planning des Maintenances</h1>
        
        <div className="flex gap-2">
          {Object.entries({
            PLANIFIE: "Planifié",
            EN_COURS: "En cours",
            SUSPENDU: "Suspendu",
            TERMINE: "Terminé",
            NON_PLANIFIE: "Non planifié"
          }).map(([status, label]) => (
            <Badge key={status} variant="outline" className={`${getEventStyle({ resource: { statut: status } }).className}`}>
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        culture="fr"
        eventPropGetter={getEventStyle}
        onSelectEvent={handleEventSelect}
        views={["month", "week", "day"]}
        messages={{
          next: "Suivant",
          previous: "Précédent",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour"
        }}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedMaintenance && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedMaintenance.Contact.Client.nom}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Numéro</p>
                      <p>{selectedMaintenance.numero}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Type de maintenance</p>
                      <p>{selectedMaintenance.typeMaintenance}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Site</p>
                      <p>{selectedMaintenance.Site.nom}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Système</p>
                      <p>{selectedMaintenance.Installation.Systeme.nom}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Technicien</p>
                      <p>{`${selectedMaintenance.Technicien.prenom} ${selectedMaintenance.Technicien.nom}`}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Date</p>
                      <p>{format(new Date(selectedMaintenance.dateMaintenance), 'dd/MM/yyyy')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold">Statut</p>
                      <Badge className={getEventStyle({ resource: selectedMaintenance }).className}>
                        {selectedMaintenance.statut}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Description</h3>
                  <p>{selectedMaintenance.description}</p>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}