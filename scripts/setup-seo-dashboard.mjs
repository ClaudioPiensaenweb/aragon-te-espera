const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // 1. Remove SEO Insights dashboard if it exists
    console.log('Checking for old SEO Insights dashboard...');
    const dashRes = await fetch(`${DIRECTUS_URL}/dashboards?filter[name][_eq]=SEO Dashboard`, { headers });
    const dashData = await dashRes.json();
    if (dashData.data && dashData.data.length > 0) {
        for (const dash of dashData.data) {
            const panelsRes = await fetch(`${DIRECTUS_URL}/panels?filter[dashboard][_eq]=${dash.id}`, { headers });
            const panelsData = await panelsRes.json();
            for (const panel of (panelsData.data || [])) {
                await fetch(`${DIRECTUS_URL}/panels/${panel.id}`, { method: 'DELETE', headers });
                console.log(`  Deleted panel: ${panel.name}`);
            }
            await fetch(`${DIRECTUS_URL}/dashboards/${dash.id}`, { method: 'DELETE', headers });
            console.log(`  Deleted dashboard: ${dash.name}`);
        }
    } else {
        console.log('  No Insights dashboard found, skipping.');
    }

    // 2. Remove presentation-links field (broken preview)
    console.log('Removing old dashboard link field...');
    const fieldCheck = await fetch(`${DIRECTUS_URL}/fields/seo/seo_dashboard_link`, { headers });
    if (fieldCheck.ok) {
        await fetch(`${DIRECTUS_URL}/fields/seo/seo_dashboard_link`, { method: 'DELETE', headers });
        console.log('  Field deleted');
    } else {
        console.log('  Field not found, skipping');
    }

    // 3. Update collection note with dashboard URL
    console.log('Updating SEO collection note...');
    await fetch(`${DIRECTUS_URL}/collections/seo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({
            meta: {
                note: 'Panel SEO avanzado en http://localhost:3000/seo-dashboard'
            }
        })
    });
    console.log('  Collection note updated');

    // 4. Clean custom CSS
    console.log('Updating custom CSS...');
    const settingsRes = await fetch(`${DIRECTUS_URL}/settings`, { headers });
    const settings = await settingsRes.json();
    let css = settings.data.custom_css || '';

    // Remove all old SEO CSS blocks
    css = css.replace(/\/\* SEO[\s\S]*?(?=\n\/\*|$)/g, '');
    css = css.replace(/<\/style>[\s\S]*?<style>/g, '');

    css += `
/* SEO collection table styles */
[data-collection="seo"] .layout-tabular,
[data-collection="seo"] .v-table {
  font-size: 13px;
}
[data-collection="seo"] .v-table td {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
[data-collection="seo"] .v-table td:hover {
  overflow: visible;
  white-space: normal;
  word-break: break-word;
}
`;

    await fetch(`${DIRECTUS_URL}/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ custom_css: css }),
    });
    console.log('  CSS updated');

    console.log('Done!');
    console.log('  Note: Directus no soporta enlaces clicables en la vista de lista sin extensiones compiladas.');
    console.log('  La nota de coleccion muestra la URL del dashboard en /admin/content/seo');
}

main().catch(console.error);
