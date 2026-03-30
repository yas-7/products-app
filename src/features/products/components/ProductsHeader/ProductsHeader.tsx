import type { ChangeEvent } from 'react';

import styles from './ProductsHeader.module.css';

type ProductsHeaderProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onLogout: () => void;
};

export function ProductsHeader(props: ProductsHeaderProps) {
    const { searchValue, onSearchChange, onLogout } = props;

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
        onSearchChange(event.target.value);
    }

    return (
        <div className={styles.topbar}>
            <div className={styles.title}>Товары</div>

            <div className={styles.search}>
                <input
                    type="search"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Найти"
                    aria-label="Поиск товаров"
                />
            </div>

            <div className={styles.actions}>
                <button type="button" className={styles.secondaryButton} onClick={onLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
}
