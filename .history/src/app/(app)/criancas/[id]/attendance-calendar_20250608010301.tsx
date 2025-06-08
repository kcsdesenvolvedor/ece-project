// app/(app)/criancas/[id]/attendance-calendar.tsx (Versão Final com Contadores)
'use client'

import { useState, useTransition } from 'react';
// 1. Importar CardFooter
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { getChildAttendanceForMonth } from '../actions';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type AttendanceRecord = {
  date: string;
  status: string;
};

interface AttendanceCalendarProps {
  childId: string;
  initialAttendance: AttendanceRecord[];
}

export function AttendanceCalendar({ childId, initialAttendance }: AttendanceCalendarProps) {
  const [isPending, startTransition] = useTransition();
  const [month, setMonth] = useState(new Date());
  const [attendance, setAttendance] = useState(initialAttendance);

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(month);
    newMonth.setMonth(month.getMonth() + (direction === 'prev' ? -1 : 1));
    
    startTransition(async () => {
      const newAttendanceData = await getChildAttendanceForMonth(childId, newMonth);
      setAttendance(newAttendanceData as AttendanceRecord[]);
      setMonth(newMonth);
    });
  };

  const presentDays = attendance.filter(d => d.status === 'present').map(d => new Date(d.date + 'T00:00:00'));
  const absentDays = attendance.filter(d => d.status === 'absent').map(d => new Date(d.date + 'T00:00:00'));

  // 2. Contar as presenças e ausências
  const presenceCount = presentDays.length;
  const absenceCount = absentDays.length;

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Histórico de Presença</CardTitle>
          <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('prev')} disabled={isPending}>
                  <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="w-32 text-center font-semibold capitalize">
                  {format(month, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <Button variant="outline" size="icon" onClick={() => handleMonthChange('next')} disabled={isPending}>
                  <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
      </CardHeader>
      <CardContent className="flex justify-center">
          <Calendar
              month={month}
              mode="multiple"
              selected={[...presentDays, ...absentDays]}
              modifiers={{ present: presentDays, absent: absentDays }}
              modifiersStyles={{
                  present: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
                  absent: { backgroundColor: 'hsl(var(--destructive))', color: 'hsl(var(--destructive-foreground))' },
              }}
              className="p-0"
              disabled={isPending}
              classNames={{ caption: "hidden" }}
          />
      </CardContent>
      {/* 3. Adicionar o CardFooter com os contadores */}
      <CardFooter className="flex flex-col items-start gap-4 border-t pt-4 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">Presenças:</span>
            <span className="font-bold text-lg">{presenceCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="font-medium">Ausências:</span>
            <span className="font-bold text-lg">{absenceCount}</span>
          </div>
      </CardFooter>
    </Card>
  );
}