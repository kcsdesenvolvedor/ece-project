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
    const supabase = createClient() // Usa o cliente do SERVIDOR
    const today = new Date().toISOString().slice(0, 10);

    const { data: children, error } = await supabase.rpc('get_daily_attendance', {
        p_date: today,
    });

    if (error) {
        console.error("Erro ao buscar dados da chamada:", error);
        return <p className="text-destructive">Erro ao carregar a lista: {error.message}</p>;
    }

    if (!children) {
        return <p>Nenhuma criança encontrada para o dia de hoje.</p>;
    }
    
    // Renderiza o componente de CLIENTE, passando os dados do servidor como props
    return <AttendanceList initialChildren={children as AttendanceChild[]} today={today} />
}