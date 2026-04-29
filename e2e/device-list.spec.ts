import { expect, test } from '@playwright/test';

test.describe('device list navigation', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium', 'Desktop navigation flow');
    });

    test('loads the app, switches theme and navigates between device sections', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByRole('link', { name: /Quad Cortex Virtual Devices/ })).toBeVisible();
        await expect(page.getByText('Rols Jazz CH120').first()).toBeVisible();

        await page.getByRole('link', { name: 'Theme' }).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

        await page.getByRole('link', { name: 'Amps' }).click();
        await expect(page).toHaveURL(/#\/amps$/);
        await expect(page.getByPlaceholder('Device model...')).toBeVisible();
        await expect(page.locator('.table-container').getByRole('button', { name: 'Rols Jazz CH120' })).toBeVisible();

        await page.getByRole('link', { name: 'Plugins' }).click();
        await expect(page).toHaveURL(/#\/plugins$/);
        await expect(page.getByPlaceholder('Search device...')).toBeVisible();
        await expect(page.getByText(/Archetype|Nolly|Gojira/).first()).toBeVisible();
    });
});

test.describe('desktop tables', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'chromium', 'Desktop-only table flow');
    });

    test.use({ viewport: { width: 1280, height: 900 } });

    test('searches the amps table and opens a rich device modal', async ({ page }) => {
        await page.goto('/#/amps');

        await page.getByPlaceholder('Device model...').fill('Rols Jazz');

        const table = page.locator('.table-container');
        await expect(table.getByRole('button', { name: 'Rols Jazz CH120' })).toBeVisible();
        await expect(table.getByText('Brit Blues')).toHaveCount(0);

        await table.getByRole('button', { name: 'Rols Jazz CH120' }).click();

        const modal = page.locator('.modal-content');
        await expect(modal.getByRole('heading', { name: 'Roland® JC-120 Jazz Chorus' })).toBeVisible();
        await expect(modal.getByText(/solid-state stereo combo/)).toBeVisible();
        await expect(modal.getByRole('link', { name: 'Buy on Amazon' })).toHaveAttribute('href', /amazon\.com\.au/);

        await modal.locator('.modal-footer button').click();
        await expect(modal).toBeHidden();
    });

    test('filters all devices by type and keeps paid plugins separate', async ({ page }) => {
        await page.goto('/#/all');

        await page.getByRole('combobox').selectOption('effect');

        const table = page.locator('.table-container');
        await expect(table.getByText('Brit Blues').first()).toBeVisible();
        await expect(table.getByText('Rols Jazz CH120')).toHaveCount(0);

        await page.getByRole('combobox').selectOption('amp');

        await expect(table.getByText('Rols Jazz CH120').first()).toBeVisible();
        await expect(table.getByText('Brit Blues')).toHaveCount(0);
    });

    test('searches paid plugins and opens plugin detail when available', async ({ page }) => {
        await page.goto('/#/plugins');

        await page.getByPlaceholder('Search device...').fill('Fortin');

        await expect(page.getByText(/Fortin/).first()).toBeVisible();
        await expect(page.locator('tbody tr').filter({ hasText: 'Fortin' }).first()).toBeVisible();
    });
});

test.describe('mobile cards', () => {
    test.beforeEach(async ({}, testInfo) => {
        test.skip(testInfo.project.name !== 'mobile-chromium', 'Mobile-only card flow');
    });

    test('shows mobile card layout and opens details from a card', async ({ page }) => {
        await page.goto('/#/amps');

        await expect(page.locator('.mobile-card-list')).toBeVisible();
        await page.locator('.mobile-card-list').getByText('Rols Jazz CH120').click();

        await expect(page.locator('.modal-content').getByRole('heading', { name: 'Roland® JC-120 Jazz Chorus' })).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(page.locator('.modal-content')).toBeHidden();
    });
});
