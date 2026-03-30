import { create } from 'zustand';

import { getProducts } from '../api/productsApi';
import type { CreateProductInput, Product, ProductSort, ProductSortField } from '../types';

type ProductsState = {
    products: Product[];
    localProducts: Product[];
    total: number;
    page: number;
    pageSize: number;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
    sort: ProductSort;
    fetchProducts: () => Promise<void>;
    refreshProducts: () => Promise<void>;
    setSort: (field: ProductSortField) => Promise<void>;
    setPage: (page: number) => Promise<void>;
    applySearchQuery: (query: string) => Promise<void>;
    addLocalProduct: (input: CreateProductInput) => void;
};

const initialSort: ProductSort = {
    field: 'title',
    direction: 'asc',
};

function getTotalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
}

function createLocalProduct(input: CreateProductInput): Product {
    return {
        id: -(Date.now() + Math.floor(Math.random() * 1000)),
        title: input.title.trim(),
        price: input.price,
        brand: input.brand.trim(),
        sku: input.sku.trim(),
        isLocal: true,
    };
}

export const useProductsStore = create<ProductsState>((set, get) => ({
    products: [],
    localProducts: [],
    total: 0,
    page: 1,
    pageSize: 20,
    searchQuery: '',
    isLoading: false,
    error: null,
    sort: initialSort,

    fetchProducts: async () => {
        if (get().isLoading) {
            return;
        }

        const { page, pageSize, sort, searchQuery } = get();

        set({
            isLoading: true,
            error: null,
        });

        try {
            const response = await getProducts({ page, pageSize, sort, searchQuery });
            set({
                products: response.products,
                total: response.total,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Не удалось загрузить товары';
            set({
                isLoading: false,
                error: message,
            });
        }
    },
    refreshProducts: async () => {
        await get().fetchProducts();
    },
    setSort: async (name) => {
        const { field, direction } = get().sort;
        const nextSort: ProductSort =
            field === name
                ? { field, direction: direction === 'asc' ? 'desc' : 'asc' }
                : { field: name, direction: 'asc' };

        set({ sort: nextSort, page: 1 });

        await get().fetchProducts();
    },
    setPage: async (page) => {
        const { total, pageSize, page: currentPage } = get();
        const totalPages = getTotalPages(total, pageSize);
        const nextPage = Math.min(Math.max(page, 1), totalPages);

        if (nextPage === currentPage) {
            return;
        }

        set({ page: nextPage });

        await get().fetchProducts();
    },
    applySearchQuery: async (query) => {
        const normalizedQuery = query.trim();
        const currentQuery = get().searchQuery;

        if (normalizedQuery === currentQuery) {
            return;
        }

        set({ searchQuery: normalizedQuery, page: 1 });

        await get().fetchProducts();
    },
    addLocalProduct: (input) => {
        const localProduct = createLocalProduct(input);
        set((state) => ({ localProducts: [localProduct, ...state.localProducts] }));
    },
}));
