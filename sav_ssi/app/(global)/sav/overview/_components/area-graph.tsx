'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  { month: 'January', delai: 186, horsdelai: 80 },
  { month: 'February', delai: 305, horsdelai: 200 },
  { month: 'March', delai: 237, horsdelai: 120 },
  { month: 'April', delai: 73, horsdelai: 190 },
  { month: 'May', delai: 209, horsdelai: 130 },
  { month: 'June', delai: 214, horsdelai: 140 }
];

const chartConfig = {
  delai: {
    label: 'Sur délai',
    color: 'green' // Couleur verte pour les interventions sur délai
  },
  horsdelai: {
    label: 'Hors délai',
    color: 'red' // Couleur rouge pour les interventions hors délai
  }
} satisfies ChartConfig;

export function AreaGraph() {
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
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
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
              9% d'interventions hors délai <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Janvier 2025 - Juin 2025
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}