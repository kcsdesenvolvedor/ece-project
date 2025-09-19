// app/(app)/criancas/child-form.tsx (Import Corrigido)
'use client'

import { useActionState, useState } from 'react'; // CORRETO: useActionState vem de 'react'
import { createClient } from '@/lib/supabase/client';
import { useFormStatus } from 'react-dom'; // CORRETO: useFormStatus vem de 'react-dom'
import { type FormState } from './actions';
import { useIMask } from 'react-imask'; // 1. Importar o hook da nova biblioteca
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns'; // Importando format para a data de início
import NextImage from 'next/image';
import { Upload } from 'lucide-react';
import { useSession } from "next-auth/react";

export type ChildEditData = {
    child_name: string | null;
    birth_date: string | null;
    allergies: string | null;
    medical_notes: string | null;
    image_authorization: boolean | null;
    avatar_url: string | null;
    guardian_id: string | null;
    guardian_name: string | null;
    guardian_cpf: string | null;
    guardian_phone: string | null;
    guardian_email: string | null;
    enrollment_id: string | null;
    plan_id: number | null;
    discount: number | null;
    surcharge: number | null;
};

interface ChildFormProps {
    action: (prevState: FormState, formData: FormData) => Promise<FormState>;
    initialData?: ChildEditData | null;
    buttonText: string;
    childId?: string;
    guardianId?: string;
    enrollmentId?: string;
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto" aria-disabled={pending}>
      {pending ? 'Salvando...' : text}
    </Button>
  );
}

// --- COMPONENTE DE UPLOAD (VERSÃO FINAL E REFORÇADA) ---
function AvatarUpload({ initialUrl, onUpload }: { initialUrl?: string | null, onUpload: (url: string) => void }) {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      // @ts-ignore
      const supabaseAccessToken = session?.supabaseAccessToken;

      // VERIFICAÇÃO DE SEGURANÇA: Não tenta fazer o upload se não houver token.
      if (!supabaseAccessToken) {
          alert("Erro de autenticação: Sessão não encontrada. Por favor, faça o login novamente.");
          return;
      }

      const supabase = createClient(); // Cliente padrão, sem token na criação

      try {
          setIsUploading(true);
          if (!event.target.files || event.target.files.length === 0) {
              throw new Error('Você precisa selecionar uma imagem para fazer o upload.');
          }
          const file = event.target.files[0];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          // A MUDANÇA CRUCIAL: Passamos o token diretamente nas opções do upload
          let { error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(filePath, file, {
                  headers: {
                      authorization: `Bearer ${supabaseAccessToken}`,
                  },
              });

          if (uploadError) {
              // Se ainda der erro, o log será mais informativo
              console.error("Erro detalhado do Supabase:", uploadError);
              throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
          setAvatarUrl(publicUrl);
          onUpload(publicUrl);

      } catch (error) {
          console.error("Erro no upload:", error);
          alert('Erro ao fazer o upload da imagem! Verifique as permissões e o console.');
      } finally {
          setIsUploading(false);
      }
  };

  return (
    <div className="space-y-2">
      <Label>Foto da Criança (Opcional)</Label>
      <div className="flex items-center gap-4">
          {avatarUrl ? (
              // 2. Usar o novo nome 'NextImage'
              <NextImage src={avatarUrl} alt="Avatar" width={64} height={64} className="rounded-full object-cover" />
          ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
          )}
          <Button type="button" variant="outline" asChild>
              <label htmlFor="avatarInput" className="cursor-pointer">
                  {isUploading ? 'Enviando...' : 'Escolher Foto'}
                  <input type="file" id="avatarInput" className="hidden" onChange={handleUpload} accept="image/*" disabled={isUploading} />
              </label>
          </Button>
      </div>
    </div>
  );
}

export function ChildForm({ action, initialData, buttonText, childId, guardianId, enrollmentId }: ChildFormProps) {
  const initialState: FormState = { message: '', errors: {} };
  const [state, dispatch] = useActionState(action, initialState);
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || '');

  // 2. Configurar o hook da máscara para o CPF
  const { ref: cpfRef } = useIMask({
    mask: '000.000.000-00',
  });

  const plans = [
    {id: 1, name: "Integral"},
    {id: 2, name: "Meio Período"},
    {id: 3, name: "Diária"},
  ];

  const startDateValue = initialData?.birth_date
    ? format(new Date(initialData.birth_date + 'T00:00:00'), 'yyyy-MM-dd')
    : new Date().toISOString();

  const startDateDisplay = initialData?.birth_date
    ? new Date(initialData.birth_date + 'T00:00:00').toLocaleDateString('pt-BR')
    : 'Preenchida no cadastro';


  return (
    <form action={dispatch} className="space-y-8">
      {/* Campos ocultos para os IDs no modo de edição */}
      {avatarUrl && <input type="hidden" name="avatarUrl" value={avatarUrl} />}
      {childId && <input type="hidden" name="childId" value={childId} />}
      {guardianId && <input type="hidden" name="guardianId" value={guardianId} />}
      {enrollmentId && <input type="hidden" name="enrollmentId" value={enrollmentId} />}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">{initialData ? "Editar Dados da Criança" : "Cadastrar Nova Criança"}</h1>
        <SubmitButton text={buttonText} />
      </div>

      {/* Seção 1: Dados da Criança */}
      <Card>
        <CardHeader><CardTitle>Dados da Criança</CardTitle></CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="childName">Nome Completo</Label>
            <Input id="childName" name="childName" defaultValue={initialData?.child_name ?? ''}/>
            {state.errors?.childName && <p className="text-sm font-medium text-destructive">{state.errors.childName}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <DatePicker name="birthDate" initialDate={initialData?.birth_date} />
            {state.errors?.birthDate && <p className="text-sm font-medium text-destructive">{state.errors.birthDate}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="allergies">Alergias</Label>
            <Textarea id="allergies" name="allergies" placeholder="Ex: Amendoim, glúten..." defaultValue={initialData?.allergies ?? ''} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicalNotes">Observações Médicas</Label>
            <Textarea id="medicalNotes" name="medicalNotes" placeholder="Ex: Usa medicamento contínuo..." defaultValue={initialData?.medical_notes ?? ''} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="imageAuth" name="imageAuth" defaultChecked={initialData?.image_authorization ?? false} />
            <Label htmlFor="imageAuth">Autoriza o uso de imagem?</Label>
          </div>
          <div className="md:col-span-2">
              <AvatarUpload initialUrl={initialData?.avatar_url} onUpload={setAvatarUrl} />
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Dados do Responsável */}
      <Card>
        <CardHeader><CardTitle>Dados do Responsável</CardTitle></CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
           <div className="space-y-2">
            <Label htmlFor="guardianName">Nome Completo</Label>
            <Input id="guardianName" name="guardianName" defaultValue={initialData?.guardian_name ?? ''} />
             {state.errors?.guardianName && <p className="text-sm font-medium text-destructive">{state.errors.guardianName}</p>}
          </div>
           
           {/* 3. Alteração no campo de CPF */}
          <div className="space-y-2">
            <Label htmlFor="guardianCpf">CPF (Opcional)</Label>
            <Input
              id="guardianCpf"
              name="guardianCpf"
              placeholder="000.000.000-00"
              defaultValue={initialData?.guardian_cpf ?? ''}
              // @ts-expect-error - A ref do useIMask é funcionalmente compatível com o Input do Shadcn
              ref={cpfRef}
            />
            {state.errors?.guardianCpf && <p className="text-sm font-medium text-destructive">{state.errors.guardianCpf}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guardianPhone">Telefone/WhatsApp (Opcional)</Label>
            <Input id="guardianPhone" name="guardianPhone" placeholder="(00) 00000-0000" defaultValue={initialData?.guardian_phone ?? ''} />
             {state.errors?.guardianPhone && <p className="text-sm font-medium text-destructive">{state.errors.guardianPhone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email (Opcional)</Label>
            <Input id="guardianEmail" name="guardianEmail" type="email" placeholder="responsavel@email.com" defaultValue={initialData?.guardian_email ?? ''}/>
             {state.errors?.guardianEmail && <p className="text-sm font-medium text-destructive">{state.errors.guardianEmail}</p>}
          </div>

        </CardContent>
      </Card>

      {/* Seção 3: Plano e Matrícula */}
      <Card>
          <CardHeader><CardTitle>Plano e Matrícula</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                  <Label htmlFor="planId">Plano Contratado</Label>
                   <Select name="planId" defaultValue={initialData?.plan_id ? String(initialData.plan_id) : undefined}>
                        <SelectTrigger><SelectValue placeholder="Selecione um plano" /></SelectTrigger>
                        <SelectContent>
                            {plans.map((plan) => (
                                <SelectItem key={plan.id} value={String(plan.id)}>
                                    {plan.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  {state.errors?.planId && <p className="text-sm font-medium text-destructive">{state.errors.planId}</p>}
              </div>
              <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início (Não editável)</Label>
                  <Input readOnly disabled defaultValue={startDateDisplay}/>
                  <input type="hidden" name="startDate" defaultValue={startDateValue} />
              </div>
              {/* NOVO Campo de Desconto */}
              <div className="space-y-2">
                  <Label htmlFor="discount">Desconto Mensal (R$)</Label>
                  <Input
                      id="discount"
                      name="discount"
                      type="number"
                      placeholder="Ex: 50.00"
                      step="0.01"
                      defaultValue={initialData?.discount ?? 0}
                  />
                  {state.errors?.discount && <p className="text-sm font-medium text-destructive">{state.errors.discount}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surcharge">Acréscimo Mensal (R$)</Label>
                <Input id="surcharge" name="surcharge" type="number" placeholder="Ex: 25.00" step="0.01" defaultValue={initialData?.surcharge ?? 0}/>
                {state.errors?.surcharge && <p className="text-sm font-medium text-destructive">{state.errors.surcharge}</p>}
              </div>
          </CardContent>
      </Card>

      {state.message && !state.errors && (
        <p className="text-sm font-medium text-destructive">{state.message}</p>
      )}
      
      <div className="flex justify-end">
        <SubmitButton text={buttonText} />
      </div>
    </form>
  );
}