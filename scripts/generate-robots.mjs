import { writeFileSync } from 'fs';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}` };
const OUTPUT = process.env.OUTPUT || '/usr/share/nginx/html/robots.txt';

async function main() {
    console.log('Generating robots.txt from Directus SEO data...');

    const res = await fetch(`${DIRECTUS_URL}/items/seo?fields=slug,indexable&filter[indexable][_eq]=false&limit=200`, { headers });
    const data = await res.json();
    const noindexSlugs = (data.data || []).map(i => i.slug).filter(Boolean);

    let content = '# Aragon te espera - robots.txt\n\n';
    content += 'User-agent: *\n';
    content += 'Allow: /\n\n';
    content += '# Paginas no indexables (noindex)\n';
    content += 'Disallow: /seo-dashboard\n';

    noindexSlugs.forEach(slug => {
        content += `Disallow: ${slug}\n`;
    });

    content += '\n# Sitemap\n';
    content += '# Sitemap: https://aragonteespera.com/sitemap.xml\n';

    writeFileSync(OUTPUT, content, 'utf-8');
    console.log(`robots.txt generated with ${noindexSlugs.length} noindex entries at ${OUTPUT}`);
    console.log('Disallowed paths:');
    console.log('  /seo-dashboard');
    noindexSlugs.forEach(s => console.log('  ' + s));
}

main().catch(console.error);
