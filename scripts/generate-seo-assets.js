const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const siteUrl = (process.env.SITE_URL || 'https://www.quadcortex.co').replace(/\/$/, '');

const dataDir = path.join(root, 'src', 'data');
const collections = ['amps', 'cabs', 'effects', 'captures'];
const pluginFiles = ['gojira', 'plini', 'nameless', 'slo-100', 'cory-wong', 'nolly', 'parallax'];
const categories = [
    {
        path: 'amps',
        title: 'Quad Cortex amp models',
        description: 'Browse Quad Cortex amplifier models with real amp references, matching cabinets, device descriptions and CorOS version data.',
    },
    {
        path: 'cabs',
        title: 'Quad Cortex cabinet models',
        description: 'Browse Quad Cortex cabinet and impulse response models with speaker references, IR author details and instrument filters.',
    },
    {
        path: 'effects',
        title: 'Quad Cortex effects list',
        description: 'Browse Quad Cortex effects by type, including drives, delays, reverbs, compressors, pitch, modulation and utility blocks.',
    },
    {
        path: 'captures',
        title: 'Quad Cortex capture models',
        description: 'Browse Quad Cortex factory captures with real device references, categories and model details.',
    },
    {
        path: 'plugins',
        title: 'Quad Cortex plugin devices',
        description: 'Browse Neural DSP plugin devices available on Quad Cortex, including amplifier, cabinet and effect blocks from supported plugins.',
    },
];

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

function htmlEscape(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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

const details = [...readJson(path.join(dataDir, 'details.json')), ...readJson(path.join(dataDir, 'details-extra.json'))]
    .reduce((items, detail) => {
        const existingIndex = items.findIndex((item) => item.id === detail.id);

        if (existingIndex >= 0) {
            items[existingIndex] = { ...items[existingIndex], ...detail };
        } else {
            items.push(detail);
        }

        return items;
    }, []);
const detailMap = new Map(details.map((detail) => [detail.id, detail]));
const devices = collections.flatMap((collection) => readJson(path.join(dataDir, `${collection}.json`)));
const plugins = pluginFiles.flatMap((plugin) => readJson(path.join(dataDir, 'plugins', `${plugin}.json`)));
const allDevices = [...devices, ...plugins];

const urls = [
    {
        loc: `${siteUrl}/`,
        priority: '1.0',
    },
    ...categories.map((category) => ({
        loc: `${siteUrl}/${category.path}/`,
        priority: '0.8',
    })),
    ...allDevices.map((device) => ({
        loc: `${siteUrl}/devices/${slugify(device.name)}/`,
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
    const slug = slugify(device.name);

    return {
        id: device.id,
        name: device.name,
        basedOn: device.real,
        type: device.deviceTypeLabel || device.deviceType,
        category: categoryPath(device),
        description: deviceDescription(device, detail),
        image,
        url: `/devices/${slug}/`,
        appUrl: `/#/${categoryPath(device)}?device=${slug}`,
        addedIn: device.addedIn,
    };
});

function pageHtml({ title, description, canonicalPath, body, jsonLd, image }) {
    const ogImage = image && image.startsWith('http') ? image : `${siteUrl}${image || '/og-image.png'}`;
    const isLargeImage = !image || image === '/og-image.png';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>${htmlEscape(title)} | Quad Cortex Virtual Devices List</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${htmlEscape(description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <link rel="canonical" href="${siteUrl}${canonicalPath}">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" href="/favicon.svg">
    <meta property="og:site_name" content="Quad Cortex Virtual Devices List">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${htmlEscape(title)}">
    <meta property="og:description" content="${htmlEscape(description)}">
    <meta property="og:url" content="${siteUrl}${canonicalPath}">
    <meta property="og:image" content="${htmlEscape(ogImage)}">
    <meta property="og:image:alt" content="${htmlEscape(title)}">${isLargeImage ? `
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">` : ''}
    <meta name="twitter:card" content="${isLargeImage ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${htmlEscape(title)}">
    <meta name="twitter:description" content="${htmlEscape(description)}">
    <meta name="twitter:image" content="${htmlEscape(ogImage)}">
    <meta name="twitter:image:alt" content="${htmlEscape(title)}">
    <style>
        body { font-family: Charter, Georgia, serif; margin: 0; color: #1d1b18; background: #fbfaf7; }
        main { max-width: 960px; margin: 0 auto; padding: 48px 20px; }
        h1 { font-size: clamp(2rem, 6vw, 4rem); line-height: 1; margin: 0 0 16px; }
        p { font-size: 1.0625rem; line-height: 1.6; }
        a { color: #6f2f17; }
        table { width: 100%; border-collapse: collapse; margin-top: 32px; font-family: system-ui, sans-serif; font-size: 0.95rem; }
        th, td { border-bottom: 1px solid #ded8ce; padding: 12px 8px; text-align: left; vertical-align: top; }
        th { font-weight: 700; }
        img { max-width: 320px; height: auto; }
    </style>
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
    <main>
${body}
    </main>
</body>
</html>
`;
}

function writePage(relativePath, html) {
    const dir = path.join(dist, relativePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
}

categories.forEach((category) => {
    const categoryDevices = searchIndex.filter((device) => device.category === category.path);
    const body = `        <h1>${htmlEscape(category.title)}</h1>
        <p>${htmlEscape(category.description)}</p>
        <p><a href="/#/${category.path}">Open the interactive ${htmlEscape(category.path)} table</a></p>
        <table>
            <thead>
                <tr><th>Device</th><th>Based on</th><th>Type</th><th>Added in</th></tr>
            </thead>
            <tbody>
${categoryDevices.map((device) => `                <tr>
                    <td><a href="${htmlEscape(device.url)}">${htmlEscape(device.name)}</a></td>
                    <td>${htmlEscape(device.basedOn)}</td>
                    <td>${htmlEscape(device.type)}</td>
                    <td>${htmlEscape(device.addedIn)}</td>
                </tr>`).join('\n')}
            </tbody>
        </table>`;

    writePage(category.path, pageHtml({
        title: category.title,
        description: category.description,
        canonicalPath: `/${category.path}/`,
        body,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: category.title,
            description: category.description,
            numberOfItems: categoryDevices.length,
            itemListElement: categoryDevices.map((device, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${siteUrl}${device.url}`,
                name: device.name,
            })),
        },
    }));
});

searchIndex.forEach((device) => {
    const body = `        <p><a href="/${device.category}/">${htmlEscape(device.category)}</a></p>
        <h1>${htmlEscape(device.name)}</h1>
        <p>${htmlEscape(device.description)}</p>
        ${device.image ? `<img src="${htmlEscape(device.image)}" alt="${htmlEscape(device.name)}">` : ''}
        <table>
            <tbody>
                <tr><th>Based on</th><td>${htmlEscape(device.basedOn)}</td></tr>
                <tr><th>Type</th><td>${htmlEscape(device.type)}</td></tr>
                <tr><th>Added in</th><td>${htmlEscape(device.addedIn)}</td></tr>
            </tbody>
        </table>
        <p><a href="${htmlEscape(device.appUrl)}">Open ${htmlEscape(device.name)} in the interactive app</a></p>`;

    writePage(path.join('devices', slugify(device.name)), pageHtml({
        title: device.name,
        description: device.description,
        canonicalPath: device.url,
        body,
        image: device.image,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: device.name,
            description: device.description,
            image: device.image ? `${siteUrl}${device.image}` : undefined,
            model: device.basedOn,
            category: device.type,
        },
    }));
});

fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`);
fs.writeFileSync(path.join(dist, 'devices.json'), `${JSON.stringify(searchIndex, null, 2)}\n`);

console.log(`Generated SEO assets for ${allDevices.length} devices.`);
