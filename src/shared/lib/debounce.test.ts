import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('calls callback only once with the latest arguments', () => {
        const callback = vi.fn();
        const debounced = debounce(callback, 300);

        debounced('a');
        debounced('ab');
        debounced('abc');

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(299);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith('abc');
    });

    it('cancels pending callback', () => {
        const callback = vi.fn();
        const debounced = debounce(callback, 300);

        debounced('hello');
        debounced.cancel();

        vi.advanceTimersByTime(300);

        expect(callback).not.toHaveBeenCalled();
    });
});
