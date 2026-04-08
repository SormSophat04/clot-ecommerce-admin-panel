import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../api/services';

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardRevenue = (days: number = 30) => {
  return useQuery({
    queryKey: ['dashboard', 'revenue', days],
    queryFn: () => dashboardService.getRevenue(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardCategories = () => {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: () => dashboardService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useDashboardCustomerLocations = () => {
  return useQuery({
    queryKey: ['dashboard', 'locations'],
    queryFn: () => dashboardService.getCustomerLocations(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useReviews = (limit: number = 10) => {
  return useQuery({
    queryKey: ['dashboard', 'reviews', limit],
    queryFn: () => dashboardService.getReviews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
