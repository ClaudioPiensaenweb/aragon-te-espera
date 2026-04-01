const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function createField(field) {
    const res = await fetch(`${DIRECTUS_URL}/fields/estilo`, {
        method: 'POST', headers,
        body: JSON.stringify(field),
    });
    if (res.ok) console.log(`  Field: ${field.field}`);
    else console.error(`  Error ${field.field}: ${await res.text()}`);
}

async function main() {
    console.log('Creating estilo fields...');

    // ===== TYPOGRAPHY GROUP =====
    await createField({ field: 'group_typography', type: 'alias', meta: { interface: 'group-detail', special: ['alias','no-data','group'], options: { start: 'open' }, sort: 1, note: 'Tipografías del sitio' } });

    await createField({ field: 'font_titles', type: 'string', meta: { interface: 'input', width: 'half', sort: 2, group: 'group_typography', note: 'Google Font para títulos (ej: Newsreader)' }, schema: { default_value: 'Newsreader' } });
    await createField({ field: 'font_body', type: 'string', meta: { interface: 'input', width: 'half', sort: 3, group: 'group_typography', note: 'Google Font para textos (ej: Plus Jakarta Sans)' }, schema: { default_value: 'Plus Jakarta Sans' } });

    // Title sizes - Desktop
    await createField({ field: 'divider_sizes_dk', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Tamaños Desktop (992px+)', icon: 'desktop_windows' }, sort: 4, group: 'group_typography' } });
    for (const [i, [name, val]] of [['titulo_hero_dk','60'],['titulo_1_dk','48'],['titulo_2_dk','40'],['titulo_3_dk','27'],['titulo_4_dk','21']].entries()) {
        await createField({ field: name, type: 'integer', meta: { interface: 'input', width: 'half', sort: 5+i, group: 'group_typography', note: `px` }, schema: { default_value: parseInt(val) } });
    }

    // Title sizes - Tablet
    await createField({ field: 'divider_sizes_tb', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Tamaños Tablet (768px)', icon: 'tablet' }, sort: 11, group: 'group_typography' } });
    for (const [i, [name, val]] of [['titulo_hero_tb','50'],['titulo_1_tb','40'],['titulo_2_tb','34'],['titulo_3_tb','24'],['titulo_4_tb','20']].entries()) {
        await createField({ field: name, type: 'integer', meta: { interface: 'input', width: 'half', sort: 12+i, group: 'group_typography', note: `px` }, schema: { default_value: parseInt(val) } });
    }

    // Title sizes - Mobile Horizontal
    await createField({ field: 'divider_sizes_mh', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Tamaños Mobile Horizontal (479px)', icon: 'smartphone' }, sort: 18, group: 'group_typography' } });
    for (const [i, [name, val]] of [['titulo_hero_mh','46'],['titulo_1_mh','38'],['titulo_2_mh','30'],['titulo_3_mh','23'],['titulo_4_mh','19']].entries()) {
        await createField({ field: name, type: 'integer', meta: { interface: 'input', width: 'half', sort: 19+i, group: 'group_typography', note: `px` }, schema: { default_value: parseInt(val) } });
    }

    // Title sizes - Mobile Vertical
    await createField({ field: 'divider_sizes_mv', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Tamaños Mobile Vertical (base)', icon: 'phone_android' }, sort: 25, group: 'group_typography' } });
    for (const [i, [name, val]] of [['titulo_hero_mv','42'],['titulo_1_mv','34'],['titulo_2_mv','28'],['titulo_3_mv','22'],['titulo_4_mv','18']].entries()) {
        await createField({ field: name, type: 'integer', meta: { interface: 'input', width: 'half', sort: 26+i, group: 'group_typography', note: `px` }, schema: { default_value: parseInt(val) } });
    }

    await createField({ field: 'font_size_body', type: 'integer', meta: { interface: 'input', width: 'half', sort: 32, group: 'group_typography', note: 'Tamaño texto base (px)' }, schema: { default_value: 16 } });

    // ===== COLORS GROUP =====
    await createField({ field: 'group_colors', type: 'alias', meta: { interface: 'group-detail', special: ['alias','no-data','group'], options: { start: 'open' }, sort: 40, note: 'Paleta de colores' } });

    await createField({ field: 'divider_accent', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Colores de acento' }, sort: 41, group: 'group_colors' } });
    for (const [i, [name, val, note]] of [
        ['color_primary','#FF6800','Primario (botones, enlaces)'],
        ['color_primary_hover','#FF3E00','Primario hover'],
        ['color_accent_warm1','#FF3E00','Acento cálido 1'],
        ['color_accent_warm2','#FF6800','Acento cálido 2'],
        ['color_accent_warm3','#FFA000','Acento cálido 3'],
        ['color_accent_warm4','#FFCC00','Acento cálido 4'],
        ['color_accent_cold1','#001630','Acento frío 1 (oscuro)'],
        ['color_accent_cold2','#003C64','Acento frío 2'],
        ['color_accent_cold3','#0081CE','Acento frío 3'],
        ['color_accent_cold4','#36D1F4','Acento frío 4'],
    ].entries()) {
        await createField({ field: name, type: 'string', meta: { interface: 'select-color', width: 'half', sort: 42+i, group: 'group_colors', note }, schema: { default_value: val } });
    }

    await createField({ field: 'divider_bg_text', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Fondos y textos' }, sort: 55, group: 'group_colors' } });
    for (const [i, [name, val, note]] of [
        ['color_bg_body','#FFFFFF','Fondo del body'],
        ['color_bg_section_alt','#F8F9FA','Fondo secciones alternas'],
        ['color_title','#001630','Color de títulos'],
        ['color_text','#2F3B4A','Color de textos'],
        ['color_footer_bg','#001630','Fondo del footer'],
    ].entries()) {
        await createField({ field: name, type: 'string', meta: { interface: 'select-color', width: 'half', sort: 56+i, group: 'group_colors', note }, schema: { default_value: val } });
    }

    // ===== BUTTONS GROUP =====
    await createField({ field: 'group_buttons', type: 'alias', meta: { interface: 'group-detail', special: ['alias','no-data','group'], options: { start: 'open' }, sort: 70, note: 'Estilos de botones' } });

    await createField({ field: 'btn_border_radius', type: 'integer', meta: { interface: 'input', width: 'half', sort: 71, group: 'group_buttons', note: 'Border radius (px). 50 = pill, 0 = cuadrado' }, schema: { default_value: 50 } });
    await createField({ field: 'btn_uppercase', type: 'boolean', meta: { interface: 'boolean', width: 'half', sort: 72, group: 'group_buttons', note: 'Texto en mayúsculas' }, schema: { default_value: false } });
    await createField({ field: 'btn_font_size', type: 'integer', meta: { interface: 'input', width: 'half', sort: 73, group: 'group_buttons', note: 'Tamaño de fuente (px)' }, schema: { default_value: 16 } });
    await createField({ field: 'btn_padding_y', type: 'integer', meta: { interface: 'input', width: 'half', sort: 74, group: 'group_buttons', note: 'Padding vertical (px)' }, schema: { default_value: 12 } });
    await createField({ field: 'btn_padding_x', type: 'integer', meta: { interface: 'input', width: 'half', sort: 75, group: 'group_buttons', note: 'Padding horizontal (px)' }, schema: { default_value: 25 } });

    await createField({ field: 'divider_btn_filled', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Botón relleno' }, sort: 76, group: 'group_buttons' } });
    await createField({ field: 'btn_filled_bg', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 77, group: 'group_buttons', note: 'Color de fondo' }, schema: { default_value: '#FF6800' } });
    await createField({ field: 'btn_filled_text', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 78, group: 'group_buttons', note: 'Color de texto' }, schema: { default_value: '#FFFFFF' } });
    await createField({ field: 'btn_filled_bg_hover', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 79, group: 'group_buttons', note: 'Fondo hover' }, schema: { default_value: '#FF3E00' } });

    await createField({ field: 'divider_btn_outline', type: 'alias', meta: { interface: 'presentation-divider', special: ['alias','no-data'], options: { title: 'Botón outline' }, sort: 80, group: 'group_buttons' } });
    await createField({ field: 'btn_outline_border', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 81, group: 'group_buttons', note: 'Color de borde' }, schema: { default_value: '#FF6800' } });
    await createField({ field: 'btn_outline_text', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 82, group: 'group_buttons', note: 'Color de texto' }, schema: { default_value: '#FF6800' } });
    await createField({ field: 'btn_outline_bg_hover', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 83, group: 'group_buttons', note: 'Fondo hover' }, schema: { default_value: '#FF6800' } });
    await createField({ field: 'btn_outline_text_hover', type: 'string', meta: { interface: 'select-color', width: 'half', sort: 84, group: 'group_buttons', note: 'Texto hover' }, schema: { default_value: '#FFFFFF' } });

    // Initialize singleton data
    console.log('Initializing estilo data...');
    await fetch(`${DIRECTUS_URL}/items/estilo`, { method: 'PATCH', headers, body: JSON.stringify({ id: 1 }) });

    // Set public read permission
    console.log('Setting public permission...');
    const policiesRes = await fetch(`${DIRECTUS_URL}/policies`, { headers });
    const policiesData = await policiesRes.json();
    const publicPolicy = policiesData.data.find(p => p.icon === 'public');
    if (publicPolicy) {
        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST', headers,
            body: JSON.stringify({ policy: publicPolicy.id, collection: 'estilo', action: 'read', fields: ['*'], permissions: {}, validation: null }),
        });
    }

    console.log('Done!');
}

main().catch(console.error);
