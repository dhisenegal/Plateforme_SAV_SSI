'use client';

import { useSession } from 'next-auth/react';
import PageContainer from '@/components/layout/page-container';
import { RecentInterventions } from './recent-interventions';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
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
  const [upcomingPlans, setUpcomingPlans] = useState<Plan[]>([]);
  const [urgentInterventionsCount, setUrgentInterventionsCount] = useState<number>(0);

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
        setUpcomingPlans(nextPlans || []);
        
        const urgentCount = nextPlans.filter(plan => plan.urgent).length;
        setUrgentInterventionsCount(urgentCount);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }
    fetchData();
  }, [technicienId]);

  return (
    <PageContainer scrollable>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* En-tête avec animation subtile */}
          <div className="flex items-center justify-between py-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight transform transition-all duration-500 hover:scale-105">
              Bienvenue sur votre tableau de bord
              <span className="inline-block ml-2 animate-bounce">👋</span>
            </h2>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-slate-200 shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="px-6 py-2.5 text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg"
              >
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                disabled 
                className="px-6 py-2.5 text-sm font-medium"
              >
                Analytiques
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Grille des statistiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Carte Interventions */}
                <Card className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                      <span className="mr-2">📊</span>
                      Interventions en cours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                        {interventionsCount}
                      </span>
                      <span className="text-sm text-slate-500">total</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Carte Retards */}
                <Card className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                      <span className="mr-2">⚠️</span>
                      Retards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-red-600 group-hover:scale-110 transition-transform duration-300">
                        {interventionsHorsDelaiCount}
                      </span>
                      <span className="text-sm text-slate-500">interventions</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Carte Urgences */}
                <Card className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                      <span className="mr-2">🚨</span>
                      Urgences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">
                        {urgentInterventionsCount}
                      </span>
                      <span className="text-sm text-slate-500">à traiter</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Carte Maintenances */}
                <Card className="group bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                      <span className="mr-2">🔧</span>
                      Maintenances
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                        {maintenancesCount}
                      </span>
                      <span className="text-sm text-slate-500">planifiées</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section des prochaines maintenances */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                <Card className="col-span-full lg:col-span-4 bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl font-bold text-slate-800 text-center flex items-center justify-center gap-2">
                      <span>📅</span>
                      Prochaines maintenances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <RecentInterventions plans={upcomingPlans} />
                  </CardContent>
                </Card>

                <div className="col-span-full lg:col-span-3 space-y-6">
                  {/* Espace réservé pour du contenu futur */}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}