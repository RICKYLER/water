// Shared data storage utility for orders and deliveries
export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions?: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';
  priority: 'Normal' | 'High' | 'Urgent';
  assignedDriver?: string;
  orderDate: string;
  deliveryFee: number;
  estimatedDuration?: string;
  rating?: number;
  feedback?: string;
  deliveredTime?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Refunded';
  orderType?: 'Delivery' | 'Pickup';
}

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface Notification {
  id: string;
  type: 'new_order' | 'order_update' | 'delivery_assigned' | 'delivery_completed';
  title: string;
  message: string;
  orderId: string;
  recipientType: 'admin' | 'driver' | 'customer';
  recipientId?: string; // driver name or customer email
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Storage keys
const ORDERS_KEY = 'waterStation_orders';
const CUSTOMERS_KEY = 'waterStation_customers';
const NOTIFICATIONS_KEY = 'waterStation_notifications';

// Initialize with some sample data if storage is empty
const initializeStorage = () => {
  const existingOrders = localStorage.getItem(ORDERS_KEY);
  if (!existingOrders) {
    const sampleOrders: Order[] = [
      {
        id: "ORD-001",
        customerName: "Maria Santos",
        customerPhone: "+63 912 345 6789",
        customerEmail: "maria.santos@email.com",
        deliveryAddress: "123 Main St, Quezon City",
        deliveryDate: "2024-01-16",
        deliveryTime: "2:00 PM",
        specialInstructions: "Please call before delivery",
        items: [
          { productName: "5-Gallon Water Jug", quantity: 3, price: 25 },
          { productName: "1-Gallon Water Bottle", quantity: 5, price: 15 }
        ],
        total: 150,
        status: "Confirmed",
        priority: "Normal",
        assignedDriver: "Carlos",
        orderDate: "2024-01-15",
        deliveryFee: 50,
        estimatedDuration: "30 mins"
      },
      {
        id: "ORD-002",
        customerName: "Juan Dela Cruz",
        customerPhone: "+63 917 234 5678",
        customerEmail: "juan.delacruz@email.com",
        deliveryAddress: "456 Oak Ave, Makati City",
        deliveryDate: "2024-01-16",
        deliveryTime: "9:00 AM",
        specialInstructions: "Urgent delivery - customer event",
        items: [
          { productName: "5-Gallon Water Jug", quantity: 8, price: 25 }
        ],
        total: 275,
        status: "In Transit",
        priority: "High",
        assignedDriver: "Carlos",
        orderDate: "2024-01-15",
        deliveryFee: 75,
        estimatedDuration: "45 mins"
      },
      {
        id: "ORD-003",
        customerName: "Ana Rodriguez",
        customerPhone: "+63 905 876 5432",
        customerEmail: "ana.rodriguez@email.com",
        deliveryAddress: "789 Pine Rd, Pasig City",
        deliveryDate: "2024-01-15",
        deliveryTime: "11:30 AM",
        items: [
          { productName: "1-Gallon Water Bottle", quantity: 10, price: 15 }
        ],
        total: 200,
        status: "Delivered",
        priority: "Normal",
        assignedDriver: "Miguel",
        orderDate: "2024-01-15",
        deliveryFee: 50,
        estimatedDuration: "25 mins",
        deliveredTime: "11:45 AM",
        rating: 5,
        feedback: "Great service, on time delivery!"
      }
    ];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(sampleOrders));
  }
};



// Order management functions
export const getAllOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

export const getOrderById = (id: string): Order | null => {
  const orders = getAllOrders();
  return orders.find(order => order.id === id) || null;
};

export const addOrder = (order: Order): void => {
  const orders = getAllOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  createNewOrderNotifications(order);
};

export const updateOrder = (id: string, updates: Partial<Order>): void => {
  const orders = getAllOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], ...updates };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};

export const deleteOrder = (id: string): void => {
  const orders = getAllOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));
};

export const getDriverDeliveries = (driverName: string): Order[] => {
  const orders = getAllOrders();
  return orders.filter(order => 
    order.assignedDriver?.toLowerCase() === driverName.toLowerCase() ||
    (driverName.toLowerCase().includes('carlos') && order.assignedDriver?.toLowerCase() === 'carlos') ||
    (driverName.toLowerCase().includes('miguel') && order.assignedDriver?.toLowerCase() === 'miguel')
  );
};

export const getOrdersByStatus = (status: Order['status']): Order[] => {
  const orders = getAllOrders();
  return orders.filter(order => order.status === status);
};

export const getOrdersByDateRange = (startDate: string, endDate: string): Order[] => {
  const orders = getAllOrders();
  return orders.filter(order => {
    const orderDate = new Date(order.orderDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return orderDate >= start && orderDate <= end;
  });
};

// Customer management functions
export const getCustomerData = (email: string): CustomerData | null => {
  if (typeof window === 'undefined') return null;
  const customers = localStorage.getItem(CUSTOMERS_KEY);
  if (!customers) return null;
  const customerList: CustomerData[] = JSON.parse(customers);
  return customerList.find(customer => customer.email === email) || null;
};

export const saveCustomerData = (customerData: CustomerData): void => {
  const customers = localStorage.getItem(CUSTOMERS_KEY);
  const customerList: CustomerData[] = customers ? JSON.parse(customers) : [];
  
  const existingIndex = customerList.findIndex(customer => customer.email === customerData.email);
  if (existingIndex !== -1) {
    customerList[existingIndex] = customerData;
  } else {
    customerList.push(customerData);
  }
  
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customerList));
};

// Utility functions
export const generateOrderId = (): string => {
  const orders = getAllOrders();
  const orderCount = orders.length + 1;
  return `ORD-${orderCount.toString().padStart(3, '0')}`;
};

export const calculateDeliveryFee = (address: string, items: OrderItem[]): number => {
  // Base delivery fee
  let fee = 50;
  
  // Add extra fee for high quantity orders
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalQuantity > 10) {
    fee += 25;
  }
  
  // Add extra fee for certain areas (simplified logic)
  const lowerAddress = address.toLowerCase();
  if (lowerAddress.includes('makati') || lowerAddress.includes('bgc')) {
    fee += 25;
  }
  
  return fee;
};

export const assignDriverToOrder = (orderId: string): string => {
  // Simple round-robin assignment
  const drivers = ['Carlos', 'Miguel'];
  const orders = getAllOrders();
  const driverWorkload = drivers.map(driver => ({
    name: driver,
    activeOrders: orders.filter(order => 
      order.assignedDriver === driver && 
      ['Pending', 'Confirmed', 'In Transit'].includes(order.status)
    ).length
  }));
  
  // Assign to driver with least workload
  const assignedDriver = driverWorkload.reduce((prev, current) => 
    prev.activeOrders <= current.activeOrders ? prev : current
  ).name;
  
  updateOrder(orderId, { assignedDriver });
  
  // Get the updated order to create notification
  const order = getOrderById(orderId);
  if (order) {
    addNotification({
      type: 'delivery_assigned',
      title: 'New Delivery Assigned',
      message: `You have been assigned delivery for order ${order.id} - ${order.customerName}`,
      orderId: order.id,
      recipientType: 'driver',
      recipientId: assignedDriver,
      read: false,
      priority: order.priority === 'Urgent' ? 'high' : order.priority === 'High' ? 'medium' : 'low'
    });
  }
  
  return assignedDriver;
};

// Notification management functions
export const getAllNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : [];
};

export const getNotificationsByRecipient = (recipientType: 'admin' | 'driver' | 'customer', recipientId?: string): Notification[] => {
  const notifications = getAllNotifications();
  return notifications.filter(notification => {
    if (notification.recipientType === recipientType) {
      if (recipientType === 'admin') return true;
      return notification.recipientId === recipientId;
    }
    return false;
  });
};

export const getUnreadNotifications = (recipientType: 'admin' | 'driver' | 'customer', recipientId?: string): Notification[] => {
  const notifications = getNotificationsByRecipient(recipientType, recipientId);
  return notifications.filter(notification => !notification.read);
};

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): void => {
  const notifications = getAllNotifications();
  const newNotification: Notification = {
    ...notification,
    id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getAllNotifications();
  const index = notifications.findIndex(notification => notification.id === notificationId);
  if (index !== -1) {
    notifications[index].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }
};

export const markAllNotificationsAsRead = (recipientType: 'admin' | 'driver' | 'customer', recipientId?: string): void => {
  const notifications = getAllNotifications();
  const updatedNotifications = notifications.map(notification => {
    if (notification.recipientType === recipientType) {
      if (recipientType === 'admin' || notification.recipientId === recipientId) {
        return { ...notification, read: true };
      }
    }
    return notification;
  });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

export const deleteNotification = (notificationId: string): void => {
  const notifications = getAllNotifications();
  const filteredNotifications = notifications.filter(notification => notification.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
};

// Helper function to create notifications when new orders are created
export const createNewOrderNotifications = (order: Order): void => {
  // Notify admin about new order
  addNotification({
    type: 'new_order',
    title: 'New Order Received',
    message: `New order ${order.id} from ${order.customerName} for ₱${order.total}`,
    orderId: order.id,
    recipientType: 'admin',
    read: false,
    priority: order.priority === 'Urgent' ? 'high' : order.priority === 'High' ? 'medium' : 'low'
  });

  if (order.assignedDriver) {
    addNotification({
      type: 'delivery_assigned',
      title: 'New Delivery Assigned',
      message: `You have been assigned delivery for order ${order.id} - ${order.customerName}`,
      orderId: order.id,
      recipientType: 'driver',
      recipientId: order.assignedDriver,
      read: false,
      priority: order.priority === 'Urgent' ? 'high' : order.priority === 'High' ? 'medium' : 'low'
    });
  }
};