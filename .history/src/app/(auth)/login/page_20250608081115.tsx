// app/(auth)/login/page.tsx (Versão Final com Ilustração)
'use client'

import { useActionState } from 'react'
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

// --- SVG Criado como um componente React para a ilustração ---
function LogoIllustration() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="logoTitle"
        role="img"
      >
        <title id="logoTitle">Ilustração do Espaço Cuidar e Educar</title>
        
        {/* Bloco Amarelo */}
        <rect x="50" y="100" width="40" height="40" rx="5" fill="hsl(var(--primary) / 0.5)" />
        {/* Bloco Verde */}
        <rect x="110" y="100" width="40" height="40" rx="5" fill="hsl(var(--primary) / 0.7)" />
        {/* Bloco Principal (Cor Primária) */}
        <rect x="80" y="60" width="40" height="40" rx="5" fill="hsl(var(--primary))" />

        {/* Coração simbolizando o Cuidado */}
        <path
          d="M 100,45 a 15,15 0 0,1 15,15 c 0,15 -15,20 -15,20 s -15,-5 -15,-20 a 15,15 0 0,1 15,-15 z"
          fill="hsl(var(--destructive))"
        />
      </svg>
      <div className="mt-4">
        <h1 className="text-3xl font-bold text-primary">
            Espaço Cuidar e Educar
        </h1>
        <p className="text-muted-foreground">
            O seu painel de administração completo.
        </p>
      </div>
    </div>
  );
}


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
  const [state, formAction] = useActionState(login, initialState);

  return (
    // Container principal com layout de duas colunas em telas grandes (lg)
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* --- Coluna da Esquerda (Visual) --- */}
        {/* Visível apenas em telas grandes */}
        <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center">
            <LogoIllustration />
        </div>

        {/* --- Coluna da Direita (Formulário) --- */}
        <div className="flex items-center justify-center py-12 px-4">
            <div className="mx-auto grid w-[350px] gap-6">
                {/* Logo para a versão mobile, escondido em telas grandes */}
                <div className="lg:hidden mb-8">
                   <LogoIllustration />
                </div>
                
                {/* O Card do formulário não precisa de um Card externo */}
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Entre com seu email para acessar o painel
                    </p>
                </div>
                <form action={formAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    {state.message && (
                        <p className="text-sm font-medium text-destructive">
                            {state.message}
                        </p>
                    )}
                    <LoginButton />
                </form>
            </div>
        </div>
    </div>
  );
}