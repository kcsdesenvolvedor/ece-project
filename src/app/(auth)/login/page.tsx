// src/app/(auth)/login/page.tsx
import { Suspense } from 'react';
import LoginForm from './login-form';

// Este agora é um Server Component simples
export default function LoginPage() {
  return (
    // A Suspense boundary envolve o componente de cliente
    // O fallback é o que será mostrado enquanto o JavaScript do cliente carrega
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}