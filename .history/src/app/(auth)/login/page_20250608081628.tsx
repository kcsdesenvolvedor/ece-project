// app/(auth)/login/page.tsx (Versão Final com a Imagem da Logo)
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login, type FormState } from './actions'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image'; // 1. Importar o componente Image

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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
        {/* --- Coluna da Esquerda (Visual com a Logo) --- */}
        <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center p-8">
            {/* 2. Substituir a ilustração pela sua imagem */}
            <div className="flex flex-col items-center justify-center text-center">
                 <Image
                    src="/logo-creche.png"
                    alt="Logo Espaço Cuidar e Educar"
                    width={400} // Aumentar o tamanho para melhor visualização no desktop
                    height={400}
                    className="rounded-full" // Adicionar um arredondamento se desejar
                />
                 <p className="mt-6 text-xl text-muted-foreground">
                    O seu painel de administração completo.
                </p>
            </div>
        </div>

        {/* --- Coluna da Direita (Formulário) --- */}
        <div className="flex items-center justify-center py-12 px-4">
            <div className="mx-auto grid w-[350px] gap-6">
                {/* Logo para a versão mobile */}
                <div className="lg:hidden mb-8 flex flex-col items-center">
                   <Image
                        src="/logo-creche.png"
                        alt="Logo Espaço Cuidar e Educar"
                        width={150} // Um tamanho menor para o mobile
                        height={150}
                        className="rounded-full"
                    />
                </div>
                
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