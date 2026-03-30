import { useAuthStore } from '../features/auth/store/useAuthStore';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

export function App() {
    const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return <ProductsPage />;
}
