import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export function useStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.stats().then((r) => r.data.data),
    staleTime: 0, // <-- Force le rechargement à chaque fois
  });
}

export function useSalesByDay(period = '7days') {
  return useQuery({
    queryKey: ['dashboard', 'sales', period],
    queryFn: () => dashboardApi.salesByDay(period).then((r) => r.data.data),
    staleTime: 0, // <-- Force le rechargement
  });
}

export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: ['dashboard', 'top-products', limit],
    queryFn: () => dashboardApi.topProducts(limit).then((r) => r.data.data),
    staleTime: 0, // <-- Force le rechargement
  });
}

export function useProductsByCategory() {
  return useQuery({
    queryKey: ['dashboard', 'products-by-category'],
    queryFn: () => dashboardApi.productsByCategory().then((r) => r.data.data),
    staleTime: 0, 
  });
}