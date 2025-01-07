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
import { getInterventionsActives, getMaintenancesActives, getInterventionsHorsDelai,getNextInterventionsAndMaintenances } from '@/actions/technicien/acceuil';


export default function OverViewPage() {
  const { data: session } = useSession();
  const [interventionsCount, setInterventionsCount] = useState(0);
  const [maintenancesCount, setMaintenancesCount] = useState(0);
  const [interventionsHorsDelaiCount, setInterventionsHorsDelaiCount] = useState<number>(0);
  const [upcomingPlans, setUpcomingPlans] = useState<Plan[]>([]); // Initialize with an empty array

  const technicienId = Number(session?.user?.id);

  useEffect(() => {
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nombres d'interventions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{interventionsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Nombres de Maintenances 
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{maintenancesCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interventions hors délai</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{interventionsHorsDelaiCount}</div>
                  <p className="text-xs text-muted-foreground">
                    +19% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Maintenances hors délai
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div> {/* Affichage des maintenances hors délai */}
                  <p className="text-xs text-muted-foreground">
                    +30% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarGraph />
              </div>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Prochaine interventions / maintenances</CardTitle>
                 
                </CardHeader>
                <CardContent>
                  <RecentInterventions plans={upcomingPlans}/>
                </CardContent>
              </Card>
              <div className="col-span-4">
                <AreaGraph />
              </div>
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
