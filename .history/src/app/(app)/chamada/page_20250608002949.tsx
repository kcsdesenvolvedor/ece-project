// app/(app)/chamada/page.tsx (Componente de SERVIDOR)

import { createClient } from '@/lib/supabase/server'
import { AttendanceList } from './attendance-list' // Importa o componente de cliente

// O tipo é exportado para ser usado pelo componente de cliente
export type AttendanceChild = {
  id: string;
  name: string;
  status: 'present' | 'absent' | null;
}

// async function -> Isso marca como Componente de Servidor
export default async function ChamadaPage() {
    const supabase = await createClient() // Usamos o cliente do SERVIDOR
    
    // CORREÇÃO DE FUSO HORÁRIO
    // Define o fuso horário de referência (América/São Paulo)
    const timeZone = 'America/Sao_Paulo';
    const todayInBrazil = new Date(); // Pega a data/hora atual no ambiente do servidor (UTC)
    
    // Converte a data atual para o fuso do Brasil, mas mantém como objeto Date
    // Isso não é necessário com a abordagem de string, vamos simplificar.
    
    // A forma mais segura: criar uma string de data no formato correto
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    
    const todayStringForBrazil = formatter.format(todayInBrazil); // Gera "YYYY-MM-DD" para o dia atual em SP

    const { data: children, error } = await supabase.rpc('get_daily_attendance', {
        p_date: todayStringForBrazil,
    }) as { data: AttendanceChild[], error: any };

    if (error || !children) {
        return <p>Erro ao carregar a lista de crianças.</p>
    }
    
    // Passamos a string da data para o componente de cliente
    return <AttendanceList initialChildren={children} today={todayStringForBrazil} />
}