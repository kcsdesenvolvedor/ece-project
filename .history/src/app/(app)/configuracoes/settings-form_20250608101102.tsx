// app/(app)/configuracoes/settings-form.tsx
'use client'

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePlanPrices } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type Plan = {
    id: number;
    name: string;
    price: number;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending}>{pending ? 'Salvando...' : 'Salvar Alterações'}</Button>
}

export function SettingsForm({ plans }: { plans: Plan[] }) {
    const initialState: { message: string } = { message: '' };
    const [state, formAction] = useActionState(updatePlanPrices, initialState);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (state.message) {
            setMessage(state.message);
            const timer = setTimeout(() => setMessage(''), 3000); // Mensagem desaparece após 3s
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>Valores dos Planos</CardTitle>
                    <CardDescription>
                        Atualize os valores de mensalidade para cada plano. A mudança será refletida no cálculo de receita e em novos cadastros.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {plans.map((plan) => (
                        <div key={plan.id} className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor={`plan-${plan.id}`} className="text-right">
                                {plan.name}
                            </Label>
                            <Input
                                id={`plan-${plan.id}`}
                                name={`plan-${plan.id}`}
                                type="number"
                                defaultValue={plan.price}
                                step="0.01"
                                className="col-span-2"
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>
            <div className="flex items-center justify-end mt-4 gap-4">
                {message && <p className="text-sm text-muted-foreground">{message}</p>}
                <SubmitButton />
            </div>
        </form>
    )
}