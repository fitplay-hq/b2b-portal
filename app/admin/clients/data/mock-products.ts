export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Notebook",
    sku: "NB001",
    category: "stationery",
    stock: 150,
  },
  {
    id: "2",
    name: "Executive Pen Set",
    sku: "PS001",
    category: "stationery",
    stock: 75,
  },
  {
    id: "3",
    name: "Travel Mug",
    sku: "TM001",
    category: "drinkware",
    stock: 200,
  },
  {
    id: "4",
    name: "Wireless Mouse",
    sku: "WM001",
    category: "travelAndTech",
    stock: 50,
  },
  {
    id: "5",
    name: "Branded T-Shirt",
    sku: "TS001",
    category: "apparel",
    stock: 100,
  },
];