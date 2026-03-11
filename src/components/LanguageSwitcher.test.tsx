import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/lib/i18n';

// Mock the useLanguage hook
vi.mock('@/lib/i18n', () => ({
    useLanguage: vi.fn(),
}));

describe('LanguageSwitcher', () => {
    it('renders with the current language highlighted', () => {
        (useLanguage as any).mockReturnValue({
            language: 'en',
            setLanguage: vi.fn(),
        });

        render(<LanguageSwitcher />);

        const enButton = screen.getByText('English');
        const esButton = screen.getByText('Español');

        expect(enButton).toHaveClass('bg-accent');
        expect(esButton).not.toHaveClass('bg-accent');
    });

    it('calls setLanguage when a button is clicked', () => {
        const setLanguage = vi.fn();
        (useLanguage as any).mockReturnValue({
            language: 'en',
            setLanguage,
        });

        render(<LanguageSwitcher />);

        const esButton = screen.getByText('Español');
        fireEvent.click(esButton);

        expect(setLanguage).toHaveBeenCalledWith('es');
    });
});
