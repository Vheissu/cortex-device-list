const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const siteUrl = (process.env.SITE_URL || 'https://www.quadcortex.co').replace(/\/$/, '');

const dataDir = path.join(root, 'src', 'data');
const collections = ['amps', 'cabs', 'effects', 'captures'];
const pluginFiles = ['gojira', 'plini', 'nameless', 'slo-100', 'cory-wong', 'nolly', 'parallax'];

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function xmlEscape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function clean(value) {
    return String(value || '')
        .replace(/[®™]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function slugify(value) {
    return clean(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function categoryPath(device) {
    if (device.requiresPlugin) return 'plugins';
    if (device.deviceType === 'amp') return 'amps';
    if (device.deviceType === 'cab') return 'cabs';
    if (device.deviceType === 'capture') return 'captures';
    return 'effects';
}

function deviceDescription(device, detail) {
    if (detail && detail.description) return detail.description;
    const basedOn = device.real ? ` based on ${clean(device.real)}` : '';
    const version = device.addedIn ? ` Added in ${device.addedIn}.` : '';
    return `${clean(device.name)} is a Quad Cortex ${device.deviceTypeLabel || device.deviceType || 'device'} model${basedOn}.${version}`;
}

if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist, { recursive: true });
}

const details = readJson(path.join(dataDir, 'details.json'));
const detailMap = new Map(details.map((detail) => [detail.id, detail]));
const devices = collections.flatMap((collection) => readJson(path.join(dataDir, `${collection}.json`)));
const plugins = pluginFiles.flatMap((plugin) => readJson(path.join(dataDir, 'plugins', `${plugin}.json`)));
const allDevices = [...devices, ...plugins];
const routes = ['', '#/amps', '#/cabs', '#/effects', '#/captures', '#/plugins'];

const urls = [
    ...routes.map((route) => ({
        loc: `${siteUrl}/${route}`,
        priority: route ? '0.8' : '1.0',
    })),
    ...allDevices.map((device) => ({
        loc: `${siteUrl}/#/${categoryPath(device)}?device=${slugify(device.name)}`,
        priority: '0.6',
    })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const searchIndex = allDevices.map((device) => {
    const detail = detailMap.get(device.detailsId || device.id);
    const image = device.image ? `/images/${device.image}` : detail?.images?.[0]?.src ? `/images/large-images/${detail.images[0].src}` : undefined;

    return {
        id: device.id,
        name: device.name,
        basedOn: device.real,
        type: device.deviceTypeLabel || device.deviceType,
        category: categoryPath(device),
        description: deviceDescription(device, detail),
        image,
        url: `/#/${categoryPath(device)}?device=${slugify(device.name)}`,
        addedIn: device.addedIn,
    };
});

fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
fs.writeFileSync(path.join(dist, 'devices.json'), `${JSON.stringify(searchIndex, null, 2)}\n`);

console.log(`Generated SEO assets for ${allDevices.length} devices.`);
