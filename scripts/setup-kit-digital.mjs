const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // Check if field already exists
    const check = await fetch(`${DIRECTUS_URL}/fields/empresa/kit_digital`, { headers });
    if (check.ok) {
        console.log('Field kit_digital already exists, skipping.');
        return;
    }

    console.log('Creating kit_digital field in empresa...');
    const res = await fetch(`${DIRECTUS_URL}/fields/empresa`, {
        method: 'POST', headers,
        body: JSON.stringify({
            field: 'kit_digital',
            type: 'boolean',
            meta: {
                interface: 'boolean',
                width: 'half',
                note: 'Muestra el banner de Kit Digital en el footer',
                options: { label: 'Kit Digital' },
                translations: [{ language: 'es-ES', translation: 'Kit Digital' }],
            },
            schema: { default_value: false },
        }),
    });

    if (res.ok) {
        console.log('  Field kit_digital created.');
    } else {
        console.error('  Error:', await res.text());
    }
}

main().catch(console.error);
