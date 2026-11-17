import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { notify } from '../components/common/Toast';

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productApi.list(params).then((r) => r.data),
    keepPreviousData: true,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      qc.invalidateQueries(['products']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Produit créé');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['products']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Produit mis à jour');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.remove,
    onSuccess: () => {
      qc.invalidateQueries(['products']);
      qc.invalidateQueries(['dashboard']);
      notify.success('Produit supprimé');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}
