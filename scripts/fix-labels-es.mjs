const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function updateCollection(collection, meta) {
    const res = await fetch(`${DIRECTUS_URL}/collections/${collection}`, { method: 'PATCH', headers, body: JSON.stringify({ meta }) });
    console.log(res.ok ? `Collection ${collection}: OK` : `Collection ${collection}: Error`);
}

async function updateField(collection, field, data) {
    const res = await fetch(`${DIRECTUS_URL}/fields/${collection}/${field}`, { method: 'PATCH', headers, body: JSON.stringify(data) });
    console.log(res.ok ? `  ${collection}.${field}: OK` : `  ${collection}.${field}: Error`);
}

async function main() {
    // ===== COLLECTIONS =====
    console.log('Renaming collections...');
    await updateCollection('categories', { note: 'Categorías del blog' });
    await updateCollection('posts', { note: 'Entradas del blog' });
    await updateCollection('posts_categories', { note: 'Relación entradas-categorías' });
    await updateCollection('empresa', { note: 'Datos de la empresa (legales, contacto)' });
    await updateCollection('estilo', { note: 'Configuración visual del sitio' });

    // ===== CATEGORIES =====
    console.log('Translating categories fields...');
    await updateField('categories', 'name', { meta: { note: 'Nombre de la categoría' } });
    await updateField('categories', 'slug', { meta: { note: 'URL amigable' } });

    // ===== POSTS =====
    console.log('Translating posts fields...');
    await updateField('posts', 'status', { meta: { note: 'Estado de publicación', options: { choices: [{ text: 'Publicado', value: 'published' }, { text: 'Borrador', value: 'draft' }] } } });
    await updateField('posts', 'title', { meta: { note: 'Título de la entrada' } });
    await updateField('posts', 'slug', { meta: { note: 'URL amigable (se genera del título)' } });
    await updateField('posts', 'date_published', { meta: { note: 'Fecha de publicación' } });
    await updateField('posts', 'featured_image', { meta: { note: 'Imagen destacada' } });
    await updateField('posts', 'content', { meta: { note: 'Contenido del artículo (WYSIWYG)' } });
    await updateField('posts', 'language', { meta: { note: 'Idioma', options: { choices: [{ text: 'Español', value: 'es' }, { text: 'Inglés', value: 'en' }] } } });
    await updateField('posts', 'categories', { meta: { note: 'Categorías' } });
    await updateField('posts', 'translation_group', { meta: { note: 'Grupo de traducción (mismo valor para entradas equivalentes ES/EN)' } });

    // ===== EMPRESA =====
    console.log('Translating empresa fields...');
    await updateField('empresa', 'nombre_empresa', { meta: { note: 'Nombre comercial' } });
    await updateField('empresa', 'razon_social', { meta: { note: 'Razón social completa' } });
    await updateField('empresa', 'cif', { meta: { note: 'CIF / NIF' } });
    await updateField('empresa', 'direccion_fiscal', { meta: { note: 'Dirección fiscal' } });
    await updateField('empresa', 'provincia', { meta: { note: 'Provincia' } });
    await updateField('empresa', 'telefono', { meta: { note: 'Teléfono de contacto' } });
    await updateField('empresa', 'correo_electronico', { meta: { note: 'Correo electrónico' } });
    await updateField('empresa', 'dominio', { meta: { note: 'Dominio web' } });
    await updateField('empresa', 'enlace_google_maps', { meta: { note: 'Enlace a Google Maps' } });
    await updateField('empresa', 'kit_digital', { meta: { note: 'Muestra el banner de Kit Digital en el footer', options: { label: 'Kit Digital' } } });

    // ===== ESTILO =====
    console.log('Translating estilo fields...');

    // Typography group
    await updateField('estilo', 'group_typography', { meta: { options: { start: 'closed', headerIcon: 'text_fields', headerColor: null }, note: null },
        schema: null, type: 'alias' });
    await updateField('estilo', 'font_titles', { meta: { note: 'Tipografía para títulos' } });
    await updateField('estilo', 'font_body', { meta: { note: 'Tipografía para textos' } });
    await updateField('estilo', 'font_size_body', { meta: { note: 'Tamaño del texto base (px)' } });

    // Title size labels
    const titleLabels = {
        'lbl_titulo_hero': 'titulo-hero',
        'lbl_titulo_1': 'titulo-1',
        'lbl_titulo_2': 'titulo-2',
        'lbl_titulo_3': 'titulo-3',
        'lbl_titulo_4': 'titulo-4',
        'lbl_texto_base': 'texto-base',
    };
    for (const [field, title] of Object.entries(titleLabels)) {
        await updateField('estilo', field, { meta: { options: { title } } });
    }

    // Title sizes - notes
    const sizeNotes = { dk: 'Escritorio (px)', tb: 'Tablet (px)', mh: 'Móvil horizontal (px)', mv: 'Móvil vertical (px)' };
    for (const t of ['titulo_hero', 'titulo_1', 'titulo_2', 'titulo_3', 'titulo_4']) {
        for (const [s, note] of Object.entries(sizeNotes)) {
            await updateField('estilo', `${t}_${s}`, { meta: { note } });
        }
    }

    // Colors group
    await updateField('estilo', 'group_colors', { meta: { options: { start: 'closed' }, note: null } });
    await updateField('estilo', 'color_primary', { meta: { note: 'Color primario' } });
    await updateField('estilo', 'color_primary_hover', { meta: { note: 'Color primario (hover)' } });
    await updateField('estilo', 'color_title', { meta: { note: 'Color de títulos' } });
    await updateField('estilo', 'color_text', { meta: { note: 'Color de textos' } });
    await updateField('estilo', 'color_bg_body', { meta: { note: 'Fondo del cuerpo' } });
    await updateField('estilo', 'color_bg_section_alt', { meta: { note: 'Fondo de secciones alternas' } });
    await updateField('estilo', 'color_footer_bg', { meta: { note: 'Fondo del pie de página' } });

    // Buttons group
    await updateField('estilo', 'group_buttons', { meta: { options: { start: 'closed' }, note: null } });
    await updateField('estilo', 'btn_border_radius', { meta: { note: 'Radio de bordes (px). 50 = píldora, 0 = cuadrado' } });
    await updateField('estilo', 'btn_uppercase', { meta: { note: 'Texto en mayúsculas', options: { label: 'Mayúsculas' } } });
    await updateField('estilo', 'btn_font_size', { meta: { note: 'Tamaño de fuente (px)' } });
    await updateField('estilo', 'btn_padding_y', { meta: { note: 'Relleno vertical (px)' } });
    await updateField('estilo', 'btn_padding_x', { meta: { note: 'Relleno horizontal (px)' } });
    await updateField('estilo', 'btn_border_width', { meta: { note: 'Ancho del borde (px)' } });
    await updateField('estilo', 'btn_custom_colors', { meta: { note: 'Activar para personalizar los colores de los botones', options: { label: 'Colores personalizados' } } });

    // Button color fields
    await updateField('estilo', 'btn_filled_bg', { meta: { note: 'Color de fondo' } });
    await updateField('estilo', 'btn_filled_text', { meta: { note: 'Color de texto' } });
    await updateField('estilo', 'btn_filled_bg_hover', { meta: { note: 'Fondo al pasar el ratón' } });
    await updateField('estilo', 'btn_outline_border', { meta: { note: 'Color del borde' } });
    await updateField('estilo', 'btn_outline_text', { meta: { note: 'Color de texto' } });
    await updateField('estilo', 'btn_outline_bg_hover', { meta: { note: 'Fondo al pasar el ratón' } });
    await updateField('estilo', 'btn_outline_text_hover', { meta: { note: 'Texto al pasar el ratón' } });

    // Button dividers
    await updateField('estilo', 'divider_btn_filled', { meta: { options: { title: 'Botón relleno' } } });
    await updateField('estilo', 'divider_btn_outline', { meta: { options: { title: 'Botón contorno' } } });

    console.log('Done!');
}

main().catch(console.error);
