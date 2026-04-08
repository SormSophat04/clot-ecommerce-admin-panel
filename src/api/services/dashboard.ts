import { apiClient } from '../client';
import { ENDPOINTS, API_CONFIG } from '../config';
import type {
  DashboardSummary,
  RevenueDataPoint,
  CategoryDataPoint,
  Review,
  CustomerLocation,
} from '../../types/api';
import {
  mockDashboardSummary,
  mockRevenueData,
  mockCategoryData,
  mockCustomerLocations,
  mockReviews,
} from '../mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      return mockDashboardSummary;
    }
    return apiClient.get<DashboardSummary>(ENDPOINTS.DASHBOARD_SUMMARY);
  },

  getRevenue: async (days: number = 30): Promise<RevenueDataPoint[]> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(400);
      return mockRevenueData.slice(0, days);
    }
    return apiClient.get<RevenueDataPoint[]>(
      `${ENDPOINTS.DASHBOARD_REVENUE}?days=${days}`
    );
  },

  getCategories: async (): Promise<CategoryDataPoint[]> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      return mockCategoryData;
    }
    return apiClient.get<CategoryDataPoint[]>(ENDPOINTS.DASHBOARD_CATEGORIES);
  },

  getCustomerLocations: async (): Promise<CustomerLocation[]> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      return mockCustomerLocations;
    }
    return apiClient.get<CustomerLocation[]>(
      ENDPOINTS.DASHBOARD_CUSTOMER_LOCATIONS
    );
  },

  getReviews: async (limit: number = 10): Promise<Review[]> => {
    if (API_CONFIG.USE_MOCK) {
      await delay(300);
      return mockReviews.slice(0, limit);
    }
    return apiClient.get<Review[]>(
      `${ENDPOINTS.REVIEWS}?limit=${limit}&sortBy=createdAt&order=desc`
    );
  },
};
