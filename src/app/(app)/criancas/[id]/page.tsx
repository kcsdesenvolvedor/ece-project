// src/app/(app)/criancas/[id]/page.tsx (Solução Final e Direta)

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AttendanceCalendar } from './attendance-calendar';

type ChildDetails = { name: string | null; plan_name: string | null; guardian_name: string | null; guardian_phone: string | null; allergies: string | null; medical_notes: string | null; };
type AttendanceRecord = { date: string; status: string; };

export default async function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Resolver a promessa dos parâmetros PRIMEIRO e obter o ID.
  const resolvedParams = await params;
  const childId = resolvedParams.id;

  // 2. Agora que 'childId' é uma string garantida, prossiga com a lógica.
  const supabase = await createClient();

  const [detailsResponse, initialAttendanceResponse] = await Promise.all([
    supabase.rpc('get_child_details', { p_child_id: childId }).single<ChildDetails>(),
    supabase.rpc('get_child_attendance_by_month', {
      p_child_id: childId,
      p_month_start: new Date().toISOString().slice(0, 8) + '01',
    }),
  ]);

  if (detailsResponse.error || !detailsResponse.data) {
    console.error("Erro ao buscar detalhes da criança:", detailsResponse.error);
    notFound();
  }

  const details = detailsResponse.data;
  const initialAttendance: AttendanceRecord[] = initialAttendanceResponse.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{details.name ?? 'Nome não encontrado'}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <AttendanceCalendar childId={childId} initialAttendance={initialAttendance} />
      </div>
    </div>
  );
}