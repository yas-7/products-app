import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import type { CreateProductInput } from '../../types';
import styles from './AddProductModal.module.css';

type AddProductModalProps = {
    onClose: () => void;
    onSubmit: (input: CreateProductInput) => void;
};

type FormValues = {
    title: string;
    price: string;
    brand: string;
    sku: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    title: '',
    price: '',
    brand: '',
    sku: '',
};

function validate(values: FormValues): FormErrors {
    const errors: FormErrors = {};

    if (values.title.trim().length === 0) {
        errors.title = 'Укажите наименование';
    }

    if (values.brand.trim().length === 0) {
        errors.brand = 'Укажите вендора';
    }

    if (values.sku.trim().length === 0) {
        errors.sku = 'Укажите артикул';
    }

    if (values.price.trim().length === 0) {
        errors.price = 'Укажите цену';
    } else {
        const price = Number(values.price);

        if (Number.isNaN(price) || price <= 0) {
            errors.price = 'Цена должна быть больше 0';
        }
    }

    return errors;
}

export function AddProductModal(props: AddProductModalProps) {
    const { onClose, onSubmit } = props;

    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});

    function updateField<K extends keyof FormValues>(field: K, value: FormValues[K]): void {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    }

    function handleTitleChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('title', event.target.value);
    }

    function handlePriceChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('price', event.target.value);
    }

    function handleBrandChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('brand', event.target.value);
    }

    function handleSkuChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('sku', event.target.value);
    }

    function handleSubmit(event: SubmitEvent): void {
        event.preventDefault();

        const nextErrors = validate(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        onSubmit({
            title: values.title.trim(),
            price: Number(values.price),
            brand: values.brand.trim(),
            sku: values.sku.trim(),
        });
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>Добавить товар</h3>

                    <button
                        type="button"
                        className={styles.close}
                        onClick={onClose}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.field}>
                        <label htmlFor="product-title">Наименование</label>
                        <input
                            id="product-title"
                            type="text"
                            value={values.title}
                            onChange={handleTitleChange}
                            placeholder="Например, Смартфон"
                        />
                        {errors.title ? <div className={styles.error}>{errors.title}</div> : null}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="product-price">Цена</label>
                        <input
                            id="product-price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={values.price}
                            onChange={handlePriceChange}
                            placeholder="Например, 199.99"
                        />
                        {errors.price ? <div className={styles.error}>{errors.price}</div> : null}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="product-brand">Вендор</label>
                        <input
                            id="product-brand"
                            type="text"
                            value={values.brand}
                            onChange={handleBrandChange}
                            placeholder="Например, Apple"
                        />
                        {errors.brand ? <div className={styles.error}>{errors.brand}</div> : null}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="product-sku">Артикул</label>
                        <input
                            id="product-sku"
                            type="text"
                            value={values.sku}
                            onChange={handleSkuChange}
                            placeholder="Например, IPH-17-PRO"
                        />
                        {errors.sku ? <div className={styles.error}>{errors.sku}</div> : null}
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.secondaryButton} onClick={onClose}>
                            Отмена
                        </button>

                        <button type="submit" className={styles.primaryButton}>
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
