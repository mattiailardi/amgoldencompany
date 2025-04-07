
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

// Hook generico per effettuare query al database
export function useSupabaseQuery<T>(
  key: string[],
  tableName: string,
  options?: {
    column?: string;
    value?: any;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    filters?: { column: string; operator: string; value: any }[];
    select?: string;
  }
) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: key,
    queryFn: async (): Promise<T[]> => {
      // Use type assertion to handle dynamic table name
      let query = supabase
        .from(tableName as any)
        .select(options?.select || '*');
      
      // Applica filtri se specificati
      if (options?.column && options?.value !== undefined) {
        query = query.eq(options.column, options.value);
      }
      
      // Applica filtri aggiuntivi
      if (options?.filters) {
        options.filters.forEach(filter => {
          if (filter.operator === 'eq') {
            query = query.eq(filter.column, filter.value);
          } else if (filter.operator === 'neq') {
            query = query.neq(filter.column, filter.value);
          } else if (filter.operator === 'gt') {
            query = query.gt(filter.column, filter.value);
          } else if (filter.operator === 'lt') {
            query = query.lt(filter.column, filter.value);
          } else if (filter.operator === 'gte') {
            query = query.gte(filter.column, filter.value);
          } else if (filter.operator === 'lte') {
            query = query.lte(filter.column, filter.value);
          } else if (filter.operator === 'like') {
            query = query.like(filter.column, filter.value);
          } else if (filter.operator === 'ilike') {
            query = query.ilike(filter.column, filter.value);
          }
        });
      }
      
      // Applica ordinamento
      if (options?.order) {
        query = query.order(options.order.column, {
          ascending: options.order.ascending !== false,
        });
      }
      
      // Applica limite
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Errore durante il recupero dei dati",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as T[];
    },
  });
}

// Hook per aggiungere un nuovo record
export function useSupabaseInsert<T, U extends Record<string, any>>(tableName: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (newItem: U): Promise<T> => {
      // Use type assertion to handle dynamic table name
      const { data, error } = await supabase
        .from(tableName as any)
        .insert(newItem as any)
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Errore durante l'inserimento",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as T;
    },
    onSuccess: () => {
      toast({
        title: "Operazione completata",
        description: "Record inserito con successo",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}

// Hook per aggiornare un record esistente
export function useSupabaseUpdate<T, U extends Record<string, any>>(tableName: string, idColumn: string = 'id') {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: U & { id: string }): Promise<T> => {
      // Use type assertion to handle dynamic table name
      const { data, error } = await supabase
        .from(tableName as any)
        .update(item as any)
        .eq(idColumn, id)
        .select()
        .single();
      
      if (error) {
        toast({
          title: "Errore durante l'aggiornamento",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as T;
    },
    onSuccess: () => {
      toast({
        title: "Operazione completata",
        description: "Record aggiornato con successo",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}

// Hook per eliminare un record
export function useSupabaseDelete(tableName: string, idColumn: string = 'id') {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Use type assertion to handle dynamic table name
      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq(idColumn, id);
      
      if (error) {
        toast({
          title: "Errore durante l'eliminazione",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Operazione completata",
        description: "Record eliminato con successo",
      });
      queryClient.invalidateQueries({ queryKey: [tableName] });
    },
  });
}
