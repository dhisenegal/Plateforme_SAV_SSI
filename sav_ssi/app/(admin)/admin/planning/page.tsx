"use client";

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import EventForm from "@/components/admin/EventForm";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  techniciens?: string[];
};

const locales = { fr };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const techniciensDisponibles = [
  "Technicien 1",
  "Technicien 2",
  "Technicien 3",
  "Technicien 4",
];

const PlanningPage = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Gestion de la sélection d'une plage horaire
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      title: "",
      start,
      end,
      id: `${new Date().getTime()}`,
      techniciens: [],
    });
    setModalOpen(true);
  };

  // Gestion de la sélection d'un événement existant
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
      const updatedEvents = [...events];
      updatedEvents[existingIndex] = eventData;
      setEvents(updatedEvents);
    } else {
      setEvents([...events, eventData]);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestion du Planning</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
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
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        ariaHideApp={false}
        className="bg-white rounded-lg p-6 max-w-lg mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <EventForm
          event={selectedEvent}
          techniciens={techniciensDisponibles}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanningPage;
