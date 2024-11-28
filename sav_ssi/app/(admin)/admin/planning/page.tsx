"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
=======
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import EventForm from "@/components/admin/EventForm";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
<<<<<<< HEAD
};

const locales = {
  fr: fr,
};

=======
  techniciens?: string[];
};

const locales = { fr };
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

<<<<<<< HEAD
=======
const techniciensDisponibles = [
  "Technicien 1",
  "Technicien 2",
  "Technicien 3",
  "Technicien 4",
];

>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
const PlanningPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

<<<<<<< HEAD
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      title: "",
      start,
      end,
      id: `${new Date().getTime()}`,
    });
    setModalOpen(true);
  };

=======
  // Gestion de la sélection d'une plage horaire
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      title: "",
      start: new Date(start),
      end: new Date(end),
      id: `${new Date().getTime()}`,
      techniciens: [],
    });    
    setModalOpen(true);
  };

  // Gestion de la sélection d'un événement existant
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
  const handleSelectEvent = (event: EventData) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setModalOpen(false);
  };

  const handleSave = (eventData: EventData) => {
    const existingIndex = events.findIndex((event) => event.id === eventData.id);
    if (existingIndex >= 0) {
<<<<<<< HEAD
      // Modifier l'événement
=======
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
      const updatedEvents = [...events];
      updatedEvents[existingIndex] = eventData;
      setEvents(updatedEvents);
    } else {
<<<<<<< HEAD
      // Ajouter un nouvel événement
=======
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
      setEvents([...events, eventData]);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion du Planning</h1>
<<<<<<< HEAD

=======
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
<<<<<<< HEAD
        style={{ height: "80vh" }}
        culture="fr"
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Modifier l'événement"
=======
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        style={{ height: "80vh" }}
        culture="fr"
        messages={{
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          today: "Aujourd'hui",
        }}
      />

      <Modal
         isOpen={modalOpen && !!selectedEvent}
        onRequestClose={() => setModalOpen(false)}
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
        ariaHideApp={false}
        className="bg-white rounded-lg p-6 max-w-lg mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <EventForm
          event={selectedEvent}
<<<<<<< HEAD
=======
          techniciens={techniciensDisponibles}
>>>>>>> 927a10670e773b53abf9af7862fa98b5f30053b9
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanningPage;
