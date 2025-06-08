// app/(app)/criancas/[id]/attendance-calendar.tsx (A Solução Final)
'use client'

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { getChildAttendanceForMonth } from '../actions';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <Card className="lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Histórico de Presença</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
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
              // A SOLUÇÃO FINAL: USANDO classNames PARA ESCONDER O CABEÇALHO
              classNames={{
                month_caption: "hidden", // Esconde o container do cabeçalho
                button_previous: "hidden",
                button_next: "hidden",
              }}
          />
      </CardContent>
    </Card>
  );
}