import { type ChangeEvent, type FormEvent, type MouseEvent, useState } from 'react';

import { useAuthStore } from '../../features/auth/store/useAuthStore';
import type { LoginFormValues } from '../../features/auth/types';
import styles from './LoginPage.module.css';

type LoginFormErrors = Partial<Record<'email' | 'password', string>>;

const initialValues: LoginFormValues = {
    email: '',
    password: '',
    remember: false,
};

function validateForm(values: LoginFormValues): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (values.email.trim().length === 0) {
        errors.email = 'Укажите почту';
    }

    if (values.password.trim().length === 0) {
        errors.password = 'Укажите пароль';
    }

    return errors;
}

export function LoginPage() {
    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);
    const apiError = useAuthStore((state) => state.error);
    const clearError = useAuthStore((state) => state.clearError);

    const [values, setValues] = useState<LoginFormValues>(initialValues);
    const [errors, setErrors] = useState<LoginFormErrors>({});

    function updateField<K extends keyof LoginFormValues>(
        field: K,
        value: LoginFormValues[K],
    ): void {
        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));

        if (apiError) {
            clearError();
        }
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('email', event.target.value);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('password', event.target.value);
    }

    function handleRememberChange(event: ChangeEvent<HTMLInputElement>): void {
        updateField('remember', event.target.checked);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const nextErrors = validateForm(values);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        await login({
            email: values.email.trim(),
            password: values.password,
            remember: values.remember,
        });
    }

    function handleCreateClick(event: MouseEvent<HTMLAnchorElement>): void {
        event.preventDefault();
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Вход</h1>

                <form onSubmit={handleSubmit} noValidate className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Почта
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={values.email}
                            onChange={handleEmailChange}
                            placeholder="Введите почту"
                            className={styles.input}
                        />
                        {errors.email ? (
                            <div className={styles.fieldError}>{errors.email}</div>
                        ) : null}
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handlePasswordChange}
                            placeholder="Введите пароль"
                            className={styles.input}
                        />
                        {errors.password ? (
                            <div className={styles.fieldError}>{errors.password}</div>
                        ) : null}
                    </div>

                    <label className={styles.checkboxRow}>
                        <input
                            type="checkbox"
                            checked={values.remember}
                            onChange={handleRememberChange}
                            className={styles.checkbox}
                        />
                        <span>Запомнить данные</span>
                    </label>

                    {apiError ? <div className={styles.formError}>{apiError}</div> : null}

                    <button type="submit" disabled={isLoading} className={styles.submitButton}>
                        {isLoading ? 'Загрузка...' : 'Войти'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Нет аккаунта?{' '}
                    <a href="#" onClick={handleCreateClick} className={styles.link}>
                        Создать
                    </a>
                </p>
            </div>
        </div>
    );
}
