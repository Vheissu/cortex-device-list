import { IDeviceState } from './state/device-store';

type DeviceRecord = Record<string, any>;

const SITE_URL = 'https://www.quadcortex.co';
const SITE_NAME = 'Quad Cortex Virtual Devices List';
const DEFAULT_DESCRIPTION = 'Search and filter Quad Cortex amps, cabinets, effects, captures and plugin devices, with real model references, descriptions and useful device details.';

const ROUTE_COPY: Record<string, { title: string; description: string; collection: string }> = {
    all: {
        title: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        collection: 'all',
    },
    amps: {
        title: 'Quad Cortex amp models',
        description: 'Browse Quad Cortex amplifier models with real amp references, matching cabinets, device descriptions and CorOS version data.',
        collection: 'amps',
    },
    cabs: {
        title: 'Quad Cortex cabinet models',
        description: 'Browse Quad Cortex cabinet and impulse response models with speaker references, IR author details and instrument filters.',
        collection: 'cabs',
    },
    effects: {
        title: 'Quad Cortex effects list',
        description: 'Browse Quad Cortex effects by type, including drives, delays, reverbs, compressors, pitch, modulation and utility blocks.',
        collection: 'effects',
    },
    captures: {
        title: 'Quad Cortex capture models',
        description: 'Browse Quad Cortex factory captures with real device references, categories and model details.',
        collection: 'captures',
    },
    plugins: {
        title: 'Quad Cortex plugin devices',
        description: 'Browse Neural DSP plugin devices available on Quad Cortex, including amplifier, cabinet and effect blocks from supported plugins.',
        collection: 'plugins',
    },
};

function getRouteId(): string {
    const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    return hash || 'all';
}

function setMeta(name: string, content: string, attr = 'name'): void {
    let element = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
    }

    element.content = content;
}

function setCanonical(url: string): void {
    let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

    if (!element) {
        element = document.createElement('link');
        element.rel = 'canonical';
        document.head.appendChild(element);
    }

    element.href = url;
}

function getCanonicalPath(routeId: string): string {
    return routeId === 'all' ? '/' : `/#/${routeId}`;
}

function summariseDevices(devices: DeviceRecord[]): string {
    const names = devices.slice(0, 8).map((device) => device.name).join(', ');
    return names ? ` Includes ${names}.` : '';
}

function toListItem(device: DeviceRecord, index: number): Record<string, any> {
    return {
        '@type': 'ListItem',
        position: index + 1,
        name: device.name,
        item: {
            '@type': 'Product',
            name: device.name,
            description: device.seoDescription || device.description,
            image: device.seoImage ? `${SITE_URL}/${device.seoImage}` : undefined,
            brand: device.brand ? { '@type': 'Brand', name: device.brand } : undefined,
            model: device.model || device.real,
            category: device.deviceTypeLabel || device.deviceType,
            additionalProperty: [
                device.real ? { '@type': 'PropertyValue', name: 'Based on', value: device.real } : undefined,
                device.addedIn ? { '@type': 'PropertyValue', name: 'CorOS version', value: device.addedIn } : undefined,
                device.type ? { '@type': 'PropertyValue', name: 'Instrument', value: device.type } : undefined,
            ].filter(Boolean),
        },
    };
}

function setJsonLd(id: string, data: Record<string, any>): void {
    let element = document.getElementById(id) as HTMLScriptElement | null;

    if (!element) {
        element = document.createElement('script');
        element.type = 'application/ld+json';
        element.id = id;
        document.head.appendChild(element);
    }

    element.textContent = JSON.stringify(data);
}

export function updateSeo(state: IDeviceState): void {
    const routeId = getRouteId();
    const route = ROUTE_COPY[routeId] || ROUTE_COPY.all;
    const devices = state.data[route.collection] || state.data.all || [];
    const canonicalUrl = `${SITE_URL}${getCanonicalPath(routeId)}`;
    const description = `${route.description}${summariseDevices(devices)}`;
    const title = routeId === 'all' ? route.title : `${route.title} | Quad Cortex Virtual Devices List`;

    document.title = title;
    setCanonical(canonicalUrl);
    setMeta('description', description);
    setMeta('robots', 'index,follow,max-image-preview:large');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    setJsonLd('device-list-json-ld', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        description,
        url: canonicalUrl,
        numberOfItems: devices.length,
        itemListElement: devices.slice(0, 100).map(toListItem),
    });
}
