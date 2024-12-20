'use client';

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

const chartData = [
  { system: 'SDI', interventions: 275, fill: '#4CAF50' }, // Vert
  { system: 'Extincteurs', interventions: 200, fill: '#FF9800' }, // Orange
  { system: 'RIA', interventions: 287, fill: '#2196F3' }, // Bleu
  { system: 'Alarme', interventions: 173, fill: '#F44336' }, // Rouge
  { system: 'Autres', interventions: 190, fill: '#9C27B0' } // Violet
];

const chartConfig = {
  interventions: {
    label: 'Interventions'
  },
  sdi: {
    label: 'SDI',
    color: '#4CAF50'
  },
  extincteurs: {
    label: 'Extincteurs',
    color: '#FF9800'
  },
  ria: {
    label: 'RIA',
    color: '#2196F3'
  },
  alarme: {
    label: 'Alarme',
    color: '#F44336'
  },
  autres: {
    label: 'Autres',
    color: '#9C27B0'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalInterventions = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.interventions, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des Interventions</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
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
          Augmentation de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Répartition des interventions pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  );
}