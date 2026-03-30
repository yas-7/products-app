import styles from './ProductsSectionHeader.module.css';

type ProductsSectionHeaderProps = {
    title: string;
    isLoading: boolean;
    onRefresh: () => void;
    onAdd: () => void;
};

export function ProductsSectionHeader(props: ProductsSectionHeaderProps) {
    const { title, isLoading, onRefresh, onAdd } = props;

    return (
        <div className={styles.root}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.iconButton}
                    onClick={onRefresh}
                    disabled={isLoading}
                    aria-label="Обновить таблицу"
                    title="Обновить таблицу"
                >
                    ↻
                </button>

                <button type="button" className={styles.primaryButton} onClick={onAdd}>
                    + Добавить
                </button>
            </div>
        </div>
    );
}
