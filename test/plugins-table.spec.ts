import { PluginsTable } from '../src/views/plugins-table';
import { click, flush, normaliseText, renderFixture } from './helper';

describe('plugins-table', () => {
    it('toggles amp and cab plugin sections through their renamed collapsed flags', () => {
        const table = new PluginsTable();
        const event = { stopPropagation: jest.fn() } as unknown as Event;

        table.toggleSection('amp', event);
        table.toggleSection('cab', event);

        expect(table.amplifierCollapsed).toBe(true);
        expect(table.cabinetCollapsed).toBe(true);
        expect(table.isCollapsed('amp')).toBe(true);
        expect(table.isCollapsed('cab')).toBe(true);
        expect(event.stopPropagation).toHaveBeenCalledTimes(2);
    });

    it('renders grouped plugin rows and invokes showDetail when a device is clicked', async () => {
        const showDetail = jest.fn();

        const { appHost, tearDown } = await renderFixture(
            '<plugins-table plugins.bind="plugins" show-detail.bind="showDetail"></plugins-table>',
            class App {
                public plugins = [
                    { id: 'drive1', name: 'Tight Drive', real: 'Modern Drive', deviceType: 'overdrive', addedIn: '3.1' },
                    { id: 'amp1', name: 'Archetype Lead', real: 'Plugin Amp', deviceType: 'amp', addedIn: '3.2' },
                ];
                public showDetail = showDetail;
            },
            [PluginsTable]
        );

        expect(normaliseText(appHost)).toContain('Tight Drive');
        expect(normaliseText(appHost)).toContain('Archetype Lead');
        expect(normaliseText(appHost)).toContain('Modern Drive');
        expect(normaliseText(appHost)).toContain('3.2');

        click(appHost.querySelector('.device-name') as HTMLElement);
        await flush();

        expect(showDetail).toHaveBeenCalledWith(expect.objectContaining({ id: 'drive1' }));

        await tearDown();
    });
});
