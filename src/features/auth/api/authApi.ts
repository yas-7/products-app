import { fetchApi } from '../../../shared/api/http';
import type { LoginResponse, UserLookupResponse } from '../types';

type LoginByEmailParams = {
    email: string;
    password: string;
};

function buildEmailLookupPath(email: string): string {
    const searchParams = new URLSearchParams({
        key: 'email',
        value: email,
    });

    return `/users/filter?${searchParams.toString()}`;
}

async function resolveUsernameByEmail(email: string): Promise<string> {
    const response = await fetchApi<UserLookupResponse>(buildEmailLookupPath(email));
    const user = response.users[0];
    if (!user) {
        throw new Error('Пользователь с такой почтой не найден');
    }
    return user.username;
}

export async function loginByEmail(params: LoginByEmailParams): Promise<LoginResponse> {
    const username = await resolveUsernameByEmail(params.email);

    return fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username,
            password: params.password,
            expiresInMins: 60,
        }),
    });
}
