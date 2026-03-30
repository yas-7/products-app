import { useEffect, useState } from 'react';

type UseToastOptions = {
    duration?: number;
};

type ToastVariant = 'success' | 'error' | 'info';

type ToastState = {
    message: string;
    variant: ToastVariant;
};

type ShowToastParams = {
    message: string;
    variant?: ToastVariant;
};

type UseToastResult = {
    toast: ToastState;
    showToast: (params: ShowToastParams) => void;
    hideToast: () => void;
};

const DEFAULT_TOAST_STATE: ToastState = {
    message: '',
    variant: 'success',
};

const DEFAULT_DURATION_MS = 2500;

export function useToast(options?: UseToastOptions): UseToastResult {
    const duration = options?.duration ?? DEFAULT_DURATION_MS;
    const [toast, setToast] = useState(DEFAULT_TOAST_STATE);

    useEffect(() => {
        if (toast.message.length === 0) {
            return;
        }

        const timerId = setTimeout(() => {
            setToast(DEFAULT_TOAST_STATE);
        }, duration);

        return () => {
            clearTimeout(timerId);
        };
    }, [toast.message, duration]);

    function showToast(params: ShowToastParams) {
        setToast({
            message: params.message,
            variant: params.variant ?? 'success',
        });
    }

    function hideToast() {
        setToast(DEFAULT_TOAST_STATE);
    }

    return { toast, showToast, hideToast };
}
