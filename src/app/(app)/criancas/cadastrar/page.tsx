// app/(app)/criancas/cadastrar/page.tsx (Refatorado)
import { ChildForm } from '../child-form';
import { registerChild } from '../actions';

export default function RegisterChildPage() {
  return (
    <ChildForm
      action={registerChild}
      buttonText="Salvar Cadastro"
    />
  );
}