'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', maintenance: 22, intervention: 150 },
  { date: '2024-04-02', maintenance: 9, intervention: 180 },
  { date: '2024-04-03', maintenance: 67, intervention: 120 },
  { date: '2024-04-04', maintenance: 42, intervention: 260 },
  { date: '2024-04-05', maintenance: 73, intervention: 290 },
  { date: '2024-04-06', maintenance: 1, intervention: 340 },
  { date: '2024-04-07', maintenance: 45, intervention: 180 },
  { date: '2024-04-08', maintenance: 9, intervention: 320 },
  { date: '2024-04-09', maintenance: 9, intervention: 110 },
  { date: '2024-04-10', maintenance: 1, intervention: 190 },
  { date: '2024-04-11', maintenance: 37, intervention: 350 },
  { date: '2024-04-12', maintenance: 92, intervention: 210 },
  { date: '2024-04-13', maintenance: 42, intervention: 380 },
  { date: '2024-04-14', maintenance: 37, intervention: 220 },
  { date: '2024-04-15', maintenance: 20, intervention: 170 },
  { date: '2024-04-16', maintenance: 38, intervention: 190 },
  { date: '2024-04-17', maintenance: 46, intervention: 360 },
  { date: '2024-04-18', maintenance: 34, intervention: 5 },
  { date: '2024-04-19', maintenance: 43, intervention: 180 },
  { date: '2024-04-20', maintenance: 9, intervention: 150 },
  { date: '2024-04-21', maintenance: 37, intervention: 200 },
  { date: '2024-04-22', maintenance: 24, intervention: 170 },
  { date: '2024-04-23', maintenance: 8, intervention: 230 },
  { date: '2024-04-24', maintenance: 7, intervention: 290 },
  { date: '2024-04-25', maintenance: 25, intervention: 250 },
  { date: '2024-04-26', maintenance: 15, intervention: 130 },
  { date: '2024-04-27', maintenance: 83, intervention: 420 },
  { date: '2024-04-28', maintenance: 12, intervention: 180 },
  { date: '2024-04-29', maintenance: 15, intervention: 240 },
  { date: '2024-04-30', maintenance: 44, intervention: 380 },
  { date: '2024-05-01', maintenance: 65, intervention: 220 },
  { date: '2024-05-02', maintenance: 93, intervention: 310 },
  { date: '2024-05-03', maintenance: 47, intervention: 190 },
  { date: '2024-05-04', maintenance: 85, intervention: 420 },
  { date: '2024-05-05', maintenance: 481, intervention: 390 },
  { date: '2024-05-06', maintenance: 498, intervention: 520 },
  { date: '2024-05-07', maintenance: 388, intervention: 300 },
  { date: '2024-05-08', maintenance: 149, intervention: 210 },
  { date: '2024-05-09', maintenance: 227, intervention: 180 },
  { date: '2024-05-10', maintenance: 293, intervention: 330 },
  { date: '2024-05-11', maintenance: 335, intervention: 270 },
  { date: '2024-05-12', maintenance: 197, intervention: 240 },
  { date: '2024-05-13', maintenance: 197, intervention: 160 },
  { date: '2024-05-14', maintenance: 448, intervention: 490 },
  { date: '2024-05-15', maintenance: 473, intervention: 380 },
  { date: '2024-05-16', maintenance: 338, intervention: 400 },
  { date: '2024-05-17', maintenance: 499, intervention: 420 },
  { date: '2024-05-18', maintenance: 315, intervention: 350 },
  { date: '2024-05-19', maintenance: 235, intervention: 180 },
  { date: '2024-05-20', maintenance: 177, intervention: 230 },
  { date: '2024-05-21', maintenance: 82, intervention: 140 },
  { date: '2024-05-22', maintenance: 81, intervention: 120 },
  { date: '2024-05-23', maintenance: 252, intervention: 290 },
  { date: '2024-05-24', maintenance: 294, intervention: 220 },
  { date: '2024-05-25', maintenance: 201, intervention: 250 },
  { date: '2024-05-26', maintenance: 213, intervention: 170 },
  { date: '2024-05-27', maintenance: 420, intervention: 460 },
  { date: '2024-05-28', maintenance: 233, intervention: 190 },
  { date: '2024-05-29', maintenance: 78, intervention: 130 },
  { date: '2024-05-30', maintenance: 340, intervention: 280 },
  { date: '2024-05-31', maintenance: 178, intervention: 230 },
  { date: '2024-06-01', maintenance: 178, intervention: 200 },
  { date: '2024-06-02', maintenance: 6, intervention: 5 },
  { date: '2024-06-03', maintenance: 103, intervention: 160 },
  { date: '2024-06-04', maintenance: 439, intervention: 380 },
  { date: '2024-06-05', maintenance: 88, intervention: 140 },
  { date: '2024-06-06', maintenance: 294, intervention: 250 },
  { date: '2024-06-07', maintenance: 323, intervention: 370 },
  { date: '2024-06-08', maintenance: 385, intervention: 320 },
  { date: '2024-06-09', maintenance: 438, intervention: 480 },
  { date: '2024-06-10', maintenance: 155, intervention: 200 },
  { date: '2024-06-11', maintenance: 92, intervention: 150 },
  { date: '2024-06-12', maintenance: 492, intervention: 420 },
  { date: '2024-06-13', maintenance: 81, intervention: 130 },
  { date: '2024-06-14', maintenance: 426, intervention: 380 },
  { date: '2024-06-15', maintenance: 307, intervention: 350 },
  { date: '2024-06-16', maintenance: 371, intervention: 310 },
  { date: '2024-06-17', maintenance: 475, intervention: 520 },
  { date: '2024-06-18', maintenance: 107, intervention: 170 },
  { date: '2024-06-19', maintenance: 341, intervention: 290 },
  { date: '2024-06-20', maintenance: 408, intervention: 450 },
  { date: '2024-06-21', maintenance: 169, intervention: 210 },
  { date: '2024-06-22', maintenance: 317, intervention: 270 },
  { date: '2024-06-23', maintenance: 480, intervention: 530 },
  { date: '2024-06-24', maintenance: 132, intervention: 180 },
  { date: '2024-06-25', maintenance: 141, intervention: 190 },
  { date: '2024-06-26', maintenance: 434, intervention: 380 },
  { date: '2024-06-27', maintenance: 448, intervention: 490 },
  { date: '2024-06-28', maintenance: 149, intervention: 200 },
  { date: '2024-06-29', maintenance: 103, intervention: 160 },
  { date: '2024-06-30', maintenance: 446, intervention: 400 }
];

const chartConfig = {
  maintenance: {
    label: 'Maintenance',
    color: '#3390FF' // Couleur bleue pour les interventions de maintenance
  },
  intervention: {
    label: 'Intervention',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('maintenance');

  const total = React.useMemo(
    () => ({
      maintenance: chartData.reduce((acc, curr) => acc + curr.maintenance, 0),
      intervention: chartData.reduce((acc, curr) => acc + curr.intervention, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Diagramme en barre maintenance et intervention</CardTitle>
          <CardDescription>
            Nombre de maintenance et d'interventions effectuées par les techniciens
          </CardDescription>
        </div>
        <div className="flex">
          {['maintenance', 'intervention'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}