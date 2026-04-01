const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function deleteField(name) {
    await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'DELETE', headers });
    console.log(`  Deleted: ${name}`);
}

async function updateField(name, meta) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'PATCH', headers, body: JSON.stringify({ meta }) });
    console.log(res.ok ? `  Updated: ${name}` : `  Error: ${name}`);
}

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo`, { method: 'POST', headers, body: JSON.stringify(field) });
    const t = await res.text();
    console.log(res.ok ? `  Created: ${field.field}` : (t.includes('already') ? `  Exists: ${field.field}` : `  Error: ${t}`));
}

async function main() {
    // 1. Move fields out of sub-groups back to group_typography
    console.log('Moving fields back to group_typography...');
    const titles = ['titulo_hero', 'titulo_1', 'titulo_2', 'titulo_3', 'titulo_4'];
    const suffixes = ['dk', 'tb', 'mh', 'mv'];
    let sort = 4;

    for (const t of titles) {
        // Create a divider for this title
        await createField({
            field: 'lbl_' + t,
            type: 'alias',
            meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: t.replace('_', '-') }, sort: sort++, group: 'group_typography' }
        });

        for (const s of suffixes) {
            const noteMap = { dk: 'Desktop', tb: 'Tablet', mh: 'Mobile H', mv: 'Mobile V' };
            await updateField(`${t}_${s}`, {
                group: 'group_typography',
                sort: sort++,
                width: 'half',
                note: noteMap[s] + ' (px)'
            });
        }
    }

    // 2. Delete old sub-groups
    console.log('Deleting sub-groups...');
    for (const t of titles) {
        await deleteField('grp_' + t);
    }

    // 3. Inject clean CSS - only target the titulo fields by their data-field attribute
    console.log('Injecting clean CSS...');
    const tituloSelectors = titles.flatMap(t =>
        suffixes.map(s => `[data-field="${t}_${s}"]`)
    );

    const css = `
/* 4-column layout for titulo size fields in Estilo */
/* Target the parent grid to make titulo fields sit in 4-col rows */
${tituloSelectors.join(',\n')} {
  grid-column: span 1 !important;
  min-width: 0 !important;
}
`;

    await fetch(`${DIRECTUS_URL}/settings`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ custom_css: css }),
    });

    console.log('Done!');
}

main().catch(console.error);
