import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { notify } from '../components/common/Toast';

export function useOrders(params = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderApi.list(params).then((r) => r.data),
    keepPreviousData: true,
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries(['orders']);
      qc.invalidateQueries(['products']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Commande créée');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries(['orders']);
      qc.invalidateQueries(['order']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Statut mis à jour');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries(['orders']);
      qc.invalidateQueries(['order']);
      notify.success('Commande annulée');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}