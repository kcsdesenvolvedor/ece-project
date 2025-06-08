// app/(app)/chamada/page.tsx
'use client'

import { useOptimistic, startTransition } from 'react'
import { createClient } from '@/lib/supabase/server' // Usamos o client do browser aqui
import { markAttendance } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, UserX } from 'lucide-react'

// Definimos o tipo de dado que a nossa função RPC retorna
type AttendanceChild = {
  id: string;
  name: string;
  status: 'present' | 'absent' | null;
}

// O componente que busca os dados iniciais no servidor
export default async function ChamadaPage() {
    const supabase = await createClient()
    const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

    const { data: children, error } = await supabase.rpc('get_daily_attendance', {
        p_date: today,
    }) as { data: AttendanceChild[], error: any };

    if (error || !children) {
        return <p>Erro ao carregar a lista de crianças.</p>
    }
    
    return <AttendanceList initialChildren={children} today={today} />
}

// O componente de cliente que lida com a interatividade
function AttendanceList({ initialChildren, today }: { initialChildren: AttendanceChild[], today: string }) {
  const [optimisticChildren, setOptimisticChildren] = useOptimistic(
    initialChildren,
    (state: AttendanceChild[], newStatus: { childId: string, status: 'present' | 'absent' }) => {
      // Esta função atualiza a UI instantaneamente
      return state.map(child => 
        child.id === newStatus.childId ? { ...child, status: newStatus.status } : child
      );
    }
  );

  const handleMarkAttendance = async (childId: string, status: 'present' | 'absent') => {
    // 1. Inicia a atualização otimista
    startTransition(() => {
        setOptimisticChildren({ childId, status });
    });
    
    // 2. Prepara os dados e chama a Server Action
    const formData = new FormData();
    formData.append('childId', childId);
    formData.append('status', status);
    formData.append('date', today);
    await markAttendance(formData);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chamada do Dia - {new Date(today).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimisticChildren.map((child) => (
            <div key={child.id} className="flex items-center justify-between p-2 rounded-lg border">
              <span className="font-medium">{child.name}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={child.status === 'present' ? 'default' : 'outline'}
                  className="bg-green-500 hover:bg-green-600 text-white data-[variant=outline]:bg-transparent data-[variant=outline]:text-foreground"
                  onClick={() => handleMarkAttendance(child.id, 'present')}
                  disabled={child.status === 'present'}
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Presente
                </Button>
                <Button
                  size="sm"
                  variant={child.status === 'absent' ? 'destructive' : 'outline'}
                  onClick={() => handleMarkAttendance(child.id, 'absent')}
                  disabled={child.status === 'absent'}
                >
                  <UserX className="mr-2 h-4 w-4" /> Ausente
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}