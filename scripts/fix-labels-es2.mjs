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
    // Rename collections with translations
    console.log('Renaming collections...');
    await updateCollection('posts', { translations: [{ language: 'es-ES', translation: 'Noticias', singular: 'Noticia', plural: 'Noticias' }] });
    await updateCollection('categories', { translations: [{ language: 'es-ES', translation: 'Categorías', singular: 'Categoría', plural: 'Categorías' }] });
    await updateCollection('posts_categories', { translations: [{ language: 'es-ES', translation: 'Noticias - Categorías' }] });

    // Translate posts field labels
    console.log('Translating posts field labels...');
    await updateField('posts', 'status', { meta: { translations: [{ language: 'es-ES', translation: 'Estado' }] } });
    await updateField('posts', 'title', { meta: { translations: [{ language: 'es-ES', translation: 'Título' }] } });
    await updateField('posts', 'slug', { meta: { translations: [{ language: 'es-ES', translation: 'Slug' }] } });
    await updateField('posts', 'date_published', { meta: { translations: [{ language: 'es-ES', translation: 'Fecha de publicación' }] } });
    await updateField('posts', 'featured_image', { meta: { translations: [{ language: 'es-ES', translation: 'Imagen destacada' }] } });
    await updateField('posts', 'content', { meta: { translations: [{ language: 'es-ES', translation: 'Contenido' }] } });
    await updateField('posts', 'language', { meta: { translations: [{ language: 'es-ES', translation: 'Idioma' }] } });
    await updateField('posts', 'categories', { meta: { translations: [{ language: 'es-ES', translation: 'Categorías' }] } });
    await updateField('posts', 'translation_group', { meta: { translations: [{ language: 'es-ES', translation: 'Grupo de traducción' }] } });
    await updateField('posts', 'sort', { meta: { translations: [{ language: 'es-ES', translation: 'Orden' }] } });

    // Translate categories field labels
    console.log('Translating categories field labels...');
    await updateField('categories', 'name', { meta: { translations: [{ language: 'es-ES', translation: 'Nombre' }] } });
    await updateField('categories', 'slug', { meta: { translations: [{ language: 'es-ES', translation: 'Slug' }] } });
    await updateField('categories', 'sort', { meta: { translations: [{ language: 'es-ES', translation: 'Orden' }] } });

    // Translate empresa field labels
    console.log('Translating empresa field labels...');
    await updateField('empresa', 'nombre_empresa', { meta: { translations: [{ language: 'es-ES', translation: 'Nombre empresa' }] } });
    await updateField('empresa', 'razon_social', { meta: { translations: [{ language: 'es-ES', translation: 'Razón social' }] } });
    await updateField('empresa', 'cif', { meta: { translations: [{ language: 'es-ES', translation: 'CIF' }] } });
    await updateField('empresa', 'direccion_fiscal', { meta: { translations: [{ language: 'es-ES', translation: 'Dirección fiscal' }] } });
    await updateField('empresa', 'provincia', { meta: { translations: [{ language: 'es-ES', translation: 'Provincia' }] } });
    await updateField('empresa', 'telefono', { meta: { translations: [{ language: 'es-ES', translation: 'Teléfono' }] } });
    await updateField('empresa', 'correo_electronico', { meta: { translations: [{ language: 'es-ES', translation: 'Correo electrónico' }] } });
    await updateField('empresa', 'dominio', { meta: { translations: [{ language: 'es-ES', translation: 'Dominio' }] } });
    await updateField('empresa', 'enlace_google_maps', { meta: { translations: [{ language: 'es-ES', translation: 'Enlace Google Maps' }] } });
    await updateField('empresa', 'kit_digital', { meta: { translations: [{ language: 'es-ES', translation: 'Kit Digital' }] } });

    // Translate estilo field labels
    console.log('Translating estilo field labels...');
    await updateField('estilo', 'group_typography', { meta: { translations: [{ language: 'es-ES', translation: 'Tipografía' }] } });
    await updateField('estilo', 'font_titles', { meta: { translations: [{ language: 'es-ES', translation: 'Fuente de títulos' }] } });
    await updateField('estilo', 'font_body', { meta: { translations: [{ language: 'es-ES', translation: 'Fuente de textos' }] } });
    await updateField('estilo', 'font_size_body', { meta: { translations: [{ language: 'es-ES', translation: 'Tamaño texto base' }] } });
    await updateField('estilo', 'titulo_hero_dk', { meta: { translations: [{ language: 'es-ES', translation: 'Escritorio' }] } });
    await updateField('estilo', 'titulo_hero_tb', { meta: { translations: [{ language: 'es-ES', translation: 'Tablet' }] } });
    await updateField('estilo', 'titulo_hero_mh', { meta: { translations: [{ language: 'es-ES', translation: 'Móvil H' }] } });
    await updateField('estilo', 'titulo_hero_mv', { meta: { translations: [{ language: 'es-ES', translation: 'Móvil V' }] } });
    // Same pattern for all title sizes
    for (const t of ['titulo_1', 'titulo_2', 'titulo_3', 'titulo_4']) {
        await updateField('estilo', t + '_dk', { meta: { translations: [{ language: 'es-ES', translation: 'Escritorio' }] } });
        await updateField('estilo', t + '_tb', { meta: { translations: [{ language: 'es-ES', translation: 'Tablet' }] } });
        await updateField('estilo', t + '_mh', { meta: { translations: [{ language: 'es-ES', translation: 'Móvil H' }] } });
        await updateField('estilo', t + '_mv', { meta: { translations: [{ language: 'es-ES', translation: 'Móvil V' }] } });
    }

    await updateField('estilo', 'group_colors', { meta: { translations: [{ language: 'es-ES', translation: 'Colores' }] } });
    await updateField('estilo', 'color_primary', { meta: { translations: [{ language: 'es-ES', translation: 'Color primario' }] } });
    await updateField('estilo', 'color_primary_hover', { meta: { translations: [{ language: 'es-ES', translation: 'Color primario (hover)' }] } });
    await updateField('estilo', 'color_title', { meta: { translations: [{ language: 'es-ES', translation: 'Color de títulos' }] } });
    await updateField('estilo', 'color_text', { meta: { translations: [{ language: 'es-ES', translation: 'Color de textos' }] } });
    await updateField('estilo', 'color_bg_body', { meta: { translations: [{ language: 'es-ES', translation: 'Fondo del cuerpo' }] } });
    await updateField('estilo', 'color_bg_section_alt', { meta: { translations: [{ language: 'es-ES', translation: 'Fondo secciones alternas' }] } });
    await updateField('estilo', 'color_footer_bg', { meta: { translations: [{ language: 'es-ES', translation: 'Fondo del footer' }] } });

    await updateField('estilo', 'group_buttons', { meta: { translations: [{ language: 'es-ES', translation: 'Botones' }] } });
    await updateField('estilo', 'btn_border_radius', { meta: { translations: [{ language: 'es-ES', translation: 'Radio de bordes' }] } });
    await updateField('estilo', 'btn_uppercase', { meta: { translations: [{ language: 'es-ES', translation: 'Mayúsculas' }] } });
    await updateField('estilo', 'btn_font_size', { meta: { translations: [{ language: 'es-ES', translation: 'Tamaño de fuente' }] } });
    await updateField('estilo', 'btn_padding_y', { meta: { translations: [{ language: 'es-ES', translation: 'Relleno vertical' }] } });
    await updateField('estilo', 'btn_padding_x', { meta: { translations: [{ language: 'es-ES', translation: 'Relleno horizontal' }] } });
    await updateField('estilo', 'btn_border_width', { meta: { translations: [{ language: 'es-ES', translation: 'Ancho del borde' }] } });
    await updateField('estilo', 'btn_custom_colors', { meta: { translations: [{ language: 'es-ES', translation: 'Colores personalizados' }] } });
    await updateField('estilo', 'btn_filled_bg', { meta: { translations: [{ language: 'es-ES', translation: 'Color de fondo' }] } });
    await updateField('estilo', 'btn_filled_text', { meta: { translations: [{ language: 'es-ES', translation: 'Color de texto' }] } });
    await updateField('estilo', 'btn_filled_bg_hover', { meta: { translations: [{ language: 'es-ES', translation: 'Fondo hover' }] } });
    await updateField('estilo', 'btn_outline_border', { meta: { translations: [{ language: 'es-ES', translation: 'Color del borde' }] } });
    await updateField('estilo', 'btn_outline_text', { meta: { translations: [{ language: 'es-ES', translation: 'Color de texto' }] } });
    await updateField('estilo', 'btn_outline_bg_hover', { meta: { translations: [{ language: 'es-ES', translation: 'Fondo hover' }] } });
    await updateField('estilo', 'btn_outline_text_hover', { meta: { translations: [{ language: 'es-ES', translation: 'Texto hover' }] } });

    console.log('Done!');
}

main().catch(console.error);
