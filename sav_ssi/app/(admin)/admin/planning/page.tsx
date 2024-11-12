"use client";

import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { fr } from "date-fns/locale/fr";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import EventForm from "@/components/admin/EventForm";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
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

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedEvent({
      title: "",
      start,
      end,
      id: `${new Date().getTime()}`,
    });
    setModalOpen(true);
  };

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
      // Modifier l'événement
      const updatedEvents = [...events];
      updatedEvents[existingIndex] = eventData;
      setEvents(updatedEvents);
    } else {
      // Ajouter un nouvel événement
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
        style={{ height: "80vh" }}
        culture="fr"
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Modifier l'événement"
        ariaHideApp={false}
        className="bg-white rounded-lg p-6 max-w-lg mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <EventForm
          event={selectedEvent}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default PlanningPage;
