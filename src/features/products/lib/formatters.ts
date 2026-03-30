export function formatRating(value?: number): string {
    if (typeof value !== 'number') {
        return '—';
    }

    return `${value.toFixed(1)}/5`;
}

export function formatPrice(value: number): string {
    return `$${value.toFixed(2)}`;
}

export function formatStock(value?: number): string {
    if (typeof value !== 'number') {
        return '—';
    }

    return String(value);
}
