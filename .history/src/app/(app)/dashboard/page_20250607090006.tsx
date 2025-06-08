// app/(app)/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server'
import { PlanDistributionChart } from './plan-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX, DollarSign } from 'lucide-react'

// Tipos para os dados que virão do Supabase
type DashboardMetrics = {
  total_children: number;
  monthly_revenue: number;
  present_today: number;
  absent_today: number;
}

type PlanDistribution = {
  name: string;
  count: number;
}

// Componente de Card para reutilização
function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export default async function DashboardPage() {
  const supabase = createClient()

  // Buscar todos os dados em paralelo para máxima performance
  const [metricsResponse, chartResponse] = await Promise.all([
    supabase.rpc('get_dashboard_metrics').single(),
    supabase.rpc('get_plan_distribution'),
  ])

  const metrics: DashboardMetrics = metricsResponse.data || { total_children: 0, monthly_revenue: 0, present_today: 0, absent_today: 0 };
  const chartData: PlanDistribution[] = chartResponse.data || [];

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Grid de Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total de Crianças"
                value={metrics.total_children}
                icon={Users}
            />
            <StatCard
                title="Receita Mensal Estimada"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.monthly_revenue)}
                icon={DollarSign}
            />
            <StatCard
                title="Presentes Hoje"
                value={metrics.present_today}
                icon={UserCheck}
            />
            <StatCard
                title="Faltantes Hoje"
                value={metrics.absent_today}
                icon={UserX}
            />
        </div>

        {/* Gráfico */}
        <div className="grid gap-4">
            <PlanDistributionChart data={chartData} />
        </div>
    </div>
  )
}