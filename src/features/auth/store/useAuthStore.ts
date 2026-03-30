import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

import { loginByEmail } from '../api/authApi';
import type { AuthUser, LoginFormValues } from '../types';

type PersistedAuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    remember: boolean;
};

type AuthState = PersistedAuthState & {
    isLoading: boolean;
    error: string | null;
    login: (values: LoginFormValues) => Promise<void>;
    logout: () => void;
    clearError: () => void;
};

type PersistedStoragePayload = {
    state?: PersistedAuthState;
    version?: number;
};

const initialPersistedState: PersistedAuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    remember: false,
};

function isEmptyAuthState(state: PersistedAuthState | undefined): boolean {
    if (!state) {
        return true;
    }

    return state.user == null && state.accessToken == null && state.refreshToken == null;
}

const authStorage: StateStorage = {
    getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
    setItem: (name, value) => {
        let parsedValue: PersistedStoragePayload | null = null;

        try {
            parsedValue = JSON.parse(value) as PersistedStoragePayload;
        } catch {
            parsedValue = null;
        }

        const persistedState = parsedValue?.state;
        const remember = persistedState?.remember ?? false;

        if (isEmptyAuthState(persistedState)) {
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
            return;
        }

        if (remember) {
            localStorage.setItem(name, value);
            sessionStorage.removeItem(name);
            return;
        }

        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
    },

    removeItem: (name) => {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            ...initialPersistedState,
            isLoading: false,
            error: null,

            login: async (values) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await loginByEmail({
                        email: values.email.trim(),
                        password: values.password,
                    });

                    const { accessToken, refreshToken, ...user } = response;

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        remember: values.remember,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const message =
                        error instanceof Error ? error.message : 'Не удалось выполнить вход';
                    set({
                        ...initialPersistedState,
                        isLoading: false,
                        error: message,
                    });
                }
            },
            logout: () =>
                set({
                    ...initialPersistedState,
                    isLoading: false,
                    error: null,
                }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => authStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                remember: state.remember,
            }),
        },
    ),
);
