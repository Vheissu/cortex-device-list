import { AllTable } from '../src/views/all-table';
import { click, flush, normaliseText, renderFixture } from './helper';

describe('all-table', () => {
    it('groups effect-style devices with effects and keeps paid plugin devices separate', () => {
        const table = new AllTable();
        const devices = [
            { name: 'Amp', deviceType: 'amp' },
            { name: 'Drive', deviceType: 'overdrive' },
            { name: 'Plugin Amp', deviceType: 'amp', requiresPlugin: true },
        ];

        expect(table.getDevicesByType(devices, 'effect')).toEqual([
            { name: 'Drive', deviceType: 'overdrive' },
        ]);
        expect(table.getPluginDevices(devices)).toEqual([
            { name: 'Plugin Amp', deviceType: 'amp', requiresPlugin: true },
        ]);
    });

    it('collapses empty groups only while a filter is active', () => {
        const table = new AllTable();
        const displayData = [
            { name: 'Only Amp', deviceType: 'amp' },
            { name: 'Only Plugin', deviceType: 'delay', requiresPlugin: true },
        ];

        table['filters'][0].value = 'only';
        table.$displayDataChanged(displayData);

        expect(table.ampCollapsed).toBe(false);
        expect(table.cabCollapsed).toBe(true);
        expect(table.effectCollapsed).toBe(true);
        expect(table.pluginsCollapsed).toBe(false);

        table['filters'][0].value = '';
        table.$displayDataChanged(displayData);

        expect(table.cabCollapsed).toBe(false);
        expect(table.effectCollapsed).toBe(false);
    });

    it('matches the all-devices effect filter against concrete effect device types', () => {
        const table = new AllTable();
        const typeFilter = table['filters'][2];

        expect(typeFilter.custom('effect', { deviceType: 'overdrive' })).toBe(true);
        expect(typeFilter.custom('effect', { deviceType: 'delay' })).toBe(true);
        expect(typeFilter.custom('effect', { deviceType: 'amp' })).toBe(false);
        expect(typeFilter.custom('effect', { deviceType: 'overdrive', requiresPlugin: true })).toBe(false);
    });

    it('renders grouped rows, affiliate links and invokes showDetail when a device is clicked', async () => {
        const showDetail = jest.fn();
        const details = {
            amp1: { id: 'amp1', amazonAffiliateLink: 'https://amazon.example/amp1' },
            plugin1: { id: 'plugin1', amazonAffiliateLink: 'https://amazon.example/plugin1' },
        };

        const { appHost, tearDown } = await renderFixture(
            '<all-table all.bind="all" get-item-by-id.bind="getItemById" show-detail.bind="showDetail"></all-table>',
            class App {
                public all = [
                    { id: 'amp1', name: 'Dream Lead', real: 'Real Amp', deviceType: 'amp', addedIn: '3.0' },
                    { id: 'effect1', name: 'Soft Drive', real: 'Real Drive', deviceType: 'overdrive' },
                    { id: 'plugin1', name: 'Plugin Delay', real: 'Real Delay', deviceType: 'delay', deviceTypeLabel: 'Delay', requiresPlugin: true },
                ];
                public showDetail = showDetail;
                public getItemById = (itemId: string) => details[itemId];
            },
            [AllTable]
        );

        expect(normaliseText(appHost)).toContain('Dream Lead');
        expect(normaliseText(appHost)).toContain('Soft Drive');
        expect(normaliseText(appHost)).toContain('Plugin Delay');
        expect(appHost.querySelector('a[href="https://amazon.example/amp1"]')).not.toBeNull();
        expect(appHost.querySelector('a[href="https://amazon.example/plugin1"]')).not.toBeNull();

        click(appHost.querySelector('.device-name') as HTMLElement);
        await flush();

        expect(showDetail).toHaveBeenCalledWith(expect.objectContaining({ id: 'amp1' }));

        click(appHost.querySelector('.section-header') as HTMLElement);
        await flush();

        expect(normaliseText(appHost)).not.toContain('Dream Lead');
        expect(normaliseText(appHost)).toContain('Soft Drive');

        await tearDown();
    });
});
