import { apiRequest } from './apiClient';
import { Order, OrderStatusType, PaymentStatusType } from '../../types';

export const orderService = {
  async getAllOrdersAdmin(params?: {
    status?: string;
    paymentStatus?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.paymentStatus) query.append('paymentStatus', params.paymentStatus);
    if (params?.pageNumber) query.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) query.append('pageSize', (params.pageSize || 50).toString());

    const res = await apiRequest<any>(`/admin/orders?${query.toString()}`);
    if (res.success && res.data?.items) {
      return res.data.items.map(mapBackendOrderToFrontend);
    }
    return [];
  },

  async getCustomerOrders(): Promise<Order[]> {
    const res = await apiRequest<any>('/customer/orders');
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(mapBackendOrderToFrontend);
    }
    return [];
  },

  async createOrder(payload: any): Promise<Order> {
    const res = await apiRequest<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendOrderToFrontend(res.data);
  },

  async updateOrderStatus(id: string, status: OrderStatusType): Promise<boolean> {
    const res = await apiRequest<any>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.success;
  },

  async verifyPayment(
    id: string,
    action: 'approve' | 'reject',
    remarks?: string
  ): Promise<boolean> {
    const res = await apiRequest<any>(`/admin/orders/${id}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify({ action, remarks }),
    });
    return res.success;
  },
};

function mapBackendOrderToFrontend(dto: any): Order {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    customerId: dto.customerId || 'CUST-001',
    customerName: dto.customerName || 'Atelier Client',
    customerEmail: dto.customerEmail || 'client@maisonvera.com',
    customerPhone: dto.customerPhone || '+977 1 4239800',
    date: dto.createdAt ? new Date(dto.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    items: (dto.items || []).map((i: any) => ({
      productId: i.productId,
      slug: i.productSlug || '',
      name: i.productName,
      image: i.productImageUrl || '',
      size: i.size,
      color: i.colorName,
      unitPrice: Number(i.unitPrice),
      originalPrice: Number(i.unitPrice),
      quantity: Number(i.quantity),
    })),
    subtotal: Number(dto.subtotal),
    discount: Number(dto.discountAmount || 0),
    deliveryCharge: Number(dto.shippingAmount || 0),
    total: Number(dto.totalAmount),
    currency: 'NPR',
    paymentMethod: dto.paymentMethod || 'COD',
    paymentStatus: dto.paymentStatus as PaymentStatusType,
    orderStatus: dto.orderStatus as OrderStatusType,
    deliveryZone: dto.deliveryZone || 'Bagmati Province',
    shippingAddress: {
      fullName: dto.shippingAddress?.fullName || dto.customerName || '',
      phoneNumber: dto.shippingAddress?.phoneNumber || dto.customerPhone || '',
      province: dto.shippingAddress?.province || 'Bagmati Province',
      district: dto.shippingAddress?.district || 'Kathmandu',
      municipality: dto.shippingAddress?.municipality || 'Kathmandu Metropolitan',
      ward: dto.shippingAddress?.ward || '01',
      street: dto.shippingAddress?.street || 'Durbar Marg',
      landmark: dto.shippingAddress?.landmark || '',
      specialInstructions: dto.shippingAddress?.specialInstructions || '',
    },
    trackingNumber: dto.trackingNumber || `TRK-${dto.orderNumber}`,
    notes: dto.notes || '',
  };
}
