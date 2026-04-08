import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceService } from '../../api/services/resources';
import type {
  CreateBrandRequest,
  UpdateBrandRequest,
  CreateColorRequest,
  UpdateColorRequest,
  CreateSizeRequest,
  UpdateSizeRequest,
} from '../../types/api';

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => resourceService.getBrands(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useColors = () => {
  return useQuery({
    queryKey: ['colors'],
    queryFn: () => resourceService.getColors(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useSizes = () => {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: () => resourceService.getSizes(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateBrandRequest) => resourceService.createBrand(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: { id: number } & UpdateBrandRequest) =>
      resourceService.updateBrand(request.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourceService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useCreateColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateColorRequest) => resourceService.createColor(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: { id: number } & UpdateColorRequest) =>
      resourceService.updateColor(request.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourceService.deleteColor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};

export const useCreateSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateSizeRequest) => resourceService.createSize(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
    },
  });
};

export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: { id: number } & UpdateSizeRequest) =>
      resourceService.updateSize(request.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
    },
  });
};

export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourceService.deleteSize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sizes'] });
    },
  });
};
