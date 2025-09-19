// app/(app)/chamada/page.tsx (Versão Corrigida e Simplificada)

import { createClient } from '@/lib/supabase/server'; // Usamos o cliente do servidor
import { AttendanceList } from './attendance-list';

export type AttendanceChild = {
  id: string;
  name: string;
  avatar_url: string | null;
  status: 'present' | 'absent' | null;
}

// Este é um Server Component
export default async function ChamadaPage() {
    const supabase = await createClient();
    
    // --- LÓGICA DE FUSO HORÁRIO CORRIGIDA ---
    // Pega a data/hora atual no ambiente do servidor (geralmente UTC)
    const serverDate = new Date();

    // Cria um formatador que sabe converter para o fuso de São Paulo
    // e retorna no formato YYYY-MM-DD, que o PostgreSQL entende.
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const todayStringInBrazil = formatter.format(serverDate);
    // Exemplo: se no servidor for 08/06/2025 01:00 (UTC),
    // o formatter retornará "2025-06-07" (que é o dia correto em SP).
    
    const { data: children, error } = await supabase.rpc('get_daily_attendance', {
        p_date: todayStringInBrazil, // Usamos a string da data correta
    });

    if (error) {
        console.error("Erro ao carregar chamada:", error);
        return <p>Erro ao carregar a lista de crianças.</p>;
    }
    
    return <AttendanceList initialChildren={children as AttendanceChild[]} today={todayStringInBrazil} />
}