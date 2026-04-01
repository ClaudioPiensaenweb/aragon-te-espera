const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // Get current CSS and add iframe embed for SEO collection
    const settingsRes = await fetch(`${DIRECTUS_URL}/settings`, { headers });
    const settings = await settingsRes.json();
    let css = settings.data.custom_css || '';

    // Remove any old SEO-related CSS
    css = css.replace(/\/\* SEO Dashboard[\s\S]*?(?=\n\/\*|$)/g, '');
    css = css.replace(/\/\* SEO RankMath[\s\S]*?(?=\n\/\*|$)/g, '');

    // Inject CSS that hides default SEO list and shows iframe instead
    css += `
/* SEO Dashboard embed */
.collection-or-item[data-collection="seo"] .layout-tabular,
.collection-or-item[data-collection="seo"] .v-table,
[data-collection="seo"] .layout-tabular {
  font-size: 13px;
}
[data-collection="seo"] .layout-tabular td {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;

    await fetch(`${DIRECTUS_URL}/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ custom_css: css }),
    });

    // Set the SEO collection preview_url to the dashboard
    await fetch(`${DIRECTUS_URL}/collections/seo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({
            meta: {
                preview_url: 'http://localhost:3000/seo-dashboard'
            }
        })
    });

    console.log('Done! SEO collection configured with dashboard preview.');
    console.log('Access the dashboard at: http://localhost:3000/seo-dashboard');
    console.log('Or in Directus: Content > SEO (click preview icon on any item)');
}

main().catch(console.error);
