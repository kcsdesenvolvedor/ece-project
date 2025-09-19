// src/types/next-auth.d.ts (Versão Atualizada)

import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * O objeto Session retornado pelos hooks como useSession(), getSession(), etc.
   */
  interface Session {
    /** O token de acesso customizado que o Supabase pode usar para autenticação */
    supabaseAccessToken?: string; // <-- ADICIONAR ESTA LINHA

    user: {
      /** Adicione a propriedade 'id' ao objeto user da sessão */
      id: string;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** O objeto do token JWT, retornado pelo callback jwt() */
  interface JWT {
    /** Adicione a propriedade 'id' ao token */
    id: string;
  }
}