import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../api/services';

export const useCustomers = (
  page: number = 1,
  pageSize: number = 20,
  filters?: { search?: string; sortBy?: string; order?: 'asc' | 'desc' }
) => {
  return useQuery({
    queryKey: ['customers', 'list', page, pageSize, filters],
    queryFn: () => customerService.getAll(page, pageSize, filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: ['customers', 'detail', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
};
