export type Product = {
    id: number;
    title: string;
    brand?: string;
    sku?: string;
    rating?: number;
    price: number;
    stock?: number;
    isLocal?: boolean;
};

export type ProductsResponse = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};

export type ProductSortField = 'title' | 'brand' | 'sku' | 'rating' | 'price' | 'stock';

export type SortDirection = 'asc' | 'desc';

export type ProductSort = {
    field: ProductSortField;
    direction: SortDirection;
};

export type CreateProductInput = {
    title: string;
    price: number;
    brand: string;
    sku: string;
};
