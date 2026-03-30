const API_BASE_URL = 'https://dummyjson.com';
type ApiErrorResponse = {
    message?: string;
};

export class ApiError extends Error {
    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
    });

    if (!response.ok) {
        let message = 'Произошла ошибка при обращении к API';

        try {
            const errorData = (await response.json()) as ApiErrorResponse;
            if (typeof errorData.message === 'string' && errorData.message.trim().length > 0) {
                message = errorData.message;
            }
        } catch {
            /* empty */
        }

        throw new ApiError(message, response.status);
    }

    return (await response.json()) as T;
}
