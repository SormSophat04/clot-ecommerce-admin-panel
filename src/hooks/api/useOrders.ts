import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../api/services';
import type { UpdateOrderStatusRequest } from '../../types/api';

export const useOrders = (
  page: number = 1,
  pageSize: number = 20,
  filters?: {
    status?: string;
    paymentStatus?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: ['orders', 'list', page, pageSize, filters],
    queryFn: () => orderService.getAll(page, pageSize, filters),
    staleTime: 2 * 60 * 1000,
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) =>
      orderService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
