// app/(app)/chamada/attendance-list.tsx (Componente de CLIENTE)
'use client' // ESSENCIAL: Isso marca como Componente de Cliente

import { useOptimistic, startTransition } from 'react'
import type { AttendanceChild } from './page' // Importa o tipo do page.tsx
import { markAttendance } from './actions' // Importa a Server Action
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, UserX } from 'lucide-react'

// Este componente NÃO busca dados, apenas os recebe via props
export function AttendanceList({ initialChildren, today }: { initialChildren: AttendanceChild[], today: string }) {
  // Toda a lógica interativa com hooks (useOptimistic, etc.) fica aqui
  const [optimisticChildren, setOptimisticChildren] = useOptimistic(
    initialChildren,
    (state: AttendanceChild[], newStatus: { childId: string, status: 'present' | 'absent' }) => {
      return state.map(child => 
        child.id === newStatus.childId ? { ...child, status: newStatus.status } : child
      );
    }
  );

  const handleMarkAttendance = async (childId: string, status: 'present' | 'absent') => {
    startTransition(() => {
        setOptimisticChildren({ childId, status });
    });
    
    const formData = new FormData();
    formData.append('childId', childId);
    formData.append('status', status);
    formData.append('date', today);
    await markAttendance(formData);
  }

  return (
    <Card>
      {/* ... O resto do JSX que renderiza a lista ... */}
       <CardHeader>
        <CardTitle>Chamada do Dia - {new Date(today + 'T00:00:00').toLocaleDateString('pt-BR')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimisticChildren.map((child) => (
            <div key={child.id} className="flex flex-col md:flex-row items-center justify-between p-2 rounded-lg border">
              <span className="font-medium">{child.name}</span>
              <div className="flex flex-row gap-2">
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