type DeviceRecord = Record<string, any>;

const DEVICE_TYPE_LABELS: Record<string, string> = {
    amp: 'amplifier',
    cab: 'cabinet',
    capture: 'capture',
    compressor: 'compressor',
    delay: 'delay',
    drive: 'drive',
    effect: 'effect',
    eq: 'EQ',
    filter: 'filter',
    looper: 'looper',
    modulation: 'modulation',
    morph: 'morph',
    octaver: 'octaver',
    overdrive: 'overdrive',
    pitch: 'pitch',
    reverb: 'reverb',
    synth: 'synth',
    utility: 'utility',
    wah: 'wah',
    wow: 'wow',
};

function clean(value: string): string {
    return value
        .replace(/[®™]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getDeviceTypeLabel(device: DeviceRecord): string {
    const rawType = device.deviceTypeLabel || DEVICE_TYPE_LABELS[device.deviceType] || device.deviceType || 'device';
    return String(rawType).toLowerCase();
}

function getImage(device: DeviceRecord, detail?: DeviceRecord): string | undefined {
    if (device.image) {
        return `images/${device.image}`;
    }

    const detailImage = detail?.images?.[0]?.src;
    if (detailImage) {
        return `images/large-images/${detailImage}`;
    }

    return undefined;
}

function buildDescription(device: DeviceRecord, detail?: DeviceRecord): string {
    if (detail?.description) {
        return detail.description;
    }

    const typeLabel = getDeviceTypeLabel(device);
    const realModel = clean(device.real || '');
    const deviceName = clean(device.name || '');
    const instrument = device.type ? ` for ${device.type}` : '';
    const pluginCopy = device.requiresPlugin ? ' Requires a compatible Neural DSP plugin on Quad Cortex.' : '';
    const versionCopy = device.addedIn ? ` Added in ${device.addedIn}.` : '';

    if (realModel) {
        return `${deviceName} is a Quad Cortex ${typeLabel} model${instrument} based on ${realModel}.${pluginCopy}${versionCopy}`;
    }

    return `${deviceName} is a Quad Cortex ${typeLabel} model${instrument}.${pluginCopy}${versionCopy}`;
}

function buildKeywords(device: DeviceRecord, detail?: DeviceRecord): string[] {
    const values = [
        device.name,
        device.real,
        device.deviceType,
        device.deviceTypeLabel,
        device.type,
        device.irAuthor,
        detail?.brand,
        detail?.model,
        ...(detail?.genres || []),
    ];

    return Array.from(new Set(values.filter(Boolean).map((value) => clean(String(value)))));
}

export function enrichDevices<T extends DeviceRecord>(devices: T[], details: DeviceRecord[]): T[] {
    const detailMap = new Map(details.map((detail) => [detail.id, detail]));

    return devices.map((device) => {
        const detailId = device.detailsId || device.id;
        const detail = detailMap.get(detailId);
        const description = buildDescription(device, detail);
        const image = getImage(device, detail);

        return {
            ...device,
            brand: device.brand || detail?.brand,
            model: device.model || detail?.model,
            description,
            images: device.images || detail?.images || [],
            image: device.image || image?.replace('images/', ''),
            productLink: device.productLink || detail?.productLink,
            amazonAffiliateLink: device.amazonAffiliateLink || detail?.amazonAffiliateLink,
            genres: device.genres || detail?.genres || [],
            meta: device.meta || detail?.meta || [],
            searchKeywords: buildKeywords(device, detail),
            seoTitle: `${clean(device.name || '')} | Quad Cortex ${getDeviceTypeLabel(device)}`,
            seoDescription: description.length > 158 ? `${description.slice(0, 155).trim()}...` : description,
            seoImage: image,
        };
    });
}
