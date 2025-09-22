// app/(app)/chamada/attendance-list.tsx (Versão Final com Ícones de Status)
'use client'

import { useOptimistic, startTransition } from 'react'
import type { AttendanceChild } from './page'
import { markAttendance } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'; // Importar
import { User } from 'lucide-react';
// 1. Importar os ícones necessários
import { UserCheck, UserX, CheckCircle2, XCircle } from 'lucide-react'

// O componente que lida com a interatividade
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
        <CardTitle>Chamada do Dia - {new Date(today + 'T00:00:00').toLocaleDateString('pt-BR')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {optimisticChildren.map((child) => (
            <div key={child.id} className="flex flex-col gap-2 items-center justify-between p-3 rounded-lg border">
              {child.avatar_url 
              ? 
                (<Image src={child.avatar_url} alt={`Foto de ${child.name}`} width={40} height={40} className="rounded-full object-cover" />) 
              : 
                (<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                </div>)
              }
              {/* 2. Lógica para renderizar o ícone e o nome */}
              <div className="flex items-center gap-3">
                {child.status === 'present' && (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                )}
                {child.status === 'absent' && (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <span className="font-medium text-lg">{child.name.toUpperCase()}</span>
              </div>
              
              {/* Botões de Ação */}
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