// app/(app)/chamada/attendance-list.tsx
'use client'

import { useOptimistic, startTransition } from 'react'
import type { AttendanceChild } from './page' // Vamos importar o tipo do nosso 'page.tsx'
import { markAttendance } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, UserX } from 'lucide-react'

// Este é um componente 100% de Cliente
export function AttendanceList({ initialChildren, today }: { initialChildren: AttendanceChild[], today: string }) {
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