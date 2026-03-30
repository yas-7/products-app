import type { Product } from '../types';

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

export function filterLocalProducts(products: Product[], searchQuery: string): Product[] {
    const query = normalize(searchQuery);

    if (query.length === 0) {
        return products;
    }

    return products.filter((product) => {
        return [product.title, product.brand ?? '', product.sku ?? '']
            .join(' ')
            .toLowerCase()
            .includes(query);
    });
}
