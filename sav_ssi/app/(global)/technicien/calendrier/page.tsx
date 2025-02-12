'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views, NavigateAction } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/navigation';
import { getPlanning, fetchDetails, getType } from '@/actions/technicien/planning';

const messagesFr = {
  date: 'Date',
  time: 'Heure',
  event: 'Événement',
  allDay: 'Journée entière',
  week: 'Semaine',
  work_week: 'Semaine de travail',
  day: 'Jour',
  month: 'Mois',
  previous: 'Précédent',
  next: 'Suivant',
  yesterday: 'Hier',
  tomorrow: 'Demain',
  today: "Aujourd'hui",
  agenda: 'Agenda',
  noEventsInRange: 'Aucun événement dans cette période.',
};

const localizer = momentLocalizer(moment);

interface PlanningEvent {
  id: number;
  start: Date;
  end: Date;
  title: string;
  planId: number;
  planType: string;
  allDay?: boolean;
}


export default function CalendarPage() {
  const router = useRouter();
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const technicienId = parseInt(session?.user?.id as string);

  moment.locale('fr');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        
        const planningData = await getPlanning(technicienId);

        if (!planningData || planningData.length === 0) {
          console.warn('Aucun plan récupéré ou planification vide.');
          setEvents([]);
          setLoading(false);
          return;
        }

        // Récupère détails & type pour chacune des entrées
        const planningWithDetails = await Promise.all(
          planningData.map(async (plan: any) => {
            try {
              const planType = await getType(plan);
              if (!plan.id || planType === 'Type inconnu') return null;

              const details = await fetchDetails(plan.id, planType);
              return { ...plan, ...details, type: planType };
            } catch (err) {
              console.error('Erreur lors du fetchDetails/getType', err);
              return null;
            }
          })
        );

        // Filtrer les entrées null et celles qui sont TERMINE
        const filtered = planningWithDetails.filter(
          (pln) => pln && pln.statut !== 'TERMINE'
        );

        const newEvents: PlanningEvent[] = filtered.map((pln: any) => {
          
          const startDate = pln.datePlanifiee ? new Date(pln.datePlanifiee) : new Date();
          // Suppose 1h de durée (ajustez selon vos besoins)
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

          return {
            id: pln.id,
            planId: pln.id,
            planType: pln.type,
            title: pln.clientName
              ? `${pln.clientName} - ${pln.description || ''}`
              : `Plan #${pln.id} - ${pln.description || ''}`,
            start: startDate,
            end: endDate,
            allDay: false,
          };
        });

        setEvents(newEvents);
      } catch (err) {
        console.error('Erreur lors de la récupération du planning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectEvent = (event: PlanningEvent) => {
    if (event.planId && event.planType) {
      router.push(`/technicien/Planning/${event.planId}?type=${event.planType}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-center font-bold mb-4">Calendrier maintenances/interventons</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <Calendar
          localizer={localizer}
          messages={messagesFr}
          culture="fr"
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          // Permet la sélection de la vue mensuelle ou semaine
          views={[Views.MONTH, Views.WEEK]}
          defaultView={Views.MONTH}
          onSelectEvent={handleSelectEvent}
        />
      )}
    </div>
  );
}