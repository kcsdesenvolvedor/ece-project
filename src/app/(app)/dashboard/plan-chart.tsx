// app/(app)/dashboard/plan-chart.tsx (Versão Final com Eixo Y controlado)
'use client'

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartData {
  name: string;
  count: number;
}

const chartConfig = {
  criancas: {
    label: "Crianças",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig


export function PlanDistributionChart({ data }: { data: ChartData[] }) {
  
  // 1. Lógica para controlar a escala do eixo Y
  const counts = data.map(item => item.count);
  const maxCount = Math.max(...counts);
  
  // Define o valor máximo do eixo Y. Adiciona um pequeno buffer.
  // Se o valor máximo for pequeno (ex: 1, 2, 3), não adiciona muito espaço.
  const yAxisMax = maxCount < 5 ? maxCount + 1 : Math.ceil(maxCount * 1.1);

  // Gera os ticks (números no eixo). Se o máximo for 4, gera [0, 1, 2, 3, 4]
  const yAxisTicks = Array.from({ length: yAxisMax + 1 }, (_, i) => i);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Crianças por Plano</CardTitle>
        <CardDescription>Visualização gráfica dos seus planos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            {/* 2. Aplicar as novas propriedades ao YAxis */}
            <YAxis
              tickLine={false}
              axisLine={false}
              // Define o domínio (range) do eixo de 0 até nosso máximo calculado
              domain={[0, yAxisMax]}
              // Informa ao gráfico exatamente quais números mostrar no eixo
              ticks={yAxisTicks}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const planName = item.payload.name;
                    return [`${planName}: ${value}`, null];
                  }}
                  hideLabel
                />
              }
            />
            <Bar
              dataKey="count"
              name="criancas"
              fill="var(--color-criancas)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}