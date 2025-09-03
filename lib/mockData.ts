export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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
  {
    id: '1',
    name: 'Premium Basketball',
    sku: 'FP-BB-001',
    price: 89.99,
    stock: 150,
    category: 'Basketball',
    description: 'Professional grade basketball with superior grip and durability',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
  },
  {
    id: '2',
    name: 'Football Cleats Pro',
    sku: 'FP-FC-002',
    price: 159.99,
    stock: 85,
    category: 'Footwear',
    description: 'High-performance football cleats for professional athletes',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  },
  {
    id: '3',
    name: 'Tennis Racket Elite',
    sku: 'FP-TR-003',
    price: 199.99,
    stock: 45,
    category: 'Tennis',
    description: 'Lightweight tennis racket with advanced string technology',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
  },
  {
    id: '4',
    name: 'Soccer Ball Official',
    sku: 'FP-SB-004',
    price: 49.99,
    stock: 200,
    category: 'Soccer',
    description: 'FIFA approved soccer ball for competitive play',
    image: 'https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400'
  },
  {
    id: '5',
    name: 'Baseball Glove Pro',
    sku: 'FP-BG-005',
    price: 129.99,
    stock: 60,
    category: 'Baseball',
    description: 'Premium leather baseball glove for infielders',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400'
  },
  {
    id: '6',
    name: 'Volleyball Net System',
    sku: 'FP-VN-006',
    price: 299.99,
    stock: 25,
    category: 'Volleyball',
    description: 'Complete volleyball net system with posts and guy wires',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400'
  },
  {
    id: '7',
    name: 'Hockey Stick Carbon',
    sku: 'FP-HS-007',
    price: 179.99,
    stock: 40,
    category: 'Hockey',
    description: 'Lightweight carbon fiber hockey stick for enhanced performance',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
  },
  {
    id: '8',
    name: 'Swimming Goggles Pro',
    sku: 'FP-SG-008',
    price: 39.99,
    stock: 120,
    category: 'Swimming',
    description: 'Anti-fog swimming goggles with UV protection',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
  }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'client@acmecorp.com',
    company: 'ACME Corporation',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    name: 'Mike Davis',
    email: 'client@techstart.com',
    company: 'TechStart Inc',
    status: 'active',
    createdAt: '2024-02-20'
  }
];

export const MOCK_ORDERS: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2024-001',
    clientId: '1',
    clientName: 'John Smith',
    clientEmail: 'client@acmecorp.com',
    company: 'ACME Corporation',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 10 },
      { product: MOCK_PRODUCTS[3], quantity: 5 }
    ],
    total: 1149.85,
    status: 'approved',
    deliveryAddress: '123 Business Ave, Suite 100, New York, NY 10001',
    billingContact: 'John Smith - accounting@acmecorp.com',
    notes: 'Urgent delivery needed for upcoming tournament',
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-16T09:15:00Z'
  },
  {
    id: '2',
    poNumber: 'PO-2024-002',
    clientId: '3',
    clientName: 'Mike Davis',
    clientEmail: 'client@techstart.com',
    company: 'TechStart Inc',
    items: [
      { product: MOCK_PRODUCTS[1], quantity: 8 },
      { product: MOCK_PRODUCTS[2], quantity: 3 }
    ],
    total: 1879.89,
    status: 'pending',
    deliveryAddress: '456 Tech Park Dr, Building C, San Francisco, CA 94107',
    billingContact: 'Mike Davis - finance@techstart.com',
    notes: 'Standard shipping is fine',
    createdAt: '2024-12-20T14:20:00Z',
    updatedAt: '2024-12-20T14:20:00Z'
  }
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
