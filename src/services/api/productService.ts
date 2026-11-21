import { apiRequest } from './apiClient';
import { Product, Category, CollectionItem } from '../../types';

export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const productService = {
  async getProducts(params?: {
    category?: string;
    collection?: string;
    gender?: string;
    search?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.collection) query.append('collection', params.collection);
    if (params?.gender) query.append('gender', params.gender);
    if (params?.search) query.append('search', params.search);
    if (params?.pageNumber) query.append('pageNumber', params.pageNumber.toString());
    if (params?.pageSize) query.append('pageSize', (params.pageSize || 50).toString());

    const endpoint = `/products?${query.toString()}`;
    const res = await apiRequest<PaginatedResult<any>>(endpoint);
    if (res.success && res.data?.items) {
      // Map backend ProductDto to frontend Product type
      return res.data.items.map(mapBackendProductToFrontend);
    }
    return [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const res = await apiRequest<any>(`/products/${slug}`);
    if (res.success && res.data) {
      return mapBackendProductToFrontend(res.data);
    }
    return null;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await apiRequest<any>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return mapBackendProductToFrontend(res.data);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await apiRequest<any>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
    return mapBackendProductToFrontend(res.data);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await apiRequest<boolean>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await apiRequest<any[]>('/categories');
    if (res.success && Array.isArray(res.data)) {
      return res.data.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.imageUrl,
        productCount: c.productCount || 0,
        status: c.status === 0 ? 'Active' : 'Archived',
      }));
    }
    return [];
  },

  async getCollections(): Promise<CollectionItem[]> {
    const res = await apiRequest<any[]>('/collections');
    if (res.success && Array.isArray(res.data)) {
      return res.data.map((col) => ({
        id: col.id,
        name: col.name,
        slug: col.slug,
        subtitle: col.subtitle || '',
        description: col.description || '',
        bannerImage: col.bannerImageUrl || '',
        featured: col.featured ?? false,
        productIds: col.productIds || [],
        status: col.status === 0 ? 'Active' : 'Archived',
      }));
    }
    return [];
  },
};

function mapBackendProductToFrontend(dto: any): Product {
  return {
    id: dto.id || dto.sku,
    slug: dto.slug,
    name: dto.name,
    sku: dto.sku,
    description: dto.description || '',
    materialsAndCare: Array.isArray(dto.materialsAndCare) ? dto.materialsAndCare : [],
    shippingInfo: dto.shippingInfo || '',
    category: dto.categoryName || 'General',
    categorySlug: dto.categorySlug || 'general',
    collection: dto.genderCollection === 1 ? 'Women' : dto.genderCollection === 0 ? 'Men' : 'Unisex',
    collectionTag: dto.collectionTag || '',
    originalPrice: Number(dto.originalPrice || dto.sellingPrice || 0),
    sellingPrice: Number(dto.sellingPrice || 0),
    discountPercent: Number(dto.discountPercent || 0),
    images: dto.images && dto.images.length > 0 ? dto.images.map((img: any) => img.imageUrl || img) : [dto.mainImageUrl],
    mainImage: dto.mainImageUrl,
    sizes: dto.sizes ? dto.sizes.map((s: any) => s.sizeName || s) : ['S', 'M', 'L'],
    colors: dto.colors ? dto.colors.map((c: any) => ({ name: c.colorName || c.name, hex: c.hexCode || c.hex })) : [{ name: 'Obsidian Black', hex: '#080808' }],
    stock: Number(dto.totalStock || 0),
    variantStock: dto.variants ? dto.variants.map((v: any) => ({
      size: v.size,
      color: v.colorName,
      stock: v.stockQuantity,
      sku: v.sku,
    })) : [],
    featured: Boolean(dto.featured),
    newArrival: Boolean(dto.newArrival),
    bestSeller: Boolean(dto.bestSeller),
    onSale: Boolean(dto.onSale),
    status: dto.status === 0 ? 'Published' : dto.status === 1 ? 'Draft' : 'Archived',
    createdAt: dto.createdAt ? new Date(dto.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}
