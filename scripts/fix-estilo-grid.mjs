const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function deleteField(name) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'DELETE', headers });
    if (res.ok) console.log(`  Deleted: ${name}`);
}

async function updateField(name, meta) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'PATCH', headers, body: JSON.stringify({ meta }) });
    if (res.ok) console.log(`  Updated: ${name}`);
    else console.error(`  Error ${name}: ${await res.text()}`);
}

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo`, { method: 'POST', headers, body: JSON.stringify(field) });
    if (res.ok) console.log(`  Created: ${field.field}`);
    else {
        const t = await res.text();
        if (t.includes('already')) console.log(`  Exists: ${field.field}`);
        else console.error(`  Error: ${t}`);
    }
}

async function main() {
    const titles = [
        { name: 'titulo_hero', label: 'titulo-hero', sort: 4 },
        { name: 'titulo_1', label: 'titulo-1', sort: 10 },
        { name: 'titulo_2', label: 'titulo-2', sort: 16 },
        { name: 'titulo_3', label: 'titulo-3', sort: 22 },
        { name: 'titulo_4', label: 'titulo-4', sort: 28 },
    ];

    // Delete old dividers
    console.log('Deleting old dividers...');
    for (const t of titles) {
        await deleteField('div_' + t.name);
    }

    // Create a sub-group for each title level using group-raw (inline grid)
    for (const t of titles) {
        const groupField = 'grp_' + t.name;

        console.log(`Setting up ${t.label}...`);

        // Create sub-group inside group_typography
        await createField({
            field: groupField,
            type: 'alias',
            meta: {
                interface: 'group-raw',
                special: ['alias', 'no-data', 'group'],
                sort: t.sort,
                group: 'group_typography',
                options: {},
                note: t.label
            }
        });

        // Move the 4 size fields into this sub-group, all as half width
        const suffixes = [
            { s: 'dk', note: 'Desktop (px)', sort: t.sort + 1 },
            { s: 'tb', note: 'Tablet (px)', sort: t.sort + 2 },
            { s: 'mh', note: 'Mobile H (px)', sort: t.sort + 3 },
            { s: 'mv', note: 'Mobile V (px)', sort: t.sort + 4 },
        ];

        for (const sf of suffixes) {
            await updateField(`${t.name}_${sf.s}`, {
                group: groupField,
                sort: sf.sort,
                width: 'half',
                note: sf.note
            });
        }
    }

    console.log('Done!');
}

main().catch(console.error);
