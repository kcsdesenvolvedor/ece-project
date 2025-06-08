// app/(auth)/login/page.tsx (Corrigido)
'use client' // 1. Transformar em Componente de Cliente

import { useFormState, useFormStatus } from 'react-dom' // 2. Importar hooks
import { login, type FormState } from './actions'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Componente para o botão, para podermos usar o `useFormStatus`
function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Entrando...' : 'Entrar'}
    </Button>
  )
}


export default function LoginPage() {
  // 3. Configurar o useFormState
  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(login, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Entre com seu email para acessar o painel da creche
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 4. Usar o `formAction` no formulário */}
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            {/* 5. Exibir a mensagem de erro do estado */}
            {state.message && (
                <p className="text-sm font-medium text-destructive">
                    {state.message}
                </p>
            )}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}