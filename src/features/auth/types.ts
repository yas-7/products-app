export type LoginFormValues = {
    email: string;
    password: string;
    remember: boolean;
};

export type UserLookupResponse = {
    users: Array<{
        email: string;
        username: string;
    }>;
};

export type LoginResponse = {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    accessToken: string;
    refreshToken: string;
};

export type AuthUser = Omit<LoginResponse, 'accessToken' | 'refreshToken'>;
