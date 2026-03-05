// Order Management Module - Mock Data
// This data is independent from the main portal data structure

export interface OMClient {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  billingAddress: string;
  gstNumber: string;
  notes: string;
}

export interface OMItem {
  id: string;
  name: string;
  sku?: string;
  defaultRate?: number;
  defaultGst: number;
  category?: string;
  description?: string;
}

export interface OMLogisticsPartner {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  defaultMode: 'Air' | 'Surface' | 'Road';
}

export interface OMPOLineItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
}

export interface OMPurchaseOrder {
  id: string;
  clientId: string;
  clientName: string;
  deliveryLocation: string;
  estimateNumber: string;
  estimateDate: string;
  poNumber: string;
  poDate: string;
  poReceivedDate: string;
  lineItems: OMPOLineItem[];
  totalQuantity: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  status: 'Draft' | 'Confirmed' | 'Partially Dispatched' | 'Fully Dispatched' | 'Closed';
  createdAt: string;
}

export interface OMDispatchLineItem {
  id: string;
  poLineItemId: string;
  itemId: string;
  itemName: string;
  dispatchQty: number;
  rate: number;
  amount: number;
  gstPercent: number;
  gstAmount: number;
  totalAmount: number;
}

export interface OMDispatch {
  id: string;
  poId: string;
  poNumber: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate: string;
  lineItems: OMDispatchLineItem[];
  totalDispatchQty: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  logisticsPartnerId: string;
  logisticsPartnerName: string;
  trackingNumber: string;
  expectedDeliveryDate: string;
  status: 'Created' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

// Mock Clients
export const omClients: OMClient[] = [
  {
    id: 'OM-CLI-001',
    name: 'SportZone Retail',
    contactPerson: 'Rajesh Kumar',
    email: 'rajesh@sportzone.com',
    phone: '+91 98765 43210',
    billingAddress: 'Plot 45, Industrial Area, Phase 2, Noida, UP - 201305',
    gstNumber: '09AABCU9603R1ZM',
    notes: 'Long-term client, prefer air shipping'
  },
  {
    id: 'OM-CLI-002',
    name: 'FitLife Corporate',
    contactPerson: 'Priya Sharma',
    email: 'priya@fitlife.com',
    phone: '+91 98712 34567',
    billingAddress: '234, MG Road, Bangalore, Karnataka - 560001',
    gstNumber: '29AABCU9603R1ZN',
    notes: 'Corporate wellness programs'
  },
  {
    id: 'OM-CLI-003',
    name: 'GymPro Distributors',
    contactPerson: 'Amit Patel',
    email: 'amit@gympro.com',
    phone: '+91 99887 65432',
    billingAddress: 'Shop 12, Commerce Hub, Mumbai, Maharashtra - 400001',
    gstNumber: '27AABCU9603R1ZO',
    notes: 'Bulk orders monthly'
  }
];

// Mock Items
export const omItems: OMItem[] = [
  {
    id: 'OM-ITM-001',
    name: 'Yoga Mat Premium',
    sku: 'YM-001',
    defaultRate: 850,
    defaultGst: 18,
    category: 'Yoga Equipment',
    description: '6mm thick premium yoga mat with carry strap'
  },
  {
    id: 'OM-ITM-002',
    name: 'Resistance Bands Set',
    sku: 'RB-SET-01',
    defaultRate: 650,
    defaultGst: 18,
    category: 'Strength Training',
    description: 'Set of 5 resistance bands with varying resistance levels'
  },
  {
    id: 'OM-ITM-003',
    name: 'Adjustable Dumbbell 10kg',
    sku: 'DB-10KG',
    defaultRate: 2400,
    defaultGst: 18,
    category: 'Weights',
    description: 'Adjustable dumbbell set, 2.5kg to 10kg'
  },
  {
    id: 'OM-ITM-004',
    name: 'Foam Roller',
    sku: 'FR-01',
    defaultRate: 450,
    defaultGst: 18,
    category: 'Recovery',
    description: 'High-density foam roller for muscle recovery'
  },
  {
    id: 'OM-ITM-005',
    name: 'Jump Rope Pro',
    sku: 'JR-PRO',
    defaultRate: 320,
    defaultGst: 18,
    category: 'Cardio',
    description: 'Professional speed jump rope with ball bearings'
  },
  {
    id: 'OM-ITM-006',
    name: 'Exercise Ball 65cm',
    sku: 'EB-65',
    defaultRate: 780,
    defaultGst: 18,
    category: 'Core Training',
    description: 'Anti-burst exercise ball with pump'
  }
];

// Mock Logistics Partners
export const omLogisticsPartners: OMLogisticsPartner[] = [
  {
    id: 'OM-LOG-001',
    name: 'BlueDart Express',
    contactPerson: 'Customer Service',
    phone: '1860 233 1234',
    email: 'corporate@bluedart.com',
    defaultMode: 'Air'
  },
  {
    id: 'OM-LOG-002',
    name: 'DTDC Courier',
    contactPerson: 'Business Team',
    phone: '1860 208 3344',
    email: 'b2b@dtdc.com',
    defaultMode: 'Surface'
  },
  {
    id: 'OM-LOG-003',
    name: 'Delhivery',
    contactPerson: 'Enterprise Support',
    phone: '011 4242 4242',
    email: 'enterprise@delhivery.com',
    defaultMode: 'Surface'
  },
  {
    id: 'OM-LOG-004',
    name: 'FedEx India',
    contactPerson: 'Corporate Sales',
    phone: '1800 209 6161',
    email: 'india@fedex.com',
    defaultMode: 'Air'
  }
];

// Mock Purchase Orders
export const omPurchaseOrders: OMPurchaseOrder[] = [
  {
    id: 'OM-PO-001',
    clientId: 'OM-CLI-001',
    clientName: 'SportZone Retail',
    deliveryLocation: 'Noida',
    estimateNumber: 'FP/24-25/001',
    estimateDate: '2024-12-15',
    poNumber: 'SZ/PO/2024/123',
    poDate: '2024-12-18',
    poReceivedDate: '2024-12-20',
    lineItems: [
      {
        id: 'PO-LINE-001',
        itemId: 'OM-ITM-001',
        itemName: 'Yoga Mat Premium',
        quantity: 100,
        rate: 850,
        amount: 85000,
        gstPercent: 18,
        gstAmount: 15300,
        totalAmount: 100300
      },
      {
        id: 'PO-LINE-002',
        itemId: 'OM-ITM-002',
        itemName: 'Resistance Bands Set',
        quantity: 50,
        rate: 650,
        amount: 32500,
        gstPercent: 18,
        gstAmount: 5850,
        totalAmount: 38350
      }
    ],
    totalQuantity: 150,
    subtotal: 117500,
    totalGst: 21150,
    grandTotal: 138650,
    status: 'Partially Dispatched',
    createdAt: '2024-12-20T10:30:00Z'
  },
  {
    id: 'OM-PO-002',
    clientId: 'OM-CLI-002',
    clientName: 'FitLife Corporate',
    deliveryLocation: 'Bangalore',
    estimateNumber: 'FP/24-25/002',
    estimateDate: '2025-01-10',
    poNumber: 'FL/2025/PO-045',
    poDate: '2025-01-12',
    poReceivedDate: '2025-01-14',
    lineItems: [
      {
        id: 'PO-LINE-003',
        itemId: 'OM-ITM-003',
        itemName: 'Adjustable Dumbbell 10kg',
        quantity: 80,
        rate: 2400,
        amount: 192000,
        gstPercent: 18,
        gstAmount: 34560,
        totalAmount: 226560
      },
      {
        id: 'PO-LINE-004',
        itemId: 'OM-ITM-004',
        itemName: 'Foam Roller',
        quantity: 120,
        rate: 450,
        amount: 54000,
        gstPercent: 18,
        gstAmount: 9720,
        totalAmount: 63720
      },
      {
        id: 'PO-LINE-005',
        itemId: 'OM-ITM-006',
        itemName: 'Exercise Ball 65cm',
        quantity: 60,
        rate: 780,
        amount: 46800,
        gstPercent: 18,
        gstAmount: 8424,
        totalAmount: 55224
      }
    ],
    totalQuantity: 260,
    subtotal: 292800,
    totalGst: 52704,
    grandTotal: 345504,
    status: 'Confirmed',
    createdAt: '2025-01-14T09:15:00Z'
  },
  {
    id: 'OM-PO-003',
    clientId: 'OM-CLI-003',
    clientName: 'GymPro Distributors',
    deliveryLocation: 'Mumbai',
    estimateNumber: 'FP/24-25/003',
    estimateDate: '2025-02-01',
    poNumber: 'GP/PO/2025/078',
    poDate: '2025-02-03',
    poReceivedDate: '2025-02-05',
    lineItems: [
      {
        id: 'PO-LINE-006',
        itemId: 'OM-ITM-005',
        itemName: 'Jump Rope Pro',
        quantity: 200,
        rate: 320,
        amount: 64000,
        gstPercent: 18,
        gstAmount: 11520,
        totalAmount: 75520
      },
      {
        id: 'PO-LINE-007',
        itemId: 'OM-ITM-001',
        itemName: 'Yoga Mat Premium',
        quantity: 150,
        rate: 850,
        amount: 127500,
        gstPercent: 18,
        gstAmount: 22950,
        totalAmount: 150450
      }
    ],
    totalQuantity: 350,
    subtotal: 191500,
    totalGst: 34470,
    grandTotal: 225970,
    status: 'Fully Dispatched',
    createdAt: '2025-02-05T11:45:00Z'
  }
];

// Mock Dispatches
export const omDispatches: OMDispatch[] = [
  {
    id: 'OM-DSP-001',
    poId: 'OM-PO-001',
    poNumber: 'SZ/PO/2024/123',
    clientId: 'OM-CLI-001',
    clientName: 'SportZone Retail',
    invoiceNumber: 'FP/LLP/24-25/001',
    invoiceDate: '2024-12-22',
    lineItems: [
      {
        id: 'DSP-LINE-001',
        poLineItemId: 'PO-LINE-001',
        itemId: 'OM-ITM-001',
        itemName: 'Yoga Mat Premium',
        dispatchQty: 60,
        rate: 850,
        amount: 51000,
        gstPercent: 18,
        gstAmount: 9180,
        totalAmount: 60180
      },
      {
        id: 'DSP-LINE-002',
        poLineItemId: 'PO-LINE-002',
        itemId: 'OM-ITM-002',
        itemName: 'Resistance Bands Set',
        dispatchQty: 30,
        rate: 650,
        amount: 19500,
        gstPercent: 18,
        gstAmount: 3510,
        totalAmount: 23010
      }
    ],
    totalDispatchQty: 90,
    subtotal: 70500,
    totalGst: 12690,
    grandTotal: 83190,
    logisticsPartnerId: 'OM-LOG-001',
    logisticsPartnerName: 'BlueDart Express',
    trackingNumber: 'BD123456789IN',
    expectedDeliveryDate: '2024-12-25',
    status: 'Delivered',
    createdAt: '2024-12-22T14:20:00Z'
  },
  {
    id: 'OM-DSP-002',
    poId: 'OM-PO-003',
    poNumber: 'GP/PO/2025/078',
    clientId: 'OM-CLI-003',
    clientName: 'GymPro Distributors',
    invoiceNumber: 'FP/LLP/24-25/002',
    invoiceDate: '2025-02-07',
    lineItems: [
      {
        id: 'DSP-LINE-003',
        poLineItemId: 'PO-LINE-006',
        itemId: 'OM-ITM-005',
        itemName: 'Jump Rope Pro',
        dispatchQty: 200,
        rate: 320,
        amount: 64000,
        gstPercent: 18,
        gstAmount: 11520,
        totalAmount: 75520
      },
      {
        id: 'DSP-LINE-004',
        poLineItemId: 'PO-LINE-007',
        itemId: 'OM-ITM-001',
        itemName: 'Yoga Mat Premium',
        dispatchQty: 150,
        rate: 850,
        amount: 127500,
        gstPercent: 18,
        gstAmount: 22950,
        totalAmount: 150450
      }
    ],
    totalDispatchQty: 350,
    subtotal: 191500,
    totalGst: 34470,
    grandTotal: 225970,
    logisticsPartnerId: 'OM-LOG-003',
    logisticsPartnerName: 'Delhivery',
    trackingNumber: 'DLVY987654321',
    expectedDeliveryDate: '2025-02-10',
    status: 'Dispatched',
    createdAt: '2025-02-07T10:00:00Z'
  }
];

// Helper function to calculate dispatched quantities per PO line item
export function getDispatchedQuantity(poId: string, poLineItemId: string): number {
  let total = 0;
  omDispatches
    .filter(d => d.poId === poId)
    .forEach(dispatch => {
      dispatch.lineItems.forEach(item => {
        if (item.poLineItemId === poLineItemId) {
          total += item.dispatchQty;
        }
      });
    });
  return total;
}

// Helper function to calculate remaining quantity for PO line item
export function getRemainingQuantity(poId: string, poLineItemId: string, orderedQty: number): number {
  const dispatched = getDispatchedQuantity(poId, poLineItemId);
  return orderedQty - dispatched;
}

// Helper function to calculate total dispatched quantity for entire PO
export function getTotalDispatchedForPO(poId: string): number {
  let total = 0;
  omDispatches
    .filter(d => d.poId === poId)
    .forEach(dispatch => {
      total += dispatch.totalDispatchQty;
    });
  return total;
}

// Helper function to get dispatches for a PO
export function getDispatchesForPO(poId: string): OMDispatch[] {
  return omDispatches.filter(d => d.poId === poId);
}
