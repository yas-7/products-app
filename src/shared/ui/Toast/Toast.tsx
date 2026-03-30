import styles from './Toast.module.css';

type ToastVariant = 'success' | 'error' | 'info';

type ToastProps = {
    message: string;
    variant?: ToastVariant;
    onClose: () => void;
};

export function Toast(props: ToastProps) {
    const { message, variant = 'success', onClose } = props;

    if (message.length === 0) {
        return null;
    }

    const rootClassName = `${styles.root} ${styles[variant]}`;

    return (
        <div className={rootClassName} role="status">
            <div className={styles.content}>{message}</div>

            <button
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="Закрыть уведомление"
            >
                ×
            </button>
        </div>
    );
}
