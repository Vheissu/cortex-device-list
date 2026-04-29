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

    if (device.requiresPlugin && realModel) {
        return `${deviceName} is a Quad Cortex plugin ${typeLabel}${instrument} from ${realModel}. It is useful when you want the matching Neural DSP plugin voice available inside a Cortex preset, while keeping the device list searchable by source plugin, model type and CorOS version.${versionCopy}`;
    }

    if (device.deviceType === 'cab' && realModel) {
        const authorCopy = device.irAuthor ? ` The impulse response was authored by ${clean(device.irAuthor)}.` : '';
        return `${deviceName} is a Quad Cortex cabinet model based on ${realModel}.${authorCopy} Use it when matching amps to a speaker and microphone character, or when comparing cabinets by driver family and enclosure size.${versionCopy}`;
    }

    if (device.deviceType === 'capture' && realModel) {
        return `${deviceName} is a Quad Cortex capture based on ${realModel}. Captures are snapshots of a real rig or signal chain, so this entry is best read as a reference to the source hardware and the style of tone it is likely to cover.${versionCopy}`;
    }

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

function buildAmazonAffiliateLink(device: DeviceRecord, detail?: DeviceRecord): string | undefined {
    if (device.amazonAffiliateLink || detail?.amazonAffiliateLink) {
        return device.amazonAffiliateLink || detail?.amazonAffiliateLink;
    }

    const query = clean(detail?.name || detail?.model || device.real || device.name || '');
    if (!query) {
        return undefined;
    }

    return `https://www.amazon.com.au/s?k=${encodeURIComponent(query)}&tag=figurated-22`;
}

function buildMeta(device: DeviceRecord, detail?: DeviceRecord): DeviceRecord[] {
    if (detail?.meta?.length) {
        return detail.meta;
    }

    const meta = [
        device.real && { label: 'Based on', value: clean(device.real) },
        { label: 'Device type', value: getDeviceTypeLabel(device) },
        device.type && { label: 'Instrument', value: clean(device.type) },
        device.deviceTypeLabel && { label: 'Category', value: clean(device.deviceTypeLabel) },
        device.irAuthor && { label: 'IR author', value: clean(device.irAuthor) },
        device.requiresPlugin && { label: 'Plugin device', value: 'Requires a compatible Neural DSP plugin licence' },
        device.addedIn && { label: 'Added in CorOS', value: clean(device.addedIn) },
    ];

    return meta.filter(Boolean) as DeviceRecord[];
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
            amazonAffiliateLink: buildAmazonAffiliateLink(device, detail),
            genres: device.genres || detail?.genres || [],
            meta: device.meta || buildMeta(device, detail),
            searchKeywords: buildKeywords(device, detail),
            seoTitle: `${clean(device.name || '')} | Quad Cortex ${getDeviceTypeLabel(device)}`,
            seoDescription: description.length > 158 ? `${description.slice(0, 155).trim()}...` : description,
            seoImage: image,
        };
    });
}
