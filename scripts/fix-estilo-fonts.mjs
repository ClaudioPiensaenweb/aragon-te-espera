const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

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
    // Font titles and font body already at half width, just ensure sort
    console.log('Updating font fields...');
    await updateField('font_titles', { sort: 2, width: 'half', group: 'group_typography' });
    await updateField('font_body', { sort: 3, width: 'half', group: 'group_typography' });

    // Create divider before font_size_body
    console.log('Adding texto base group...');
    await createField({
        field: 'lbl_texto_base',
        type: 'alias',
        meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'texto-base' }, sort: 30, group: 'group_typography' }
    });

    // Move font_size_body after the divider
    await updateField('font_size_body', { sort: 31, width: 'half', group: 'group_typography' });

    console.log('Done!');
}

main().catch(console.error);
