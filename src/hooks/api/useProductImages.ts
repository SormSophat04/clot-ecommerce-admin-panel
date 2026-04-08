import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../../api/services';

export const useProductImages = (productId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['products', 'images', productId],
    queryFn: () => productImageService.getAllByProduct(productId),
    enabled: enabled && productId > 0,
    staleTime: 30 * 1000,
  });
};

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, file }: { productId: number; file: File }) =>
      productImageService.upload(productId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'images', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) =>
      productImageService.deleteById(productId, imageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'images', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteAllProductImages = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => productImageService.deleteAllByProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ['products', 'images', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

