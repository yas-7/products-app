import { formatPrice, formatRating, formatStock } from '../../lib/formatters';
import type { Product, ProductSort, ProductSortField } from '../../types';
import styles from './ProductsTable.module.css';

type ProductsTableProps = {
    products: Product[];
    emptyText: string;
    sort?: ProductSort;
    onSort?: (field: ProductSortField) => void;
};

type ColumnConfig = {
    field: ProductSortField;
    label: string;
};

const columns: ColumnConfig[] = [
    { field: 'title', label: 'Наименование' },
    { field: 'brand', label: 'Вендор' },
    { field: 'sku', label: 'Артикул' },
    { field: 'rating', label: 'Оценка' },
    { field: 'price', label: 'Цена' },
    { field: 'stock', label: 'Количество' },
];

function getSortIndicator(
    activeField: ProductSortField,
    currentField: ProductSortField,
    direction: 'asc' | 'desc',
): string {
    if (activeField !== currentField) {
        return '';
    }

    return direction === 'asc' ? ' ↑' : ' ↓';
}

export function ProductsTable(props: ProductsTableProps) {
    const { products, emptyText, sort, onSort } = props;

    const isSortable = sort !== undefined && onSort !== undefined;

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <colgroup>
                    <col className={styles.colTitle} />
                    <col className={styles.colBrand} />
                    <col className={styles.colSku} />
                    <col className={styles.colRating} />
                    <col className={styles.colPrice} />
                    <col className={styles.colStock} />
                    <col className={styles.colActions} />
                </colgroup>
                <thead>
                    <tr>
                        {columns.map((column) => {
                            return (
                                <th key={column.field}>
                                    {isSortable ? (
                                        <button
                                            type="button"
                                            className={styles.sortButton}
                                            onClick={() => {
                                                onSort(column.field);
                                            }}
                                        >
                                            {column.label}
                                            {getSortIndicator(
                                                column.field,
                                                sort.field,
                                                sort.direction,
                                            )}
                                        </button>
                                    ) : (
                                        <span className={styles.headerText}>{column.label}</span>
                                    )}
                                </th>
                            );
                        })}
                        <th className={styles.actionsHeader} />
                    </tr>
                </thead>

                <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={styles.empty}>
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const isLowRating =
                                typeof product.rating === 'number' && product.rating < 3.5;

                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div className={styles.titleCell}>
                                            <span className={styles.titleText}>
                                                {product.title}
                                            </span>
                                            {product.isLocal ? (
                                                <span className={styles.badge}>Новый</span>
                                            ) : null}
                                        </div>
                                    </td>
                                    <td>{product.brand ?? '—'}</td>
                                    <td>{product.sku ?? '—'}</td>
                                    <td className={isLowRating ? styles.ratingLow : undefined}>
                                        {formatRating(product.rating)}
                                    </td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{formatStock(product.stock)}</td>

                                    <td className={styles.actionsCell}>
                                        <button
                                            type="button"
                                            className={`${styles.rowIconButton} ${styles.rowIconButtonPrimary}`}
                                            aria-label="Быстрое действие"
                                        >
                                            +
                                        </button>

                                        <button
                                            type="button"
                                            className={styles.rowIconButton}
                                            aria-label="Меню товара"
                                            title="Заглушка"
                                        >
                                            ⋯
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
