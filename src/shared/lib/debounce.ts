export type DebouncedFunction<T extends (...args: never[]) => void> = ((
    ...args: Parameters<T>
) => void) & {
    cancel: () => void;
};

export function debounce<T extends (...args: never[]) => void>(
    callback: T,
    delay: number,
): DebouncedFunction<T> {
    let timeoutId: number | null = null;

    const debounced = ((...args: Parameters<T>) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    }) as DebouncedFunction<T>;

    debounced.cancel = () => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}
