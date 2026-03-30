import { fetchApi } from '../../../shared/api/http';
import type { ProductSort, ProductsResponse } from '../types';

type GetProductsParams = {
    page: number;
    pageSize: number;
    sort: ProductSort;
    searchQuery: string;
};

const PRODUCT_FIELDS = ['id', 'title', 'brand', 'sku', 'rating', 'price', 'stock'];

function buildProductsPath(params: GetProductsParams): string {
    const skip = (params.page - 1) * params.pageSize;
    const normalizedQuery = params.searchQuery.trim();

    const searchParams = new URLSearchParams({
        limit: String(params.pageSize),
        skip: String(skip),
        sortBy: params.sort.field,
        order: params.sort.direction,
        select: PRODUCT_FIELDS.join(','),
    });

    if (normalizedQuery.length > 0) {
        searchParams.set('q', normalizedQuery);
        return `/products/search?${searchParams.toString()}`;
    }

    return `/products?${searchParams.toString()}`;
}

export async function getProducts(params: GetProductsParams): Promise<ProductsResponse> {
    return fetchApi<ProductsResponse>(buildProductsPath(params));
}
