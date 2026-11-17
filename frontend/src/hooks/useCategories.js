import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { notify } from '../components/common/Toast';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list().then((r) => r.data.data),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      qc.invalidateQueries(['categories']);
      notify.success('Catégorie créée');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries(['categories']);
      notify.success('Catégorie mise à jour');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => {
      qc.invalidateQueries(['categories']);
      notify.success('Catégorie supprimée');
    },
    onError: (e) => notify.error(e.response?.data?.message || 'Erreur'),
  });
}