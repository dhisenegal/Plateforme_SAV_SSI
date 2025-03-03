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

// Type pour les données de maintenance (basé sur votre schéma Prisma)
type MaintenanceData = {
  id: number;
  numero: string;
  datePlanifiee: Date;
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

  /**
   * Récupération de toutes les maintenances quand le composant se monte.
   */
  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const response = await getAllMaintenances();
        setMaintenances(response.maintenances);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      }
    };

    fetchMaintenances();
  }, []);

  /**
   * Mise en forme de la liste de maintenances pour le calendrier.
   * On utilise datePlanifiee comme start et end pour afficher l'événement sur la journée.
   */
  const events = maintenances.map((maintenance) => ({
    id: maintenance.id,
    title: `${maintenance.Contact.Client.nom} - ${maintenance.typeMaintenance}`,
    start: new Date(maintenance.datePlanifiee),
    end: new Date(maintenance.datePlanifiee),
    resource: maintenance,
  }));

  /**
   * Définition d'un style par statut pour colorer les événements.
   */
  const getEventStyle = (event: any) => {
    const colors = {
      PLANIFIE: "#3b82f6",    // Bleu pour Planifié
      SUSPENDU: "#ef4444",     // Rouge pour Suspendu
      TERMINE: "#22c55e",      // Vert pour Terminé
      EN_COURS: "#eab308",     // Jaune pour En cours
      NON_PLANIFIE: "#6b7280", // Gris pour Non planifié
    };
  
    const status = event.resource.statut;
    const backgroundColor = colors[status] || "#6b7280"; // Gris par défaut
  
    return {
      style: {
        backgroundColor,
        color: "white", // Texte en blanc pour un meilleur contraste
        borderRadius: "4px", // Coins arrondis
        padding: "2px", // Espacement interne
        border: "none", // Supprimer la bordure par défaut
      },
    };
  };

  const getBadgeClass = (status: string) => {
    const colors = {
      PLANIFIE: "bg-blue-500",    // Bleu pour Planifié
      SUSPENDU: "bg-red-500",     // Rouge pour Suspendu
      TERMINE: "bg-green-500",    // Vert pour Terminé
      EN_COURS: "bg-yellow-500",  // Jaune pour En cours
      NON_PLANIFIE: "bg-gray-500", // Gris pour Non planifié
    };
  
    return `${colors[status] || "bg-gray-500"} text-white rounded-md p-1`;
  };

  /**
   * Sur clic d'un événement, on ouvre le modal pour afficher les détails.
   */
  const handleEventSelect = (event: any) => {
    setSelectedMaintenance(event.resource);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planning des Maintenances</h1>

        {/* Légende des badges par statut */}
        <div className="flex gap-2">
  {Object.entries({
    PLANIFIE: "Planifié",
    EN_COURS: "En cours",
    SUSPENDU: "Suspendu",
    TERMINE: "Terminé",
    NON_PLANIFIE: "Non planifié",
  }).map(([status, label]) => (
    <Badge
      key={status}
      variant="outline"
      className={getBadgeClass(status)} // Utilisez getBadgeClass ici
    >
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
          day: "Jour",
        }}
      />

      {/* Modal de détails de la maintenance */}
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
                      <p>{format(new Date(selectedMaintenance.datePlanifiee), "dd/MM/yyyy")}</p>
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