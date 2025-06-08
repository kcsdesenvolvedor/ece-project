// app/page.tsx
import { redirect } from 'next/navigation'

export default function HomePage() {
  // O middleware já cuida da lógica de autenticação,
  // então podemos simplesmente redirecionar para o dashboard.
  // Se o usuário não estiver logado, o middleware o interceptará
  // e o enviará para /login.
  redirect('/dashboard')
}