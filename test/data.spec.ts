import { Data } from '../src/data';
import { initialDeviceState } from '../src/state/device-store';

type TestDevice = {
    id?: string;
    detailsId?: string;
    images?: { src: string }[];
    seoImage?: string;
    name?: string;
    description?: string;
};

describe('device data', () => {
    it('keeps every explicit detailsId in the searchable data connected to a detail record', () => {
        const detailsIds = new Set(Data.details.map((detail) => detail.id));
        const devices: TestDevice[] = [
            ...Data.amps,
            ...Data.cabs,
            ...Data.effects,
            ...Data.captures,
            ...Data.plugins,
        ];
        const missingDetails = devices
            .map((device) => device.detailsId)
            .filter(Boolean)
            .filter((detailId) => !detailsIds.has(detailId));

        expect(missingDetails).toEqual([]);
    });

    it('enriches Cortex devices with descriptions, images and affiliate data from their detail record', () => {
        const rolandJazzChorus = Data.amps.find((amp) => amp.detailsId === 'roland-jc120') as TestDevice | undefined;

        expect(rolandJazzChorus).toEqual(expect.objectContaining({
            name: 'Rols Jazz CH120',
            brand: 'Roland',
            description: expect.stringContaining('solid-state stereo combo'),
            amazonAffiliateLink: expect.stringContaining('tag=figurated-22'),
        }));
        expect(rolandJazzChorus?.images?.[0]?.src).toBe('roland-jazz-chorus.jpeg');
        expect(rolandJazzChorus?.seoImage).toBe('images/roland-jazz-chorus.jpeg');
    });

    it('merges detail-only affiliate additions without losing the base detail content', () => {
        const bd2Detail = Data.details.find((detail) => detail.id === 'bd-2');

        expect(bd2Detail).toEqual(expect.objectContaining({
            id: 'bd-2',
            amazonAffiliateLink: expect.stringContaining('BOSS+BD-2+Blues+Driver'),
        }));
        expect(bd2Detail?.name).toBeTruthy();
        expect(bd2Detail?.description).toBeTruthy();
    });

    it('builds sorted state buckets without details leaking into the all-devices list', () => {
        const state = initialDeviceState;
        const expectedAllCount = state.data.amps.length
            + state.data.cabs.length
            + state.data.effects.length
            + state.data.captures.length
            + state.data.plugins.length;

        expect(state.data.all).toHaveLength(expectedAllCount);
        expect(state.data.all).not.toContain(state.data.details[0]);
        expect(state.data.amps[0].name.localeCompare(state.data.amps[1].name)).toBeLessThanOrEqual(0);
    });
});
