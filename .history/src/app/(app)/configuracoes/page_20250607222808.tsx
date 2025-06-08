// app/(app)/configuracoes/page.tsx
import { createClient } from '@/lib/supabase/server';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
    const supabase = createClient();
    const { data: plans, error } = await supabase.rpc('get_all_plans');

    if (error) {
        return <p>Erro ao carregar as configurações de planos.</p>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Configurações</h1>
            <SettingsForm plans={plans} />
        </div>
    );
}