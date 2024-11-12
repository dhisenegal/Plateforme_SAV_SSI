import React, { useState } from "react";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
};

type EventFormProps = {
  event: EventData | null;
  onSave: (event: EventData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onDelete, onClose }) => {
  const [title, setTitle] = useState(event?.title || "");
  const [start, setStart] = useState(event?.start.toISOString().slice(0, 16) || "");
  const [end, setEnd] = useState(event?.end.toISOString().slice(0, 16) || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Le titre est requis");

    const newEvent: EventData = {
      id: event?.id || `${new Date().getTime()}`,
      title,
      start: new Date(start),
      end: new Date(end),
    };

    onSave(newEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-2">{event?.id ? "Modifier" : "Ajouter"} Événement</h2>

      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />

      <input
        type="datetime-local"
        className="w-full p-2 border rounded"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />

      <div className="flex justify-between">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
        {event?.id && (
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Supprimer
          </button>
        )}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Enregistrer</button>
      </div>
    </form>
  );
};

export default EventForm;
