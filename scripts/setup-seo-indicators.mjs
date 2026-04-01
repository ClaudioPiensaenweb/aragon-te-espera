const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // Add custom CSS for RankMath-style SEO indicators in Directus admin
    console.log('Adding SEO indicator styles...');

    // Get current custom CSS
    const settingsRes = await fetch(`${DIRECTUS_URL}/settings`, { headers });
    const settings = await settingsRes.json();
    const existingCss = settings.data.custom_css || '';

    const seoCss = `

/* SEO RankMath-style indicators */
/* Color-code SEO fields based on content length and presence */
[data-collection="seo"] .field[data-field="meta_title"] .v-input input {
  border-left: 4px solid #ccc;
  transition: border-color 0.3s;
}
[data-collection="seo"] .field[data-field="meta_description"] .v-textarea textarea {
  border-left: 4px solid #ccc;
  transition: border-color 0.3s;
}
[data-collection="seo"] .field[data-field="keyword"] .v-input input {
  border-left: 4px solid #ccc;
}

/* Layout: group type and language on same row */
[data-collection="seo"] .v-form.grid {
  grid-template-columns: repeat(2, 1fr);
}
[data-collection="seo"] .v-form.grid > .field.full {
  grid-column: 1 / -1;
}

/* SEO score notice styling */
[data-collection="seo"] .field[data-field="seo_score"] {
  grid-column: 1 / -1;
}
`;

    await fetch(`${DIRECTUS_URL}/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ custom_css: existingCss + seoCss }),
    });

    // Update collection layout to show as table with page_type grouping
    console.log('Configuring SEO collection layout...');
    await fetch(`${DIRECTUS_URL}/collections/seo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({
            meta: {
                archive_field: null,
                sort_field: 'sort',
                group: null,
                collapse: 'open',
            }
        })
    });

    // Add display templates
    console.log('Setting field display options...');
    // page_type display as badge
    await fetch(`${DIRECTUS_URL}/fields/seo/page_type`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ meta: { display: 'labels', display_options: { choices: [{ text: 'Página', value: 'page', foreground: '#fff', background: '#0081CE' }, { text: 'Noticia', value: 'post', foreground: '#fff', background: '#FF6800' }] } } })
    });

    // language display as badge
    await fetch(`${DIRECTUS_URL}/fields/seo/language`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ meta: { display: 'labels', display_options: { choices: [{ text: 'ES', value: 'es', foreground: '#fff', background: '#001630' }, { text: 'EN', value: 'en', foreground: '#fff', background: '#003C64' }] } } })
    });

    console.log('Done!');
}

main().catch(console.error);
