export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  CLIENT: 'CLIENT',
};

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const MOVEMENT_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT: 'ADJUSTMENT',
};

export const MOVEMENT_TYPE_LABELS = {
  IN: 'Entrée',
  OUT: 'Sortie',
  ADJUSTMENT: 'Ajustement',
};