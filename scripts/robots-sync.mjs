import { createServer } from 'http';
import { writeFileSync } from 'fs';

const PORT = 4000;
const HTML_DIR = '/usr/share/nginx/html';
const DIRECTUS = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const SITE_URL = 'https://aragonteespera.com';
const headers = { 'Authorization': `Bearer ${TOKEN}` };

// Priority and changefreq per type (extensible)
const TYPE_CONFIG = {
    page: { priority: '0.8', homePriority: '1.0', changefreq: 'monthly', homeChangefreq: 'weekly' },
    _default: { priority: '0.6', changefreq: 'monthly' }
};

function getTypeConfig(type) {
    return TYPE_CONFIG[type] || TYPE_CONFIG._default;
}

async function fetchSeoItems() {
    const res = await fetch(`${DIRECTUS}/items/seo?fields=slug,seo_data,language,page_type&limit=200`, { headers });
    const data = await res.json();
    return (data.data || []).map(i => ({
        ...i,
        // Normalize: extract no_index from plugin JSON
        no_index: i.seo_data && i.seo_data.no_index === true
    }));
}

async function fetchPostTranslations() {
    const res = await fetch(`${DIRECTUS}/items/posts?fields=slug,language,translation_group&filter[status][_eq]=published&limit=500`, { headers });
    const data = await res.json();
    return data.data || [];
}

// Match static pages across languages
const langMap = {
    '/': '/en', '/quienes-somos': '/en/about-us', '/servicios': '/en/services',
    '/colabora': '/en/collaborate', '/noticias': '/en/news',
    '/aviso-legal': '/en/legal-notice', '/politica-de-privacidad': '/en/privacy-policy',
    '/politica-de-cookies': '/en/cookie-policy'
};
const langMapReverse = Object.fromEntries(Object.entries(langMap).map(([k, v]) => [v, k]));

function findPageAlternate(slug, indexable) {
    const altSlug = langMap[slug] || langMapReverse[slug];
    if (!altSlug) return null;
    return indexable.find(i => i.slug === altSlug) || null;
}

// Build post alternate map from translation_group
function buildPostAlternates(postTranslations) {
    const groups = {};
    for (const p of postTranslations) {
        if (!p.translation_group) continue;
        if (!groups[p.translation_group]) groups[p.translation_group] = {};
        const prefix = p.language === 'en' ? '/en/news/' : '/noticias/';
        groups[p.translation_group][p.language] = prefix + p.slug;
    }
    const altMap = {};
    for (const group of Object.values(groups)) {
        if (group.es && group.en) {
            altMap[group.es] = { language: 'en', slug: group.en };
            altMap[group.en] = { language: 'es', slug: group.es };
        }
    }
    return altMap;
}

function generateRobots(items) {
    const slugs = items.filter(i => i.no_index === true).map(i => i.slug).filter(Boolean);
    let txt = '# Aragon te espera - robots.txt\n\n';
    txt += 'User-agent: *\nAllow: /\n\n';
    txt += 'Disallow: /seo-dashboard\n';
    slugs.forEach(s => { txt += 'Disallow: ' + s + '\n'; });
    txt += '\nSitemap: ' + SITE_URL + '/sitemap.xml\n';
    writeFileSync(HTML_DIR + '/robots.txt', txt, 'utf-8');
    return slugs;
}

function generateSitemap(items, postAltMap) {
    const indexable = items.filter(i => i.no_index !== true);

    // Discover all types and sort: 'page' first, then rest alphabetically
    const types = [...new Set(indexable.map(i => i.page_type))].sort((a, b) => {
        if (a === 'page') return -1;
        if (b === 'page') return 1;
        return a.localeCompare(b);
    });

    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n';
    xml += '        xmlns:ate="https://aragonteespera.com/ns">\n';

    for (const type of types) {
        const typeItems = indexable
            .filter(i => i.page_type === type)
            .sort((a, b) => a.language.localeCompare(b.language) || a.slug.localeCompare(b.slug));

        const conf = getTypeConfig(type);

        for (const item of typeItems) {
            const isHome = item.slug === '/' || item.slug === '/en';
            const priority = (type === 'page' && isHome) ? conf.homePriority : conf.priority;
            const changefreq = (type === 'page' && isHome) ? conf.homeChangefreq : conf.changefreq;

            // Find alternate: use page map for pages, post map for everything else
            const alt = type === 'page'
                ? findPageAlternate(item.slug, indexable)
                : (postAltMap[item.slug] || null);

            xml += '  <url>\n';
            xml += '    <loc>' + SITE_URL + item.slug + '</loc>\n';
            xml += '    <lastmod>' + today + '</lastmod>\n';
            xml += '    <changefreq>' + changefreq + '</changefreq>\n';
            xml += '    <priority>' + priority + '</priority>\n';
            xml += '    <ate:type>' + type + '</ate:type>\n';
            if (alt) {
                xml += '    <xhtml:link rel="alternate" hreflang="' + item.language + '" href="' + SITE_URL + item.slug + '"/>\n';
                xml += '    <xhtml:link rel="alternate" hreflang="' + alt.language + '" href="' + SITE_URL + alt.slug + '"/>\n';
            }
            xml += '  </url>\n';
        }
    }

    xml += '</urlset>\n';
    writeFileSync(HTML_DIR + '/sitemap.xml', xml, 'utf-8');
    return indexable.length;
}

const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
    if (req.method === 'POST' && req.url === '/sync') {
        try {
            const items = await fetchSeoItems();
            const postTranslations = await fetchPostTranslations();
            const postAltMap = buildPostAlternates(postTranslations);
            const disallowed = generateRobots(items);
            const urlCount = generateSitemap(items, postAltMap);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, disallowed: disallowed.length, sitemap_urls: urlCount }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: false, error: e.message }));
        }
    } else {
        res.writeHead(404); res.end();
    }
});

server.listen(PORT, () => console.log('robots-sync listening on :' + PORT));
