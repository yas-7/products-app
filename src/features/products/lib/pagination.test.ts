import { describe, expect, it } from 'vitest';

import { getTotalPages, getVisiblePages } from './pagination';

describe('pagination helpers', () => {
    it('calculates total pages', () => {
        expect(getTotalPages(0, 20)).toBe(1);
        expect(getTotalPages(1, 20)).toBe(1);
        expect(getTotalPages(20, 20)).toBe(1);
        expect(getTotalPages(21, 20)).toBe(2);
        expect(getTotalPages(101, 20)).toBe(6);
    });

    it('returns all pages when total pages less than max visible', () => {
        expect(getVisiblePages(1, 3, 5)).toEqual([1, 2, 3]);
    });

    it('returns centered visible pages when possible', () => {
        expect(getVisiblePages(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    });

    it('shifts visible pages to the start boundary', () => {
        expect(getVisiblePages(1, 10, 5)).toEqual([1, 2, 3, 4, 5]);
        expect(getVisiblePages(2, 10, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('shifts visible pages to the end boundary', () => {
        expect(getVisiblePages(10, 10, 5)).toEqual([6, 7, 8, 9, 10]);
        expect(getVisiblePages(9, 10, 5)).toEqual([6, 7, 8, 9, 10]);
    });
});
