import { AmpsTable } from '../src/views/amps-table';
import { click, flush, normaliseText, renderFixture } from './helper';

describe('amps-table', () => {
    it('finds details by detailsId before falling back to the device id', () => {
        const table = new AmpsTable();
        const getItemById = jest.fn((itemId: string) => ({ id: itemId }));
        table.getItemById = getItemById;

        expect(table.getDetailForDevice({ id: 'device-id', detailsId: 'detail-id' })).toEqual({ id: 'detail-id' });
        expect(getItemById).toHaveBeenCalledWith('detail-id', 'details');

        expect(table.getDetailForDevice({ id: 'device-id' })).toEqual({ id: 'device-id' });
        expect(getItemById).toHaveBeenCalledWith('device-id', 'details');
    });

    it('renders amp rows with matching cabs, affiliate links and clickable device names', async () => {
        const showDetail = jest.fn();
        const details = {
            amp1: { id: 'amp1', amazonAffiliateLink: 'https://amazon.example/amp1' },
        };

        const { appHost, tearDown } = await renderFixture(
            '<amps-table amps.bind="amps" get-item.bind="getItem" get-item-by-id.bind="getItemById" show-detail.bind="showDetail"></amps-table>',
            class App {
                public amps = [
                    {
                        id: 'amp1',
                        name: 'US Deluxe',
                        real: 'Fender Deluxe Reverb',
                        type: 'guitar',
                        cabs: ['cab1'],
                        addedIn: '2.4.0',
                    },
                ];
                public showDetail = showDetail;
                public getItem = (itemId: string) => ({ id: itemId, name: 'Matching 1x12' });
                public getItemById = (itemId: string) => details[itemId];
            },
            [AmpsTable]
        );

        expect(normaliseText(appHost)).toContain('US Deluxe');
        expect(normaliseText(appHost)).toContain('Fender Deluxe Reverb');
        expect(normaliseText(appHost)).toContain('guitar');
        expect(normaliseText(appHost)).toContain('Matching 1x12');
        expect(normaliseText(appHost)).toContain('2.4.0');
        expect(appHost.querySelector('a[href="https://amazon.example/amp1"]')).not.toBeNull();

        click(appHost.querySelector('.device-name') as HTMLElement);
        await flush();

        expect(showDetail).toHaveBeenCalledWith(expect.objectContaining({ id: 'amp1' }));

        await tearDown();
    });
});
