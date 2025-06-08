// app/(auth)/login/page.tsx (CORRIGIDO)
'use client'

import { useActionState } from 'react' // 1. ALTERADO: Importado de 'react'
import { useFormStatus } from 'react-dom'
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

function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" aria-disabled={pending}>
      {pending ? 'Entrando...' : 'Entrar'}
    </Button>
  )
}

export default function LoginPage() {
  const initialState: FormState = { message: '' };
  // 2. ALTERADO: useFormState -> useActionState
  const [state, formAction] = useActionState(login, initialState);

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