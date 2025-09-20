// app/(app)/layout.tsx (Versão Final com Menu Controlado)
'use client' // 1. Converter para um Componente de Cliente

import { useState } from 'react' // 2. Importar o hook useState
import Link from 'next/link'
import {
  Home,
  Users,
  CalendarCheck,
  LogOut,
  PlusCircle,
  Menu,
  Settings, 
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { logout } from './actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 3. Criar a variável de estado para controlar o Sheet
  const [isSheetOpen, setSheetOpen] = useState(false)

  const handleLinkClick = () => {
    setSheetOpen(false)
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* MENU LATERAL PARA DESKTOP (sem alterações) */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* ... (código do menu desktop permanece o mesmo) ... */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <span>Espaço Cuidar e Educar</span>
            </Link>
          </div>
          <div>
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/criancas/cadastrar"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <PlusCircle className="h-4 w-4" />
                Cadastrar Criança
              </Link>
              <Link
                href="/chamada"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <CalendarCheck className="h-4 w-4" />
                Chamada
              </Link>
              <Link
                href="/criancas"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                Crianças
              </Link>
              <Link
                href="/configuracoes"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </nav>
          </div>
          <div className="mt-4 p-4">
             <form action={logout}>
                <Button size="sm" className="w-full">
                    <LogOut className="mr-2 h-4 w-4"/> Sair
                </Button>
            </form>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL (INCLUINDO HEADER MOBILE) */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          {/* 4. Tornar o Sheet um componente controlado */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu de navegação</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                  onClick={handleLinkClick} // 5. Adicionar onClick
                >
                  <span>Espaço Cuidar e Educar</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick} // 5. Adicionar onClick
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                 <Link
                    href="/criancas/cadastrar"
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={handleLinkClick} // 5. Adicionar onClick
                  >
                    <PlusCircle className="h-5 w-5" />
                    Cadastrar Criança
                  </Link>
                <Link
                  href="/chamada"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick} // 5. Adicionar onClick
                >
                  <CalendarCheck className="h-5 w-5" />
                  Chamada
                </Link>
                <Link
                  href="/criancas"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick} // 5. Adicionar onClick
                >
                  <Users className="h-5 w-5" />
                  Crianças
                </Link>
                <Link
                  href="/configuracoes"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLinkClick}
                >
                  <Settings className="h-5 w-5" />
                  Configurações
                </Link>
              </nav>
              <div className="mt-4">
                <form action={logout}>
                    <Button size="sm" className="w-full">
                        <LogOut className="mr-2 h-4 w-4"/> Sair
                    </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
           <div className="w-full flex-1">
             <h1 className="font-semibold text-lg">Espaço Cuidar e Educar</h1>
           </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}