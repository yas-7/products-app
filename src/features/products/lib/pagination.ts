export function getTotalPages(total: number, pageSize: number): number {
    return Math.max(1, Math.ceil(total / pageSize));
}

export function getVisiblePages(
    currentPage: number,
    totalPages: number,
    maxVisible: number,
): number[] {
    if (totalPages <= maxVisible) {
        return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
        start = 1;
        end = maxVisible;
    }

    if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxVisible + 1;
    }

    return [...Array(end - start + 1)].map((_, i) => start + i);
}
