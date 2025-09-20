// src/middleware.ts (Versão Final e Segura com withAuth)

import { withAuth } from "next-auth/middleware";

// O `withAuth` do NextAuth já cuida de toda a lógica de verificar o token
// e redirecionar o usuário. Nós só precisamos configurá-lo.
export default withAuth({
  // `pages` informa ao middleware onde encontrar a página de login.
  // Se a verificação de autenticação falhar, ele redirecionará para cá.
  pages: {
    signIn: "/login",
  },
});

// O `config.matcher` informa ao middleware EM QUAIS ROTAS ele deve ser executado.
// Esta é a parte mais importante.
export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes, for NextAuth)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - login (the login page itself)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
    ],
  };