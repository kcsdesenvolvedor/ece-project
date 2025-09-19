
// src/app/api/auth/[...nextauth]/route.ts (Versão Final, Segura e sem 'any')

import NextAuth, { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // A seção 'credentials' é importante para a tipagem
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      
      // A tipagem correta para 'credentials', permitindo que seja undefined
      async authorize(credentials, req) {
        
        // A verificação de existência é a chave
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        try {
          const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SECRET_KEY!
          );

          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error("Erro no Supabase authorize:", error.message);
            return null;
          }

          if (data.user) {
            return {
              id: data.user.id,
              email: data.user.email,
            };
          }
          
          return null;

        } catch (error) {
          console.error("Erro inesperado no authorize:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
  
  callbacks: {
    // Este callback é chamado quando um JWT é criado
    async jwt({ token, user }) {
      // Na primeira vez (login), o objeto `user` do `authorize` está disponível
      if (user) {
        token.sub = user.id; // `sub` (subject) é o campo padrão para o ID do usuário no JWT
        token.email = user.email;
      }
      return token;
    },
    // Este callback é chamado quando a sessão é acessada
    async session({ session, token }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub, // O ID do usuário vindo do token
          email: token.email,
          role: "authenticated", // A 'role' que a política RLS espera
        };
        // Criamos o token que o Supabase irá aceitar
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);

      }
      
      // Passamos o ID do usuário para o objeto da sessão
      if (session.user) {
        session.user.id = token.sub as string;
      }
      
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };