// src/app/(auth)/login/login-form.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from 'next/image';
import { FormEvent } from 'react';

function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  if (!error) return null;
  return <p className="text-sm font-medium text-destructive">Credenciais inválidas.</p>;
}

export default function LoginForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    signIn('credentials', { email, password, callbackUrl: '/dashboard' });
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex lg:items-center lg:justify-center p-8">
        <Image src="/logo-creche.png" alt="Logo" width={400} height={400} className="rounded-full" />
      </div>
      <div className="flex items-center justify-center py-12 px-4">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="lg:hidden mb-8 flex flex-col items-center">
               <Image src="/logo-creche.png" alt="Logo" width={150} height={150} className="rounded-full" />
          </div>
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p>Entre para acessar o painel</p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <ErrorMessage />
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}