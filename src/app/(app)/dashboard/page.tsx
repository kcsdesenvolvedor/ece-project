// app/(app)/dashboard/page.tsx (Versão Final e Robusta)

import { createClient } from '@/lib/supabase/server';
import { PlanDistributionChart } from './plan-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, UserCheck, UserX, DollarSign, Info } from 'lucide-react';

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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  tooltipText?: string; // Prop opcional para o texto do tooltip
}

// O componente StatCard não precisa de alterações
function StatCard({ title, value, icon: Icon, tooltipText }: StatCardProps) {
  return (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                  {title}
                  {tooltipText && (
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger>
                                  <Info className="h-3 w-3 text-muted-foreground cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{tooltipText}</p>
                              </TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                  )}
              </CardTitle>
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

  const [metricsResponse, chartResponse] = await Promise.all([
    supabase.rpc('get_dashboard_metrics').single<DashboardMetrics>(),
    supabase.rpc('get_plan_distribution'),
  ]);
  
  const defaultMetrics: DashboardMetrics = {
    total_children: 0,
    monthly_revenue: 0,
    present_today: 0,
    absent_today: 0,
    daily_revenue: 0,
  };

  const metrics = metricsResponse.error || !metricsResponse.data 
    ? defaultMetrics 
    : metricsResponse.data;

  const chartData: PlanDistribution[] = chartResponse.data || [];

  const dailyRevenueValue = metrics.daily_revenue || 0;
  const monthlyRevenueValue = metrics.monthly_revenue || 0;

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
                title="Total de Crianças"
                value={metrics.total_children}
                icon={Users}
            />
            {/* 3. Passar o texto informativo para o card de Receita Diária */}
            <StatCard
                title="Receita Diária Estimada"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dailyRevenueValue)}
                icon={DollarSign}
                tooltipText="Receita referente às crianças PRESENTES no dia com plano 'Diária'."
            />
             {/* 4. Passar o texto informativo para o card de Receita Mensal */}
            <StatCard
                title="Receita Mensal Estimada"
                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenueValue)}
                icon={DollarSign}
                tooltipText="Soma dos valores de todos os planos de matrículas ativas (exceto 'Diária')."
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