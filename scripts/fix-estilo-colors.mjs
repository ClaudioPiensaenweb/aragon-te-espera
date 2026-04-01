const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function deleteField(name) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'DELETE', headers });
    console.log(res.ok ? `  Deleted: ${name}` : `  Skip: ${name}`);
}

async function updateField(name, meta) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo/${name}`, { method: 'PATCH', headers, body: JSON.stringify({ meta }) });
    console.log(res.ok ? `  Updated: ${name}` : `  Error: ${name}`);
}

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo`, { method: 'POST', headers, body: JSON.stringify(field) });
    const t = await res.text();
    console.log(res.ok ? `  Created: ${field.field}` : (t.includes('already') ? `  Exists: ${field.field}` : `  Error: ${field.field}: ${t}`));
}

async function main() {
    // 1. Delete duplicated color fields
    console.log('Removing duplicate colors...');
    await deleteField('color_accent_warm1');  // same as color_primary_hover
    await deleteField('color_accent_warm2');  // same as color_primary
    await deleteField('color_accent_cold1');  // same as color_title
    await deleteField('divider_bg_text');     // no longer needed as separate section

    // 2. Move all color fields into group_colors without sub-dividers, reorder
    console.log('Reordering color fields...');
    await updateField('color_primary', { sort: 41, group: 'group_colors', width: 'half', note: 'Color primario' });
    await updateField('color_primary_hover', { sort: 42, group: 'group_colors', width: 'half', note: 'Color primario (hover)' });
    await updateField('color_title', { sort: 43, group: 'group_colors', width: 'half', note: 'Color de títulos' });
    await updateField('color_text', { sort: 44, group: 'group_colors', width: 'half', note: 'Color de textos' });
    await updateField('color_bg_body', { sort: 45, group: 'group_colors', width: 'half', note: 'Fondo del body' });
    await updateField('color_bg_section_alt', { sort: 46, group: 'group_colors', width: 'half', note: 'Fondo secciones alternas' });
    await updateField('color_footer_bg', { sort: 47, group: 'group_colors', width: 'half', note: 'Fondo del footer' });

    // 3. Add btn_custom_colors toggle
    console.log('Adding button custom colors toggle...');
    await createField({
        field: 'btn_custom_colors',
        type: 'boolean',
        meta: {
            interface: 'boolean',
            width: 'full',
            sort: 76,
            group: 'group_buttons',
            note: 'Activar para usar colores personalizados en lugar de los colores globales (Primary / Primary Hover)',
            options: { label: 'Colores personalizados' }
        },
        schema: { default_value: false }
    });

    // Initialize value
    await fetch(`${DIRECTUS_URL}/items/estilo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ btn_custom_colors: false })
    });

    // 4. Add conditions to button color fields: only show when btn_custom_colors is true
    const btnColorFields = [
        'divider_btn_filled', 'btn_filled_bg', 'btn_filled_text', 'btn_filled_bg_hover',
        'divider_btn_outline', 'btn_outline_border', 'btn_outline_text', 'btn_outline_bg_hover', 'btn_outline_text_hover'
    ];

    const condition = [{
        name: 'Show when custom',
        rule: { _and: [{ btn_custom_colors: { _eq: true } }] },
        hidden: false
    }];

    const conditionHide = [{
        name: 'Hide when global',
        rule: { _and: [{ btn_custom_colors: { _eq: false } }] },
        hidden: true
    }];

    console.log('Setting conditions on button color fields...');
    for (const f of btnColorFields) {
        await updateField(f, { conditions: conditionHide });
    }

    console.log('Done!');
}

main().catch(console.error);
