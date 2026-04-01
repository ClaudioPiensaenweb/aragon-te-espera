const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

// Adjust keywords to match what's in the slug
const fixes = [
    { id: 1, keyword: 'aragon' },  // slug: /  — can't match, simplify
    { id: 2, keyword: 'quienes-somos' },
    { id: 3, keyword: 'servicios' },
    { id: 4, keyword: 'colabora' },
    { id: 5, keyword: 'noticias' },
    { id: 7, keyword: 'politica-de-privacidad' },
    { id: 8, keyword: 'politica-de-cookies' },
    { id: 9, keyword: 'aragon' },
    { id: 10, keyword: 'about-us' },
    { id: 11, keyword: 'services' },
    { id: 12, keyword: 'collaborate' },
    { id: 13, keyword: 'news' },
    { id: 17, keyword: 'pirineo-aragones' },
    { id: 18, keyword: 'pueblos-bonitos' },
    { id: 20, keyword: 'aljaferia' },
    { id: 22, keyword: 'gastronomia-aragonesa' },
    { id: 24, keyword: 'albarracin' },
    { id: 25, keyword: 'festivales-tradiciones' },
    { id: 29, keyword: 'aljaferia-mudejar' },
    { id: 32, keyword: 'mallos-riglos' },
    { id: 33, keyword: 'albarracin' },
];

async function main() {
    console.log('Fixing keywords to match URLs...');
    for (const f of fixes) {
        // Also update meta_title and meta_description to include the new keyword
        const getRes = await fetch(`${DIRECTUS_URL}/items/seo/${f.id}?fields=meta_title,meta_description`, { headers });
        const getData = await getRes.json();
        const item = getData.data;

        let mt = item.meta_title || '';
        let md = item.meta_description || '';
        const kw = f.keyword;

        // Check if keyword already in meta_title and meta_description
        const kwInTitle = mt.toLowerCase().includes(kw);
        const kwInDesc = md.toLowerCase().includes(kw);

        const patch = { keyword: kw };

        // If keyword not in meta_title, try to add it
        if (!kwInTitle) {
            // Add keyword naturally at the start or replace beginning
            if (kw.includes('-')) {
                // Use readable version in text
                const readable = kw.replace(/-/g, ' ');
                if (!mt.toLowerCase().includes(readable)) {
                    patch.meta_title = readable.charAt(0).toUpperCase() + readable.slice(1) + ' - ' + mt;
                    if (patch.meta_title.length > 60) patch.meta_title = mt; // revert if too long
                }
            }
        }

        // If keyword not in meta_description, try to add it
        if (!kwInDesc) {
            if (kw.includes('-')) {
                const readable = kw.replace(/-/g, ' ');
                if (!md.toLowerCase().includes(readable)) {
                    const addition = readable.charAt(0).toUpperCase() + readable.slice(1) + '. ';
                    patch.meta_description = addition + md;
                    if (patch.meta_description.length > 160) patch.meta_description = md;
                }
            }
        }

        await fetch(`${DIRECTUS_URL}/items/seo/${f.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify(patch)
        });
        console.log('  Fixed id:' + f.id + ' → kw:' + kw);
    }
    console.log('Done!');
}

main().catch(console.error);
