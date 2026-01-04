import { Product } from "./generated/prisma";

export interface CartItem {
  product: Product;
  quantity: number;
  isBundleItem?: boolean;
  bundleQuantity?: number; // quantity per bundle
  bundleCount?: number; // number of bundles
  bundleGroupId?: string; // unique identifier for each bundle group
  cartItemId?: string; // unique identifier for each cart item (including bundles)
}

export interface PurchaseOrder {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  company: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  deliveryAddress: string;
  billingContact: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const MOCK_PRODUCTS: Product[] = [
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Shruti',
    email: 'shrutsn@github.com',
    company: 'Github',
    status: 'active',
    createdAt: '2026-09-05'
  },
];

export const MOCK_ORDERS: PurchaseOrder[] = [
];

export const PRODUCT_CATEGORIES = [
  'All Categories',
  'Basketball',
  'Footwear',
  'Tennis',
  'Soccer',
  'Baseball',
  'Volleyball',
  'Hockey',
  'Swimming'
];

// Utility functions for localStorage management
export const getStoredData = function<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredData = function<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generate a new PO number
export const generatePONumber = (): string => {
  const year = new Date().getFullYear();
  const orders = getStoredData<PurchaseOrder[]>('fitplay_orders', MOCK_ORDERS);
  const nextNumber = orders.length + 1;
  return `PO-${year}-${String(nextNumber).padStart(3, '0')}`;
};
