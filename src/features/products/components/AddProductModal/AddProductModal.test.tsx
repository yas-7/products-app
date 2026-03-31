import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AddProductModal } from './AddProductModal';

describe('AddProductModal', () => {
    it('shows validation errors when submitted empty', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();

        render(<AddProductModal onClose={onClose} onSubmit={onSubmit} />);

        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(screen.getByText('Укажите наименование')).toBeInTheDocument();
        expect(screen.getByText('Укажите цену')).toBeInTheDocument();
        expect(screen.getByText('Укажите вендора')).toBeInTheDocument();
        expect(screen.getByText('Укажите артикул')).toBeInTheDocument();

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits normalized product data', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();

        render(<AddProductModal onClose={onClose} onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText('Наименование'), '  iPhone 17  ');
        await user.type(screen.getByLabelText('Цена'), '1999.99');
        await user.type(screen.getByLabelText('Вендор'), '  Apple  ');
        await user.type(screen.getByLabelText('Артикул'), '  ABC-17  ');

        await user.click(screen.getByRole('button', { name: 'Сохранить' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({
            title: 'iPhone 17',
            price: 1999.99,
            brand: 'Apple',
            sku: 'IPH-17',
        });
    });

    it('calls onClose when clicking overlay', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        const onSubmit = vi.fn();

        const { container } = render(<AddProductModal onClose={onClose} onSubmit={onSubmit} />);

        const overlay = container.firstChild as HTMLElement;
        await user.click(overlay);

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
