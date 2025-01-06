"use client";

import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAllMaintenances } from "@/actions/sav/maintenance";
import Modal from "react-modal";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  status: string;
  clientName: string;
  description: string;
  typeMaintenance: string;
  technicienName: string;
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

const PlanningPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const { maintenances } = await getAllMaintenances();
        const formattedEvents = maintenances.map((maintenance) => ({
          title: maintenance.Site.Client.nom,
          start: new Date(maintenance.dateMaintenance),
          end: new Date(maintenance.dateMaintenance),
          id: maintenance.id.toString(),
          status: maintenance.statut,
          clientName: maintenance.Site.Client.nom,
          description: maintenance.description,
          typeMaintenance: maintenance.typeMaintenance,
          technicienName: `${maintenance.Technicien.prenom} ${maintenance.Technicien.nom}`,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Erreur lors de la récupération des maintenances:", error);
      }
    };

    fetchMaintenances();
  }, []);

  const eventStyleGetter = (event: EventData) => {
    let backgroundColor = "";
    switch (event.status) {
      case "PLANIFIE":
        backgroundColor = "blue";
        break;
      case "SUSPENDU":
        backgroundColor = "red";
        break;
      case "TERMINE":
        backgroundColor = "green";
        break;
      default:
        backgroundColor = "gray";
    }
    return {
      style: {
        backgroundColor,
      },
    };
  };

  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion du Planning</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        culture="fr"
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />

      {selectedEvent && (
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Détails de l'événement"
          ariaHideApp={false}
          className="bg-white rounded-lg p-6 max-w-lg mx-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">{selectedEvent.clientName}</h2>
          <p><strong>Description:</strong> {selectedEvent.description}</p>
          <p><strong>Type de maintenance:</strong> {selectedEvent.typeMaintenance}</p>
          <p><strong>Technicien:</strong> {selectedEvent.technicienName}</p>
          <p><strong>Date:</strong> {selectedEvent.start.toLocaleDateString()}</p>
          <p><strong>Statut:</strong> {selectedEvent.status}</p>
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Fermer
          </button>
        </Modal>
      )}
    </div>
  );
};

export default PlanningPage;