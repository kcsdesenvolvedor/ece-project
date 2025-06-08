// app/(app)/chamada/page.tsx

import { createClient } from '@/lib/supabase/server' // 1. Usar o cliente de SERVIDOR
import { AttendanceList } from './attendance-list' // 2. Importar nosso novo componente de cliente

// Definimos o tipo aqui para que possa ser compartilhado
export type AttendanceChild = {
  id: string;
  name: string;
  status: 'present' | 'absent' | null;
}

// Este é um componente 100% de Servidor
export default async function ChamadaPage() {
    const supabase = await createClient()
    const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD

    // 3. Buscamos os dados no servidor
    const { data: children, error } = await supabase.rpc('get_daily_attendance', {
        p_date: today,
    });

    if (error) {
        console.error("Erro ao buscar dados da chamada:", error);
        return <p className="text-destructive">Erro ao carregar a lista de crianças: {error.message}</p>;
    }

    if (!children) {
        return <p>Nenhuma criança encontrada.</p>;
    }
    
    // 4. Passamos os dados como props para o componente de cliente
    return <AttendanceList initialChildren={children as AttendanceChild[]} today={today} />
}