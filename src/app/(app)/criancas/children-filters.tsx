// app/(app)/criancas/children-filters.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ChildrenFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (filterName: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterName, value);
    } else {
      params.delete(filterName);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    handleFilter('search', term);
  }, 300); // Espera 300ms após o usuário parar de digitar

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Input
        placeholder="Pesquisar por nome..."
        className="md:col-span-2"
        defaultValue={searchParams.get('search')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Select
        onValueChange={(value) => handleFilter('plan', value === 'todos' ? '' : value)}
        defaultValue={searchParams.get('plan')?.toString() || 'todos'}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por plano" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os Planos</SelectItem>
          <SelectItem value="Integral">Integral</SelectItem>
          <SelectItem value="Meio Período">Meio Período</SelectItem>
          <SelectItem value="Diária">Diária</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}