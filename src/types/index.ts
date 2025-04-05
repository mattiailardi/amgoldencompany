
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  houseNumber: string;
  zipCode: string;
  customerType: CustomerType;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

export enum CustomerType {
  Regular = 0,
  Business = 1,
  VIP = 2
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  unit: string;
  unitPrice: number;
  tax: number;
  currentQuantity: number;
  thresholdQuantity?: number;
  notes?: string;
  categoryName?: string; // For joining with category
}

export interface AccountingCategory {
  id: number;
  name: string;
  type: AccountingCategoryType;
}

export enum AccountingCategoryType {
  Income = 0,
  Expense = 1
}

export interface AccountingRecord {
  id: number;
  date: string;
  categoryId: number;
  amount: number;
  notes?: string;
  categoryName?: string; // For joining with category
  categoryType?: AccountingCategoryType; // For joining with category
}

export interface Order {
  id: number;
  creationDate: string;
  customerId: number;
  requestedDeliveryTime: string;
  estimatedDeliveryTime?: string;
  deliveryNotes?: string;
  status: OrderStatus;
  customerName?: string; // For joining with customer
  customerAddress?: string; // For joining with customer
  items?: OrderItem[]; // For joining with order items
  total?: number; // Calculated field
}

export enum OrderStatus {
  New = 0,
  InPreparation = 1,
  ReadyForDelivery = 2,
  InDelivery = 3,
  Delivered = 4,
  Cancelled = 5
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtOrder: number;
  notes?: string;
  productName?: string; // For joining with product
}

export interface HaccpChecklist {
  id: number;
  name: string;
  description?: string;
  frequency: string;
}

export interface HaccpRecord {
  id: number;
  checklistId: number;
  datetime: string;
  userId?: number;
  result: string;
  notes?: string;
  correctiveAction?: string;
  checklistName?: string; // For joining with checklist
  userName?: string; // For joining with user
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface Shift {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  notes?: string;
  employeeName?: string; // For joining with employee
}

export interface Sale {
  id: number;
  datetime: string;
  productId: number;
  quantity: number;
  totalPrice: number;
  orderId?: number;
  productName?: string; // For joining with product
}

export interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  productsSoldToday: number;
}

export interface ChartData {
  label: string;
  value: number;
}

// Mock data functions
export const generateMockData = () => {
  return {
    customers: generateMockCustomers(),
    products: generateMockProducts(),
    categories: generateMockCategories(),
    orders: generateMockOrders(),
    employees: generateMockEmployees(),
    sales: generateMockSales(),
    accountingRecords: generateMockAccountingRecords()
  };
};

export const generateMockCustomers = (): Customer[] => {
  return [
    { id: 1, firstName: 'Marco', lastName: 'Rossi', phone: '3391234567', address: 'Via Roma', houseNumber: '123', zipCode: '00100', customerType: CustomerType.Regular, notes: 'Cliente abituale', latitude: 41.9028, longitude: 12.4964 },
    { id: 2, firstName: 'Anna', lastName: 'Bianchi', phone: '3397654321', address: 'Via Milano', houseNumber: '45', zipCode: '00100', customerType: CustomerType.VIP, notes: 'Preferisce consegne rapide', latitude: 41.9028, longitude: 12.4964 },
    { id: 3, firstName: 'Luigi', lastName: 'Verdi', phone: '3395555555', address: 'Via Napoli', houseNumber: '67', zipCode: '00100', customerType: CustomerType.Business, notes: 'Ufficio al piano 3', latitude: 41.9028, longitude: 12.4964 },
    { id: 4, firstName: 'Giulia', lastName: 'Neri', phone: '3396666666', address: 'Via Firenze', houseNumber: '89', zipCode: '00100', customerType: CustomerType.Regular, latitude: 41.9028, longitude: 12.4964 },
    { id: 5, firstName: 'Roberto', lastName: 'Gialli', phone: '3397777777', address: 'Via Torino', houseNumber: '10', zipCode: '00100', customerType: CustomerType.Regular, latitude: 41.9028, longitude: 12.4964 }
  ];
};

export const generateMockCategories = (): ProductCategory[] => {
  return [
    { id: 1, name: 'Pizze' },
    { id: 2, name: 'Bevande' },
    { id: 3, name: 'Dessert' },
    { id: 4, name: 'Antipasti' },
    { id: 5, name: 'Ingredienti' }
  ];
};

export const generateMockProducts = (): Product[] => {
  return [
    { id: 1, name: 'Pizza Margherita', categoryId: 1, unit: 'pezzo', unitPrice: 6.50, tax: 10, currentQuantity: 0, categoryName: 'Pizze' },
    { id: 2, name: 'Pizza Diavola', categoryId: 1, unit: 'pezzo', unitPrice: 8.00, tax: 10, currentQuantity: 0, categoryName: 'Pizze' },
    { id: 3, name: 'Coca Cola', categoryId: 2, unit: 'bottiglia', unitPrice: 2.50, tax: 22, currentQuantity: 48, thresholdQuantity: 20, categoryName: 'Bevande' },
    { id: 4, name: 'Farina 00', categoryId: 5, unit: 'kg', unitPrice: 1.20, tax: 4, currentQuantity: 25, thresholdQuantity: 10, notes: 'Per impasto pizza', categoryName: 'Ingredienti' },
    { id: 5, name: 'Mozzarella', categoryId: 5, unit: 'kg', unitPrice: 7.50, tax: 4, currentQuantity: 5, thresholdQuantity: 3, notes: 'Per pizze', categoryName: 'Ingredienti' },
    { id: 6, name: 'Pomodoro pelato', categoryId: 5, unit: 'barattolo', unitPrice: 1.80, tax: 4, currentQuantity: 30, thresholdQuantity: 15, categoryName: 'Ingredienti' },
    { id: 7, name: 'Tiramisu', categoryId: 3, unit: 'porzione', unitPrice: 4.00, tax: 10, currentQuantity: 10, thresholdQuantity: 5, categoryName: 'Dessert' },
    { id: 8, name: 'Bruschette', categoryId: 4, unit: 'porzione', unitPrice: 3.50, tax: 10, currentQuantity: 0, categoryName: 'Antipasti' }
  ];
};

export const generateMockOrders = (): Order[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return [
    { 
      id: 1, 
      creationDate: new Date(today.getTime() - 30*60000).toISOString(), 
      customerId: 1, 
      requestedDeliveryTime: new Date(today.getTime() + 30*60000).toISOString(), 
      estimatedDeliveryTime: new Date(today.getTime() + 35*60000).toISOString(), 
      status: OrderStatus.InPreparation,
      customerName: 'Marco Rossi',
      customerAddress: 'Via Roma, 123',
      total: 19.5,
      items: [
        { id: 1, orderId: 1, productId: 1, quantity: 2, priceAtOrder: 6.50, productName: 'Pizza Margherita' },
        { id: 2, orderId: 1, productId: 3, quantity: 2, priceAtOrder: 2.50, productName: 'Coca Cola' },
        { id: 3, orderId: 1, productId: 7, quantity: 1, priceAtOrder: 4.00, productName: 'Tiramisu' }
      ]
    },
    { 
      id: 2, 
      creationDate: new Date(today.getTime() - 20*60000).toISOString(), 
      customerId: 2, 
      requestedDeliveryTime: new Date(today.getTime() + 40*60000).toISOString(), 
      deliveryNotes: 'Citofonare piano 2',
      status: OrderStatus.New,
      customerName: 'Anna Bianchi',
      customerAddress: 'Via Milano, 45',
      total: 10.5,
      items: [
        { id: 4, orderId: 2, productId: 2, quantity: 1, priceAtOrder: 8.00, productName: 'Pizza Diavola' },
        { id: 5, orderId: 2, productId: 3, quantity: 1, priceAtOrder: 2.50, productName: 'Coca Cola' }
      ]
    },
    { 
      id: 3, 
      creationDate: new Date(today.getTime() - 60*60000).toISOString(), 
      customerId: 3, 
      requestedDeliveryTime: new Date(today.getTime() - 15*60000).toISOString(), 
      estimatedDeliveryTime: new Date(today.getTime() - 20*60000).toISOString(), 
      status: OrderStatus.Delivered,
      customerName: 'Luigi Verdi',
      customerAddress: 'Via Napoli, 67',
      total: 14.5,
      items: [
        { id: 6, orderId: 3, productId: 1, quantity: 1, priceAtOrder: 6.50, productName: 'Pizza Margherita' },
        { id: 7, orderId: 3, productId: 8, quantity: 1, priceAtOrder: 3.50, productName: 'Bruschette' },
        { id: 8, orderId: 3, productId: 3, quantity: 1, priceAtOrder: 2.50, productName: 'Coca Cola' },
        { id: 9, orderId: 3, productId: 7, quantity: 0.5, priceAtOrder: 4.00, notes: 'Mezza porzione', productName: 'Tiramisu' }
      ]
    }
  ];
};

export const generateMockEmployees = (): Employee[] => {
  return [
    { id: 1, firstName: 'Paolo', lastName: 'Ferrari', role: 'Pizzaiolo', phone: '3391111111', email: 'paolo@pizzeria.it' },
    { id: 2, firstName: 'Francesca', lastName: 'Romano', role: 'Cassiere', phone: '3392222222', email: 'francesca@pizzeria.it' },
    { id: 3, firstName: 'Alessandro', lastName: 'Russo', role: 'Fattorino', phone: '3393333333', email: 'alessandro@pizzeria.it' },
    { id: 4, firstName: 'Laura', lastName: 'Colombo', role: 'Manager', phone: '3394444444', email: 'laura@pizzeria.it' }
  ];
};

export const generateMockSales = (): Sale[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  
  return [
    { id: 1, datetime: today, productId: 1, quantity: 15, totalPrice: 97.5, productName: 'Pizza Margherita' },
    { id: 2, datetime: today, productId: 2, quantity: 10, totalPrice: 80, productName: 'Pizza Diavola' },
    { id: 3, datetime: today, productId: 3, quantity: 20, totalPrice: 50, productName: 'Coca Cola' },
    { id: 4, datetime: yesterday, productId: 1, quantity: 18, totalPrice: 117, productName: 'Pizza Margherita' },
    { id: 5, datetime: yesterday, productId: 2, quantity: 12, totalPrice: 96, productName: 'Pizza Diavola' },
    { id: 6, datetime: yesterday, productId: 7, quantity: 8, totalPrice: 32, productName: 'Tiramisu' }
  ];
};

export const generateMockAccountingRecords = (): AccountingRecord[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString();
  const twoDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString();
  
  return [
    { id: 1, date: today, categoryId: 1, amount: 450, notes: 'Incasso pizze', categoryName: 'Pizzeria', categoryType: AccountingCategoryType.Income },
    { id: 2, date: today, categoryId: 2, amount: -120, notes: 'Acquisto ingredienti', categoryName: 'Materie prime', categoryType: AccountingCategoryType.Expense },
    { id: 3, date: yesterday, categoryId: 1, amount: 380, notes: 'Incasso pizze', categoryName: 'Pizzeria', categoryType: AccountingCategoryType.Income },
    { id: 4, date: yesterday, categoryId: 3, amount: -50, notes: 'Bolletta luce', categoryName: 'Utenze', categoryType: AccountingCategoryType.Expense },
    { id: 5, date: twoDaysAgo, categoryId: 1, amount: 410, notes: 'Incasso pizze', categoryName: 'Pizzeria', categoryType: AccountingCategoryType.Income },
    { id: 6, date: twoDaysAgo, categoryId: 4, amount: -90, notes: 'Materiale pulizia', categoryName: 'Manutenzione', categoryType: AccountingCategoryType.Expense }
  ];
};
