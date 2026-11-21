import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Product, Category, CollectionItem, Order, OrderStatusType, PaymentStatusType } from '../types';

export const supabaseDbService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (!supabase || !isSupabaseConfigured) return [];

    try {
      const { data: rows, error } = await supabase
        .from('products')
        .select(`
          *,
          categories("Id", "Name", "Slug"),
          product_variants(*),
          "ProductSizes"(*),
          "ProductColors"(*),
          "ProductImages"(*)
        `)
        .eq('IsDeleted', false)
        .order('CreatedAt', { ascending: false });

      if (error) {
        console.warn('[Supabase] Failed to fetch products:', error.message);
        return [];
      }

      if (!rows || rows.length === 0) return [];

      return rows.map(mapRowToProduct);
    } catch (err: any) {
      console.warn('[Supabase] getProducts exception:', err.message);
      return [];
    }
  },

  async saveProduct(product: Product): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      const now = new Date().toISOString();
      const productId = product.id.startsWith('PRD-')
        ? crypto.randomUUID()
        : product.id;

      // Upsert product row
      const { error: prodError } = await supabase.from('products').upsert({
        Id: productId,
        Slug: product.slug,
        Sku: product.sku,
        Name: product.name,
        Description: product.description,
        MaterialsAndCare: product.materialsAndCare || [],
        ShippingInfo: product.shippingInfo || '',
        CategoryId: 'c1111111-1111-1111-1111-111111111111', // default or matched
        GenderCollection: product.collection || 'Unisex',
        CollectionTag: product.collectionTag || '',
        OriginalPrice: product.originalPrice,
        SellingPrice: product.sellingPrice,
        DiscountPercent: product.discountPercent || 0,
        MainImageUrl: product.mainImage,
        Featured: Boolean(product.featured),
        NewArrival: Boolean(product.newArrival),
        BestSeller: Boolean(product.bestSeller),
        OnSale: Boolean(product.onSale),
        Status: product.status || 'Published',
        TotalStock: product.stock || 0,
        ConcurrencyToken: crypto.randomUUID(),
        CreatedAt: now,
        UpdatedAt: now,
        IsDeleted: false,
      });

      if (prodError) {
        console.error('[Supabase] Failed to save product:', prodError);
        return false;
      }

      return true;
    } catch (err: any) {
      console.error('[Supabase] saveProduct exception:', err.message);
      return false;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      const { error } = await supabase
        .from('products')
        .update({ IsDeleted: true, UpdatedAt: new Date().toISOString() })
        .eq('Id', productId);

      return !error;
    } catch {
      return false;
    }
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (!supabase || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('IsDeleted', false)
        .order('SortOrder', { ascending: true });

      if (error || !data) return [];

      return data.map((c: any) => ({
        id: c.Id,
        name: c.Name,
        slug: c.Slug,
        description: c.Description || '',
        image: c.ImageUrl,
        productCount: 0,
        status: c.Status === 'Active' ? 'Active' : 'Archived',
      }));
    } catch {
      return [];
    }
  },

  // COLLECTIONS
  async getCollections(): Promise<CollectionItem[]> {
    if (!supabase || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*, collection_products("ProductId")')
        .eq('IsDeleted', false)
        .order('SortOrder', { ascending: true });

      if (error || !data) return [];

      return data.map((col: any) => ({
        id: col.Id,
        name: col.Name,
        slug: col.Slug,
        subtitle: col.Subtitle || '',
        description: col.Description || '',
        bannerImage: col.BannerImageUrl,
        featured: col.Featured,
        productIds: (col.collection_products || []).map((cp: any) => cp.ProductId),
        status: col.Status === 'Active' ? 'Active' : 'Archived',
      }));
    } catch {
      return [];
    }
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (!supabase || !isSupabaseConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, "OrderItems"(*)')
        .eq('IsDeleted', false)
        .order('CreatedAt', { ascending: false });

      if (error || !data) return [];

      return data.map(mapRowToOrder);
    } catch {
      return [];
    }
  },

  async createOrder(order: Order): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      const now = new Date().toISOString();
      const orderId = order.id.startsWith('ORD-') ? crypto.randomUUID() : order.id;

      const { error: orderErr } = await supabase.from('orders').insert({
        Id: orderId,
        OrderNumber: order.orderNumber,
        CustomerName: order.customerName || 'Atelier Client',
        CustomerEmail: order.customerEmail || 'client@maisonvera.com',
        CustomerPhone: order.customerPhone || '+977 9801122334',
        OrderDate: now,
        Subtotal: order.subtotal,
        Discount: order.discount || 0,
        DeliveryMethod: 'Standard White-Glove',
        DeliveryCharge: order.deliveryCharge || 0,
        TotalAmount: order.total,
        PaymentMethod: order.paymentMethod || 'COD',
        PaymentStatus: order.paymentStatus || 'PendingVerification',
        OrderStatus: order.orderStatus || 'Placed',
        CancellationRequested: false,
        ShippingProvince: order.shippingAddress?.province || 'Bagmati Province',
        ShippingDistrict: order.shippingAddress?.district || 'Kathmandu',
        ShippingMunicipality: order.shippingAddress?.municipality || 'Kathmandu Metropolitan',
        ShippingWard: order.shippingAddress?.ward || '01',
        ShippingStreet: order.shippingAddress?.street || 'Durbar Marg',
        ShippingLandmark: order.shippingAddress?.landmark || '',
        ShippingInstructions: order.shippingAddress?.specialInstructions || '',
        ConcurrencyToken: crypto.randomUUID(),
        CreatedAt: now,
        UpdatedAt: now,
        IsDeleted: false,
      });

      if (orderErr) {
        console.error('[Supabase] Failed to insert order:', orderErr);
        return false;
      }

      // Insert OrderItems
      if (order.items && order.items.length > 0) {
        const itemRows = order.items.map((i) => ({
          Id: crypto.randomUUID(),
          OrderId: orderId,
          ProductId: i.productId.startsWith('PRD-') ? 'e1111111-1111-1111-1111-111111111111' : i.productId,
          VariantId: crypto.randomUUID(),
          ProductName: i.name,
          ProductSlug: i.slug || 'garment',
          ProductSku: `SKU-${i.productId}`,
          ImageUrl: i.image,
          Size: i.size,
          Color: i.color,
          UnitPrice: i.unitPrice,
          OriginalPrice: i.originalPrice || i.unitPrice,
          Quantity: i.quantity,
          LineTotal: i.unitPrice * i.quantity,
          CreatedAt: now,
        }));

        await supabase.from('OrderItems').insert(itemRows);
      }

      return true;
    } catch (err: any) {
      console.error('[Supabase] createOrder exception:', err.message);
      return false;
    }
  },

  async updateOrderStatus(orderId: string, status: OrderStatusType): Promise<boolean> {
    if (!supabase || !isSupabaseConfigured) return false;

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          OrderStatus: status,
          UpdatedAt: new Date().toISOString(),
        })
        .or(`Id.eq.${orderId},OrderNumber.eq.${orderId}`);

      return !error;
    } catch {
      return false;
    }
  },
};

function mapRowToProduct(row: any): Product {
  const images = row['ProductImages'] && row['ProductImages'].length > 0
    ? row['ProductImages'].map((img: any) => img.ImageUrl)
    : [row.MainImageUrl];

  const sizes = row['ProductSizes'] && row['ProductSizes'].length > 0
    ? row['ProductSizes'].map((s: any) => s.SizeName)
    : ['XS', 'S', 'M', 'L', 'XL'];

  const colors = row['ProductColors'] && row['ProductColors'].length > 0
    ? row['ProductColors'].map((c: any) => ({ name: c.ColorName, hex: c.HexCode }))
    : [{ name: 'Obsidian Black', hex: '#080808' }];

  const variantStock = row['product_variants'] && row['product_variants'].length > 0
    ? row['product_variants'].map((v: any) => ({
        size: v.Size,
        color: v.ColorName,
        stock: v.StockQuantity,
        sku: v.Sku,
      }))
    : [];

  return {
    id: row.Id,
    slug: row.Slug,
    name: row.Name,
    sku: row.Sku,
    description: row.Description || '',
    materialsAndCare: Array.isArray(row.MaterialsAndCare) ? row.MaterialsAndCare : [],
    shippingInfo: row.ShippingInfo || '',
    category: row.categories?.Name || 'Outerwear',
    categorySlug: row.categories?.Slug || 'outerwear',
    collection: row.GenderCollection || 'Unisex',
    collectionTag: row.CollectionTag || '',
    originalPrice: Number(row.OriginalPrice),
    sellingPrice: Number(row.SellingPrice),
    discountPercent: Number(row.DiscountPercent),
    images,
    mainImage: row.MainImageUrl,
    sizes,
    colors,
    stock: row.TotalStock || 0,
    variantStock,
    featured: Boolean(row.Featured),
    newArrival: Boolean(row.NewArrival),
    bestSeller: Boolean(row.BestSeller),
    onSale: Boolean(row.OnSale),
    status: row.Status || 'Published',
    createdAt: row.CreatedAt ? row.CreatedAt.split('T')[0] : '2026-11-21',
  };
}

function mapRowToOrder(row: any): Order {
  const items = (row['OrderItems'] || []).map((i: any) => ({
    productId: i.ProductId,
    slug: i.ProductSlug || '',
    name: i.ProductName,
    image: i.ImageUrl,
    size: i.Size,
    color: i.Color,
    unitPrice: Number(i.UnitPrice),
    originalPrice: Number(i.OriginalPrice || i.UnitPrice),
    quantity: Number(i.Quantity),
  }));

  return {
    id: row.Id,
    orderNumber: row.OrderNumber,
    customerId: row.UserId || 'CUST-001',
    customerName: row.CustomerName || 'Atelier Client',
    customerEmail: row.CustomerEmail || 'client@maisonvera.com',
    customerPhone: row.CustomerPhone || '+977 1 4239800',
    date: row.CreatedAt ? row.CreatedAt.split('T')[0] : '2026-11-21',
    items,
    subtotal: Number(row.Subtotal),
    discount: Number(row.Discount || 0),
    deliveryCharge: Number(row.DeliveryCharge || 0),
    total: Number(row.TotalAmount),
    currency: 'NPR',
    paymentMethod: row.PaymentMethod || 'COD',
    paymentStatus: row.PaymentStatus as PaymentStatusType,
    orderStatus: row.OrderStatus as OrderStatusType,
    deliveryZone: row.ShippingProvince || 'Bagmati Province',
    shippingAddress: {
      fullName: row.CustomerName || '',
      phoneNumber: row.CustomerPhone || '',
      province: row.ShippingProvince || 'Bagmati Province',
      district: row.ShippingDistrict || 'Kathmandu',
      municipality: row.ShippingMunicipality || 'Kathmandu Metropolitan',
      ward: row.ShippingWard || '01',
      street: row.ShippingStreet || 'Durbar Marg',
      landmark: row.ShippingLandmark || '',
      specialInstructions: row.ShippingInstructions || '',
    },
    trackingNumber: `TRK-${row.OrderNumber}`,
    notes: row.AdminNotes || '',
  };
}
