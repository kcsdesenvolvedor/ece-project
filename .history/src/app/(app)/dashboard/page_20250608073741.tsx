// app/(app)/dashboard/page.tsx (Versão Final e Robusta)

import { createClient } from '@/lib/supabase/server';
import { PlanDistributionChart } from './plan-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, DollarSign, WalletCards } from 'lucide-react';

// O tipo permanece o mesmo, definindo nossa "forma" ideal
type DashboardMetrics = {
  total_children: number;
  monthly_revenue: number;
  present_today: number;
  absent_today: number;
  daily_revenue: number;
}

type PlanDistribution = {
  name: string;
  count: number;
}

// O componente StatCard não precisa de alterações
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
  const supabase = await createClient();

  // 1. Tipar explicitamente o retorno da chamada RPC
  const [metricsResponse, chartResponse] = await Promise.all([
    supabase.rpc('get_dashboard_metrics').single<DashboardMetrics>(),
    supabase.rpc('get_plan_distribution'),
  ]);

  // 2. Criar um objeto de fallback seguro e completo
  const defaultMetrics: DashboardMetrics = {
    total_children: 0,
    monthly_revenue: 0,
    present_today: 0,
    absent_today: 0,
    daily_revenue: 0,
  };

  // 3. Verificar explicitamente o erro ou a ausência de dados
  const metrics = metricsResponse.error || !metricsResponse.data 
    ? defaultMetrics 
    : metricsResponse.data;

  const chartData: PlanDistribution[] = chartResponse.data || [];

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
                title="Total de Crianças"
                value={metrics.total_children}
                icon={Users}
            />
            <StatCard
                title="Receita Diária Estimada"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.daily_revenue)}
                icon={WalletCards}
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

        <div className="grid gap-4">
            <PlanDistributionChart data={chartData} />
        </div>
    </div>
  )
}