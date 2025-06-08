// components/ui/date-picker.tsx (Versão Aprimorada com Seleção de Ano)
'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  name: string;
  initialDate?: string | null;
}

export function DatePicker({ name, initialDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    initialDate ? new Date(initialDate + 'T00:00:00') : undefined
  );

  // Define o intervalo de anos para o dropdown
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 100; // Permite selecionar até 100 anos no passado
  const toYear = currentYear;

  return (
    <Popover>
      <input type="hidden" name={name} value={date ? format(date, 'yyyy-MM-dd') : ''} />
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP', { locale: ptBR }) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          locale={ptBR}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}

          // 1. Adicionar as props para habilitar os dropdowns de ano e mês
          captionLayout="dropdown-buttons"
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  )
}