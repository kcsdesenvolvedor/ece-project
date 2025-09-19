// src/app/api/auth/[...nextauth]/route.ts (Versão Final sem Export de authOptions)

import NextAuth, { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import jwt from "jsonwebtoken"

// A PALAVRA 'export' FOI REMOVIDA DAQUI
const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(credentials) {
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
       const signingSecret = process.env.SUPABASE_JWT_SECRET;

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: token.sub,
          email: token.email,
          role: "authenticated",
        };

        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      return session;
    },
},

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };