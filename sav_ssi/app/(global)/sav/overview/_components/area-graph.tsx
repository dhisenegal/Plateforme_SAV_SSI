"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getInterventionStats } from "@/actions/sav/analytic"; // Importez la fonction

const chartConfig = {
  delai: {
    label: "Sur délai",
    color: "green", // Couleur verte pour les interventions sur délai
  },
  horsdelai: {
    label: "Hors délai",
    color: "red", // Couleur rouge pour les interventions hors délai
  },
} satisfies ChartConfig;

export function AreaGraph() {
  const [data, setData] = useState<{ month: string; delai: number; horsdelai: number }[]>([]);
  const [overduePercentage, setOverduePercentage] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getInterventionStats();

        // Formater les données pour le graphe
        const formattedData = [
          {
            month: new Date().toLocaleString("default", { month: "long" }),
            delai: stats.onTime,
            horsdelai: stats.overdue,
          },
        ];

        setData(formattedData);
        setOverduePercentage(stats.overduePercentage); // Mettre à jour le pourcentage
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interventions</CardTitle>
        <CardDescription>
          Interventions sur délai et hors délai
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <ResponsiveContainer width="100%" height={310}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area
                type="monotone"
                dataKey="delai"
                stackId="1"
                stroke={chartConfig.delai.color}
                fill={chartConfig.delai.color}
                fillOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="horsdelai"
                stackId="1"
                stroke={chartConfig.horsdelai.color}
                fill={chartConfig.horsdelai.color}
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {overduePercentage}% d'interventions hors délai <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {new Date().toLocaleString("default", { month: "long" })} {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}