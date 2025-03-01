"use client";

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { getInterventionsBySystem } from '@/actions/sav/analytic'; // Importez la fonction

export function PieGraph() {
  const [chartData, setChartData] = React.useState<{ system: string; interventions: number; fill: string }[]>([]);
  const [period, setPeriod] = React.useState<{ start: string; end: string }>({ start: "", end: "" });
  const [percentageChange, setPercentageChange] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { chartData, period, percentageChange } = await getInterventionsBySystem();
        setChartData(chartData);
        setPeriod(period);
        setPercentageChange(percentageChange);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalInterventions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.interventions, 0);
  }, [chartData]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des Interventions</CardTitle>
        <CardDescription>
          {period.start} - {period.end} {/* Période dynamique */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            interventions: {
              label: 'Interventions'
            },
          }}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="interventions"
              nameKey="system"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalInterventions.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Interventions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {percentageChange >= 0 ? "Augmentation" : "Diminution"} de {Math.abs(percentageChange)}% ce mois-ci{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Répartition des interventions pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  );
}