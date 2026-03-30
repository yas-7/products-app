import { getTotalPages, getVisiblePages } from '../../lib/pagination';
import styles from './ProductsPagination.module.css';

type ProductsPaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    isLoading: boolean;
    onPageChange: (page: number) => void;
};

export function ProductsPagination(props: ProductsPaginationProps) {
    const { page, pageSize, total, isLoading, onPageChange } = props;

    const totalPages = getTotalPages(total, pageSize);
    const visiblePages = getVisiblePages(page, totalPages, 5);

    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return (
        <footer className={styles.footer}>
            <span className={styles.info}>
                Показано {from}-{to} из {total}
            </span>

            <div className={styles.pagination}>
                <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => {
                        onPageChange(page - 1);
                    }}
                    disabled={page <= 1 || isLoading}
                    aria-label="Предыдущая страница"
                >
                    ‹
                </button>

                {visiblePages.map((pageNumber) => {
                    const isActive = pageNumber === page;

                    return (
                        <button
                            key={pageNumber}
                            type="button"
                            className={`${styles.page} ${isActive ? styles.pageActive : ''}`}
                            onClick={() => {
                                onPageChange(pageNumber);
                            }}
                            disabled={isLoading}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => {
                        onPageChange(page + 1);
                    }}
                    disabled={page >= totalPages || isLoading}
                    aria-label="Следующая страница"
                >
                    ›
                </button>
            </div>
        </footer>
    );
}
