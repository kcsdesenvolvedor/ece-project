// app/(app)/criancas/[id]/page.tsx (Versão Final e Corrigida)

import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

// Os tipos permanecem os mesmos
type ChildDetails = {
  name: string | null;
  birth_date: string | null;
  allergies: string | null;
  medical_notes: string | null;
  image_authorization: boolean | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  plan_name: string | null;
}

type AttendanceRecord = {
  date: string;
  status: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChildDetailPage({ params }: PageProps) {
  const supabase = createClient();
  const childId = params.id;

  // As chamadas em paralelo continuam sendo a melhor abordagem
  const [detailsResponse, attendanceResponse] = await Promise.all([
    supabase.rpc('get_child_details', { p_child_id: childId }).single<ChildDetails>(),
    // Removido o .returns() para usar o padrão de verificação de erro, que é mais seguro
    supabase.rpc('get_child_attendance_by_month', {
      p_child_id: childId,
      p_month_start: new Date().toISOString().slice(0, 8) + '01',
    }),
  ]);

  // 1. Verificar o erro da busca de detalhes PRIMEIRO
  if (detailsResponse.error || !detailsResponse.data) {
    console.error("Erro ao buscar detalhes da criança:", detailsResponse.error);
    notFound(); // Se não encontrar a criança, exibe a página 404
  }
  const details = detailsResponse.data;

  // 2. VERIFICAÇÃO DE ERRO EXPLÍCITA PARA A PRESENÇA (A CORREÇÃO PRINCIPAL)
  if (attendanceResponse.error) {
    console.error("Erro ao buscar histórico de presença:", attendanceResponse.error);
    // Não vamos quebrar a página inteira, apenas mostraremos o histórico como vazio
  }
  
  // 3. Atribuição segura dos dados de presença
  // Se houve um erro na etapa anterior, .data será null, e o fallback `[]` será usado.
  // Se não houve erro, .data conterá o array de AttendanceRecord.
  const attendance: AttendanceRecord[] = attendanceResponse.data || [];

  const presentDays = attendance
    .filter(d => d.status === 'present')
    .map(d => new Date(d.date + 'T00:00:00'));

  const absentDays = attendance
    .filter(d => d.status === 'absent')
    .map(d => new Date(d.date + 'T00:00:00'));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{details.name ?? 'Nome não encontrado'}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ... O restante do JSX permanece o mesmo ... */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Matrícula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Plano:</span> <Badge>{details.plan_name ?? 'N/A'}</Badge></p>
            <p><span className="font-semibold">Responsável:</span> {details.guardian_name ?? 'N/A'}</p>
            <p><span className="font-semibold">Telefone:</span> {details.guardian_phone ?? 'N/A'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Médicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Alergias:</span> {details.allergies || 'Nenhuma'}</p>
            <p><span className="font-semibold">Obs. Médicas:</span> {details.medical_notes || 'Nenhuma'}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Histórico de Presença (Mês Atual)</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="multiple"
                    selected={[...presentDays, ...absentDays]}
                    modifiers={{
                        present: presentDays,
                        absent: absentDays,
                    }}
                    modifiersStyles={{
                        present: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
                        absent: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' },
                    }}
                    className="p-0"
                />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}