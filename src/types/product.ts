// 产品状态枚举
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued'
}

// 产品类别枚举
export enum ProductCategory {
  SOFTWARE = 'software',
  HARDWARE = 'hardware',
  SERVICE = 'service',
  DIGITAL = 'digital'
}

// 产品接口
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 创建产品的输入接口
export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  imageUrl?: string;
  tags: string[];
}

// 更新产品的输入接口
export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  status?: ProductStatus;
  stock?: number;
  imageUrl?: string;
  tags?: string[];
}

// 产品过滤器接口
export interface ProductFilter {
  category?: ProductCategory;
  status?: ProductStatus;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
}

// 产品排序选项
export enum ProductSortOption {
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  CREATED_ASC = 'created_asc',
  CREATED_DESC = 'created_desc',
  STOCK_ASC = 'stock_asc',
  STOCK_DESC = 'stock_desc'
}