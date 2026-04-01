const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // 1. Set all to indexable=true by default
    console.log('Setting all SEO entries to indexable=true...');
    const allRes = await fetch(`${DIRECTUS_URL}/items/seo?fields=id&limit=200`, { headers });
    const allData = await allRes.json();
    const allIds = allData.data.map(i => i.id);
    await fetch(`${DIRECTUS_URL}/items/seo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ keys: allIds, data: { indexable: true } })
    });
    console.log('  Set ' + allIds.length + ' entries to indexable=true');

    // 2. Set legal pages to indexable=false
    console.log('Marking legal pages as not indexable...');
    const noindexSlugs = ['/aviso-legal', '/politica-de-privacidad', '/politica-de-cookies', '/en/legal-notice', '/en/privacy-policy', '/en/cookie-policy'];
    for (const slug of noindexSlugs) {
        const res = await fetch(`${DIRECTUS_URL}/items/seo?fields=id&filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`, { headers });
        const data = await res.json();
        if (data.data && data.data[0]) {
            await fetch(`${DIRECTUS_URL}/items/seo/${data.data[0].id}`, {
                method: 'PATCH', headers,
                body: JSON.stringify({ indexable: false })
            });
            console.log('  noindex: ' + slug);
        }
    }
    console.log('Done!');
}
main().catch(console.error);
