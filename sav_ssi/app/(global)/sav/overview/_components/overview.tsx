"use client";

import {useRouter} from "next/navigation";
import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { useSession } from "next-auth/react";
import PageContainer from '@/components/layout/page-container';
import { RecentInterventions } from './recent-interventions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { 
  getNewInterventionsCount, 
  getSuspendedInterventionsCount,
  getOverdueInterventionsCount,
  getExpiringContractsCount 
} from '@/actions/sav/analytic';

interface StatisticData {
  count: number;
  percentageChange: number;
}

export default function OverViewPage() {
  const { data: session } = useSession();
  const [statistics, setStatistics] = useState({
    newInterventions: { count: 0, percentageChange: 0 },
    suspendedInterventions: { count: 0, percentageChange: 0 },
    overdueInterventions: { count: 0, percentageChange: 0 },
    expiringContracts: { count: 0, percentageChange: 0 }
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [newInts, suspendedInts, overdueInts, expiringConts] = await Promise.all([
          getNewInterventionsCount(),
          getSuspendedInterventionsCount(),
          getOverdueInterventionsCount(),
          getExpiringContractsCount()
        ]);

        setStatistics({
          newInterventions: newInts,
          suspendedInterventions: suspendedInts,
          overdueInterventions: overdueInts,
          expiringContracts: expiringConts
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);
  const router = useRouter();

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Heyyy Bienvenue {session?.user?.prenom}👋
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
              <Card 
              className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => router.push("/sav/interventions?status=NON_PLANIFIE")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Demandes intervention
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{statistics.newInterventions.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.newInterventions.percentageChange > 0 ? "+" : ""}
                    {statistics.newInterventions.percentageChange}% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Interventions suspendues
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{statistics.suspendedInterventions.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.suspendedInterventions.percentageChange > 0 ? "+" : ""}
                    {statistics.suspendedInterventions.percentageChange}% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Interventions hors délai</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{statistics.overdueInterventions.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.overdueInterventions.percentageChange > 0 ? "+" : ""}
                    {statistics.overdueInterventions.percentageChange}% par rapport au dernier mois
                  </p>
                </CardContent>
              </Card>
              <Card  className="cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => router.push("/sav/contrats?filter=expiring")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Contrats bientot expirés
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{statistics.expiringContracts.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.expiringContracts.percentageChange > 0 ? "+" : ""}
                    {statistics.expiringContracts.percentageChange}% par rapport au dernier mois
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
                  <CardTitle>interventions</CardTitle>
                  <CardDescription>
                    Vous avez effectué {statistics.newInterventions.count} interventions ce mois.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentInterventions />
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