// app/(app)/criancas/[id]/page.tsx (Versão Final com Calendário Dinâmico)

import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { AttendanceCalendar } from './attendance-calendar'; // Importa nosso novo componente

// ... (os tipos ChildDetails e AttendanceRecord podem ser mantidos aqui ou movidos para um arquivo types.ts) ...
type ChildDetails = { name: string | null; /* ...outras props... */ plan_name: string | null; guardian_name: string | null; guardian_phone: string | null; allergies: string | null; medical_notes: string | null; };
type AttendanceRecord = { date: string; status: string; };



interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChildDetailPage(props: PageProps) {
  const { id: childId } = props.params; // Desestruturar aqui
  const supabase = await createClient();
  //const childId = params.id;

  // Busca os dados INICIAIS (perfil + primeiro mês de presença)
  const [detailsResponse, initialAttendanceResponse] = await Promise.all([
    supabase.rpc('get_child_details', { p_child_id: childId }).single<ChildDetails>(),
    supabase.rpc('get_child_attendance_by_month', {
      p_child_id: childId,
      p_month_start: new Date().toISOString().slice(0, 8) + '01',
    }),
  ]);

  if (detailsResponse.error || !detailsResponse.data) {
    notFound();
  }
  const details = detailsResponse.data;
  const initialAttendance: AttendanceRecord[] = initialAttendanceResponse.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{details.name ?? 'Nome não encontrado'}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards de Detalhes (sem alteração) */}
        <Card>
            <CardHeader><CardTitle>Detalhes da Matrícula</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <p><span className="font-semibold">Plano:</span> <Badge>{details.plan_name ?? 'N/A'}</Badge></p>
                <p><span className="font-semibold">Responsável:</span> {details.guardian_name ?? 'N/A'}</p>
                <p><span className="font-semibold">Telefone:</span> {details.guardian_phone ?? 'N/A'}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader><CardTitle>Informações Médicas</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                <p><span className="font-semibold">Alergias:</span> {details.allergies || 'Nenhuma'}</p>
                <p><span className="font-semibold">Obs. Médicas:</span> {details.medical_notes || 'Nenhuma'}</p>
            </CardContent>
        </Card>

        {/* Renderiza o componente de cliente dinâmico */}
        <AttendanceCalendar childId={childId} initialAttendance={initialAttendance} />
      </div>
    </div>
  );
}