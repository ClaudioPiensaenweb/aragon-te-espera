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

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo`, {
        method: 'POST', headers,
        body: JSON.stringify(field),
    });
    if (res.ok) console.log(`  Created: ${field.field}`);
    else {
        const t = await res.text();
        if (t.includes('already exists')) console.log(`  Exists: ${field.field}`);
        else console.error(`  Error ${field.field}: ${t}`);
    }
}

async function main() {
    // 1. Rename groups (remove "Group" word) and set collapsed
    console.log('Updating groups...');
    await updateField('group_typography', { options: { start: 'closed' }, note: null });
    await updateField('group_colors', { options: { start: 'closed' }, note: null });
    await updateField('group_buttons', { options: { start: 'closed' }, note: null });

    // 2. Rename group labels via display name (translations aren't easy, use note)
    // Actually, the group name is the field name. Let me update the interface options title
    // Groups in Directus use the field name as label. We need to rename the fields.
    // Since we can't rename fields easily, we'll update the "note" to act as display

    // 3. Reorganize typography - group each title level with 4 breakpoints
    // Remove old dividers and create new ones per title level
    console.log('Reorganizing typography fields...');

    // Delete old dividers
    for (const d of ['divider_sizes_dk','divider_sizes_tb','divider_sizes_mh','divider_sizes_mv']) {
        await fetch(`${DIRECTUS_URL}/fields/estilo/${d}`, { method: 'DELETE', headers });
        console.log(`  Deleted: ${d}`);
    }

    // Reorder: each title with its 4 sizes in a row
    const titleOrder = [
        ['titulo_hero', 4], ['titulo_hero_dk',5], ['titulo_hero_tb',6], ['titulo_hero_mh',7], ['titulo_hero_mv',8],
        ['titulo_1', 9], ['titulo_1_dk',10], ['titulo_1_tb',11], ['titulo_1_mh',12], ['titulo_1_mv',13],
        ['titulo_2', 14], ['titulo_2_dk',15], ['titulo_2_tb',16], ['titulo_2_mh',17], ['titulo_2_mv',18],
        ['titulo_3', 19], ['titulo_3_dk',20], ['titulo_3_tb',21], ['titulo_3_mh',22], ['titulo_3_mv',23],
        ['titulo_4', 24], ['titulo_4_dk',25], ['titulo_4_tb',26], ['titulo_4_mh',27], ['titulo_4_mv',28],
    ];

    // Create dividers for each title level
    for (const [label, sort] of [['titulo-hero',4],['titulo-1',9],['titulo-2',14],['titulo-3',19],['titulo-4',24]]) {
        await createField({
            field: 'div_' + label.replace('-','_'),
            type: 'alias',
            meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: label }, sort, group: 'group_typography' }
        });
    }

    // Update each size field: width quarter, proper note, proper sort
    for (const [name, sort] of titleOrder) {
        if (name.startsWith('div_')) continue;
        // Only update the breakpoint fields (those with _dk, _tb, _mh, _mv suffix)
        const suffix = name.split('_').pop();
        const noteMap = { dk: 'Desktop', tb: 'Tablet', mh: 'Mobile H', mv: 'Mobile V' };
        if (noteMap[suffix]) {
            await updateField(name, { sort, width: 'half', note: noteMap[suffix] + ' (px)', group: 'group_typography' });
        }
    }

    // 4. Remove unused colors, keep only ones in use
    console.log('Cleaning up colors...');
    const unusedColors = ['color_accent_warm3','color_accent_warm4','color_accent_cold2','color_accent_cold3','color_accent_cold4'];
    for (const c of unusedColors) {
        await fetch(`${DIRECTUS_URL}/fields/estilo/${c}`, { method: 'DELETE', headers });
        console.log(`  Deleted unused: ${c}`);
    }

    // Remove the accent divider since we simplified
    await fetch(`${DIRECTUS_URL}/fields/estilo/divider_accent`, { method: 'DELETE', headers });

    // 5. Add button border width
    console.log('Adding button border width...');
    await createField({
        field: 'btn_border_width',
        type: 'integer',
        meta: { interface: 'input', width: 'half', sort: 75, group: 'group_buttons', note: 'Ancho de borde (px)' },
        schema: { default_value: 1 }
    });

    // Initialize the new field value
    await fetch(`${DIRECTUS_URL}/items/estilo`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ btn_border_width: 1 })
    });

    // 6. Update font fields to use a proper dropdown
    // We'll set the interface to select-dropdown with Google Fonts choices
    console.log('Updating font selectors...');
    const popularFonts = [
        'Newsreader','Plus Jakarta Sans','Inter','Roboto','Open Sans','Lato','Montserrat','Poppins',
        'Raleway','Playfair Display','Merriweather','Source Sans 3','Nunito','Work Sans','DM Sans',
        'Outfit','Manrope','Space Grotesk','Sora','Figtree','Geist','Bricolage Grotesque',
        'Cormorant Garamond','Libre Baskerville','Lora','Crimson Text','EB Garamond','Bitter',
        'Noto Serif','Spectral','Source Serif 4','Vollkorn','Josefin Sans','Cabin','Karla',
        'Rubik','Barlow','Mulish','Quicksand','Archivo','Red Hat Display','Albert Sans',
        'General Sans','Instrument Sans','Satoshi','Clash Display','Fraunces','Cabinet Grotesk',
        'Oswald','Bebas Neue','Anton','Abril Fatface','Righteous','Pacifico'
    ];
    const fontChoices = popularFonts.map(f => ({ text: f, value: f }));

    await updateField('font_titles', {
        interface: 'select-dropdown',
        options: { choices: fontChoices, allowOther: true },
        note: 'Tipografía para títulos'
    });
    await updateField('font_body', {
        interface: 'select-dropdown',
        options: { choices: fontChoices, allowOther: true },
        note: 'Tipografía para textos'
    });

    console.log('Done!');
}

main().catch(console.error);
