import { Data } from '../src/data';
import { initialDeviceState } from '../src/state/device-store';

type TestDevice = {
    id?: string;
    detailsId?: string;
    images?: { src: string }[];
    seoImage?: string;
    name?: string;
    description?: string;
    amazonAffiliateLink?: string;
    meta?: { label: string; value: string }[];
};

const releasedDeviceBuckets = [
    Data.amps,
    Data.cabs,
    Data.effects,
    Data.captures,
    Data.plugins,
];

describe('device data', () => {
    it('matches the current released Quad Cortex catalogue totals', () => {
        expect({
            amps: Data.amps.length,
            cabsAndIrLoaders: Data.cabs.length,
            effects: Data.effects.length,
            captures: Data.captures.length,
            plugins: Data.plugins.length,
        }).toEqual({
            amps: 96,
            cabsAndIrLoaders: 78,
            effects: 136,
            captures: 164,
            plugins: 73,
        });

        expect(releasedDeviceBuckets.reduce((total, devices) => total + devices.length, 0)).toBe(547);
    });

    it('does not list the same released device twice within a category', () => {
        releasedDeviceBuckets.forEach((devices) => {
            const names = devices.map((device) => device.name);

            expect(new Set(names).size).toBe(names.length);
        });
    });

    it('tracks the current CorOS and plugin compatibility releases', () => {
        const corOsFourDevices = Data.effects
            .filter((device) => device.addedIn === '4.0.0')
            .map((device) => device.name)
            .sort();
        const corOsThreeTwoPlugins = Data.plugins.filter((device) => [
            'Archetype: Cory Wong X',
            'Archetype: Nolly X',
            'Parallax X',
        ].some((pluginName) => device.real.startsWith(pluginName)));

        expect(corOsFourDevices).toEqual([
            'Blossom (ST)',
            'Nordic Concert Hall (ST)',
            'Phase Doctor',
            'Studio Plate 70 (ST)',
        ]);
        expect(Data.captures).toEqual(expect.arrayContaining([
            expect.objectContaining({ name: 'Brit 2203 87', addedIn: '3.3.0' }),
        ]));
        expect(corOsThreeTwoPlugins).toHaveLength(32);
        expect(corOsThreeTwoPlugins.every((device) => device.addedIn === '3.2.0')).toBe(true);
        expect(Data.plugins.every((device) => device.requiresPlugin === true)).toBe(true);
    });

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

    it('adds useful fallback modal data and affiliate search links for devices without hand-written details', () => {
        const firstCab = Data.cabs[0] as TestDevice;
        const firstPlugin = Data.plugins[0] as TestDevice;
        const firstCapture = Data.captures[0] as TestDevice;

        expect(firstCab.description).toContain('cabinet model based on');
        expect(firstCab.amazonAffiliateLink).toContain('tag=figurated-22');
        expect(firstCab.meta?.map((item) => item.label)).toEqual(expect.arrayContaining(['Based on', 'IR author']));

        expect(firstPlugin.description).toContain('Quad Cortex plugin');
        expect(firstPlugin.amazonAffiliateLink).toContain('tag=figurated-22');

        expect(firstCapture.description).toContain('Quad Cortex capture');
        expect(firstCapture.amazonAffiliateLink).toContain('tag=figurated-22');
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
