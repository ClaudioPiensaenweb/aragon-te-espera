const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function updateField(field, meta) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${field}`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ meta }),
    });
    if (res.ok) console.log(`  Updated: ${field}`);
    else console.error(`  Error ${field}: ${await res.text()}`);
}

async function main() {
    const titles = ['titulo_hero', 'titulo_1', 'titulo_2', 'titulo_3', 'titulo_4'];
    const suffixes = ['dk', 'tb', 'mh', 'mv'];
    const notes = { dk: 'Desktop', tb: 'Tablet', mh: 'Mobile H', mv: 'Mobile V' };

    for (const title of titles) {
        for (const s of suffixes) {
            await updateField(`${title}_${s}`, { width: 'quarter', note: notes[s] + ' (px)' });
        }
    }
    console.log('Done!');
}

main().catch(console.error);
