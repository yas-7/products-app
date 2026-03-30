import { useEffect, useMemo, useState } from 'react';

import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { AddProductModal } from '../../features/products/components/AddProductModal';
import { ProductsHeader } from '../../features/products/components/ProductsHeader';
import { ProductsPagination } from '../../features/products/components/ProductsPagination';
import { ProductsSectionHeader } from '../../features/products/components/ProductsSectionHeader';
import { ProductsTable } from '../../features/products/components/ProductsTable';
import { filterLocalProducts } from '../../features/products/lib/localProducts';
import { useProductsStore } from '../../features/products/store/useProductsStore';
import type { CreateProductInput, ProductSortField } from '../../features/products/types';
import { debounce } from '../../shared/lib/debounce';
import { useToast } from '../../shared/lib/hooks/useToast';
import { Toast } from '../../shared/ui/Toast';
import styles from './ProductsPage.module.css';

const SEARCH_DEBOUNCE_MS = 400;

export function ProductsPage() {
    const logout = useAuthStore((state) => state.logout);

    const products = useProductsStore((state) => state.products);
    const localProducts = useProductsStore((state) => state.localProducts);
    const total = useProductsStore((state) => state.total);
    const page = useProductsStore((state) => state.page);
    const pageSize = useProductsStore((state) => state.pageSize);
    const searchQuery = useProductsStore((state) => state.searchQuery);
    const isLoading = useProductsStore((state) => state.isLoading);
    const error = useProductsStore((state) => state.error);
    const sort = useProductsStore((state) => state.sort);
    const fetchProducts = useProductsStore((state) => state.fetchProducts);
    const refreshProducts = useProductsStore((state) => state.refreshProducts);
    const setSort = useProductsStore((state) => state.setSort);
    const setPage = useProductsStore((state) => state.setPage);
    const applySearchQuery = useProductsStore((state) => state.applySearchQuery);
    const addLocalProduct = useProductsStore((state) => state.addLocalProduct);

    const [searchInput, setSearchInput] = useState<string>(searchQuery);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const { toast, showToast, hideToast } = useToast();

    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        }
    }, [fetchProducts, products.length]);

    const debouncedApplySearch = useMemo(() => {
        return debounce((value: string) => {
            applySearchQuery(value);
        }, SEARCH_DEBOUNCE_MS);
    }, [applySearchQuery]);

    useEffect(() => {
        return () => {
            debouncedApplySearch.cancel();
        };
    }, [debouncedApplySearch]);

    const visibleLocalProducts = useMemo(() => {
        return filterLocalProducts(localProducts, searchQuery);
    }, [localProducts, searchQuery]);

    function handleSort(field: ProductSortField): void {
        void setSort(field);
    }

    function handlePageChange(nextPage: number): void {
        void setPage(nextPage);
    }

    function handleRefresh(): void {
        void refreshProducts();
    }

    function handleSearchChange(value: string): void {
        setSearchInput(value);
        debouncedApplySearch(value);
    }

    function handleOpenAddModal(): void {
        setIsAddModalOpen(true);
    }

    function handleCloseAddModal(): void {
        setIsAddModalOpen(false);
    }

    function handleAddProduct(input: CreateProductInput): void {
        addLocalProduct(input);
        setIsAddModalOpen(false);
        showToast({
            message: `Товар "${input.title}" добавлен`,
            variant: 'success',
        });

        debouncedApplySearch.cancel();
        setSearchInput('');
        void applySearchQuery('');
    }

    return (
        <div className={styles.page}>
            <ProductsHeader
                searchValue={searchInput}
                onSearchChange={handleSearchChange}
                onLogout={logout}
            />

            <div className={styles.card}>
                <ProductsSectionHeader
                    title="Все позиции"
                    isLoading={isLoading}
                    onRefresh={handleRefresh}
                    onAdd={handleOpenAddModal}
                />

                {isLoading ? (
                    <div className={styles.progressContainer} aria-label="Загрузка товаров">
                        <div className={styles.progressBar} />
                    </div>
                ) : null}

                {error ? <div className={styles.error}>{error}</div> : null}

                {visibleLocalProducts.length > 0 ? (
                    <div className={styles.localSection}>
                        <div className={styles.localSectionTitle}>Добавленные локально</div>

                        <ProductsTable
                            products={visibleLocalProducts}
                            emptyText="Локальные товары не найдены"
                        />
                    </div>
                ) : null}

                <ProductsTable
                    products={products}
                    sort={sort}
                    onSort={handleSort}
                    emptyText="Товары не найдены"
                />

                <ProductsPagination
                    page={page}
                    pageSize={pageSize}
                    total={total}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                />
            </div>

            {isAddModalOpen ? (
                <AddProductModal onClose={handleCloseAddModal} onSubmit={handleAddProduct} />
            ) : null}

            <Toast message={toast.message} variant={toast.variant} onClose={hideToast} />
        </div>
    );
}
