import React, { useState } from "react";

type EventData = {
  title: string;
  start: Date;
  end: Date;
  id: string;
  techniciens?: string[];
};

type EventFormProps = {
  event: EventData | null;
  techniciens: string[];
  onSave: (event: EventData) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
};

const EventForm: React.FC<EventFormProps> = ({
  event,
  techniciens,
  onSave,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState(event?.title || "");
  const formatDateTimeInput = (date: Date | undefined): string => {
    if (!date) return "";
    const tzOffset = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return tzOffset.toISOString().slice(0, 16);
  };
  
  // Dans EventForm
  const [start, setStart] = useState<string>(formatDateTimeInput(event?.start));
  const [end, setEnd] = useState<string>(formatDateTimeInput(event?.end));
  
  const [selectedTechniciens, setSelectedTechniciens] = useState<string[]>(event?.techniciens || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("Le titre est requis");

    const newEvent: EventData = {
      id: event?.id || `${new Date().getTime()}`,
      title,
      start: new Date(start),
      end: new Date(end),
      techniciens: selectedTechniciens,
    };

    onSave(newEvent);
  };

  const toggleTechnicien = (technicien: string) => {
    if (selectedTechniciens.includes(technicien)) {
      setSelectedTechniciens(selectedTechniciens.filter((t) => t !== technicien));
    } else {
      setSelectedTechniciens([...selectedTechniciens, technicien]);
    }
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

      <div>
        <h3 className="font-semibold mb-2">Assigner aux techniciens :</h3>
        {techniciens.map((technicien) => (
          <label key={technicien} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              checked={selectedTechniciens.includes(technicien)}
              onChange={() => toggleTechnicien(technicien)}
            />
            <span>{technicien}</span>
          </label>
        ))}
      </div>

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
