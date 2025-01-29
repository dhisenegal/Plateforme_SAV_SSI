'use client';

import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { useSession } from 'next-auth/react';
import PageContainer from '@/components/layout/page-container';
import { RecentInterventions } from './recent-interventions';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInterventionsActives, getMaintenancesActives, getInterventionsHorsDelai, getNextInterventionsAndMaintenances } from '@/actions/technicien/acceuil';

export default function OverViewPage() {
  const { data: session } = useSession();
  const [interventionsCount, setInterventionsCount] = useState(0);
  const [maintenancesCount, setMaintenancesCount] = useState(0);
  const [interventionsHorsDelaiCount, setInterventionsHorsDelaiCount] = useState<number>(0);
  const [upcomingPlans, setUpcomingPlans] = useState<Plan[]>([]); // Initialize with an empty array
  const [urgentInterventionsCount, setUrgentInterventionsCount] = useState<number>(0); // State for urgent interventions count

  const technicienId = Number(session?.user?.id);

  useEffect(() => {
    // Récupérer le nombre d'interventions urgentes depuis localStorage
    const storedUrgentInterventionsCount = localStorage.getItem('urgentInterventionsCount');
    if (storedUrgentInterventionsCount) {
      setUrgentInterventionsCount(parseInt(storedUrgentInterventionsCount));
    }

    const storedHorsDelaiCount = localStorage.getItem('interventionsHorsDelaiCount');
    if (storedHorsDelaiCount) {
      setInterventionsHorsDelaiCount(parseInt(storedHorsDelaiCount));
    }

    // Fetch the data for interventions and maintenances
    async function fetchData() {
      try {
        const [interventions, maintenances, interventionsHorsDelai, nextPlans] = await Promise.all([
          getInterventionsActives(technicienId),
          getMaintenancesActives(technicienId),
          getInterventionsHorsDelai(technicienId),
          getNextInterventionsAndMaintenances(technicienId),
        ]);

        setInterventionsCount(interventions);
        setMaintenancesCount(maintenances);
        setInterventionsHorsDelaiCount(interventionsHorsDelai);
        setUpcomingPlans(nextPlans || []); // Ensure nextPlans is not undefined

        // Calculer et mettre à jour le nombre d'interventions urgentes
        const urgentCount = nextPlans.filter(plan => plan.urgent).length; // Assurez-vous que `plan.urgent` existe dans les données
        localStorage.setItem('urgentInterventionsCount', String(urgentCount));
        setUrgentInterventionsCount(urgentCount); // Mettre à jour l'état des interventions urgentes

      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }
    fetchData();
  }, [technicienId]);

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Heyyy Bienvenue 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Card pour le nombre d'interventions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-black">
                    Nombres d'interventions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{interventionsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {/* Additional description if needed */}
                  </p>
                </CardContent>
              </Card>

              {/* Card pour interventions hors délai */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-black">
                    Interventions hors délai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{interventionsHorsDelaiCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {/* Additional description if needed */}
                  </p>
                </CardContent>
              </Card>

              {/* Card pour interventions urgentes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-black">
                    Interventions Urgentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{urgentInterventionsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {/* Additional description if needed */}
                  </p>
                </CardContent>
              </Card>

              {/* Card pour le nombre de maintenances */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-bold text-black">
                    Nombres de Maintenances 
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{maintenancesCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {/* Additional description if needed */}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                   <CardTitle className="font-bold text-black text-center"> PROCHAINES MAINTENANCES</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentInterventions plans={upcomingPlans} />
                </CardContent>
              </Card>
              
              {/* Additional content */} 
              <div className="col-span-4 md:col-span-3">
                <PieGraph />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
