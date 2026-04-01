const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

async function main() {
    // 1. Create SEO collection
    console.log('Creating SEO collection...');
    const colRes = await fetch(`${DIRECTUS_URL}/collections`, {
        method: 'POST', headers,
        body: JSON.stringify({
            collection: 'seo',
            meta: {
                icon: 'search',
                note: 'SEO - Optimización para buscadores',
                sort_field: 'sort',
                translations: [{ language: 'es-ES', translation: 'SEO', singular: 'SEO', plural: 'SEO' }]
            },
            schema: {},
            fields: [
                { field: 'id', type: 'integer', meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
                { field: 'sort', type: 'integer', meta: { hidden: true }, schema: {} },
                {
                    field: 'page_type',
                    type: 'string',
                    meta: {
                        interface: 'select-dropdown',
                        width: 'half',
                        sort: 1,
                        options: { choices: [{ text: 'Página', value: 'page' }, { text: 'Noticia', value: 'post' }], allowOther: true },
                        translations: [{ language: 'es-ES', translation: 'Tipo' }],
                        note: 'Tipo de contenido. Se pueden añadir nuevos tipos desde Directus.'
                    },
                    schema: { default_value: 'page', is_nullable: false }
                },
                {
                    field: 'language',
                    type: 'string',
                    meta: {
                        interface: 'select-dropdown',
                        width: 'half',
                        sort: 2,
                        options: { choices: [{ text: 'Español', value: 'es' }, { text: 'Inglés', value: 'en' }] },
                        translations: [{ language: 'es-ES', translation: 'Idioma' }]
                    },
                    schema: { default_value: 'es', is_nullable: false }
                },
                {
                    field: 'page_title',
                    type: 'string',
                    meta: { interface: 'input', width: 'full', sort: 3, translations: [{ language: 'es-ES', translation: 'Título de la página' }], note: 'Título visible de la página' },
                    schema: { is_nullable: false }
                },
                {
                    field: 'slug',
                    type: 'string',
                    meta: { interface: 'input', width: 'half', sort: 4, translations: [{ language: 'es-ES', translation: 'Slug (URL)' }], note: 'Ruta de la URL' },
                    schema: {}
                },
                {
                    field: 'keyword',
                    type: 'string',
                    meta: { interface: 'input', width: 'half', sort: 5, translations: [{ language: 'es-ES', translation: 'Palabra clave' }], note: 'Keyword principal para SEO' },
                    schema: {}
                },
                {
                    field: 'meta_title',
                    type: 'string',
                    meta: { interface: 'input', width: 'full', sort: 6, translations: [{ language: 'es-ES', translation: 'Meta título' }], note: 'Título para buscadores (máx. 60 caracteres)' },
                    schema: {}
                },
                {
                    field: 'meta_description',
                    type: 'text',
                    meta: { interface: 'input-multiline', width: 'full', sort: 7, translations: [{ language: 'es-ES', translation: 'Meta descripción' }], note: 'Descripción para buscadores (máx. 160 caracteres)' },
                    schema: {}
                },
                {
                    field: 'noindex',
                    type: 'boolean',
                    meta: {
                        interface: 'boolean',
                        width: 'half',
                        sort: 8,
                        translations: [{ language: 'es-ES', translation: 'No indexar' }],
                        note: 'Si está activado, la página no será indexada por buscadores'
                    },
                    schema: { default_value: false, is_nullable: false }
                },
                {
                    field: 'seo_score',
                    type: 'alias',
                    meta: {
                        interface: 'presentation-notice',
                        special: ['alias', 'no-data'],
                        width: 'full',
                        sort: 8,
                        translations: [{ language: 'es-ES', translation: 'Puntuación SEO' }],
                        options: { text: 'La puntuación SEO se calcula en el frontend.' }
                    }
                }
            ]
        })
    });
    console.log(colRes.ok ? 'Collection created' : 'Error: ' + await colRes.text());

    // 2. Set public read permission
    console.log('Setting public permission...');
    const policiesRes = await fetch(`${DIRECTUS_URL}/policies`, { headers });
    const policiesData = await policiesRes.json();
    const publicPolicy = policiesData.data.find(p => p.icon === 'public');
    if (publicPolicy) {
        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST', headers,
            body: JSON.stringify({ policy: publicPolicy.id, collection: 'seo', action: 'read', fields: ['*'], permissions: {}, validation: null }),
        });
    }

    // 3. Seed pages
    console.log('Seeding SEO entries...');
    const pages = [
        // Spanish pages
        { page_type: 'page', language: 'es', page_title: 'Inicio', slug: '/', keyword: 'turismo Aragón', meta_title: 'Aragón te espera - Experiencias turísticas para agencias', meta_description: 'Experiencias turísticas en Aragón para touroperadores y agencias internacionales. Propuestas culturales, de naturaleza y gastronómicas.' },
        { page_type: 'page', language: 'es', page_title: 'Quiénes somos', slug: '/quienes-somos', keyword: 'guías turísticos Aragón', meta_title: 'Quiénes somos - Aragón te espera', meta_description: 'Guías oficiales multilingües con experiencia en rutas culturales, naturales y gastronómicas en Aragón.' },
        { page_type: 'page', language: 'es', page_title: 'Servicios', slug: '/servicios', keyword: 'servicios turísticos Aragón', meta_title: 'Servicios - Aragón te espera', meta_description: 'Visitas culturales, naturaleza, enoturismo y gastronomía. Experiencias turísticas adaptadas a touroperadores.' },
        { page_type: 'page', language: 'es', page_title: 'Colabora', slug: '/colabora', keyword: 'colaborar agencias turismo', meta_title: 'Colabora - Aragón te espera', meta_description: 'Colabora con nosotros como touroperador o agencia. Soporte profesional y propuestas a medida.' },
        { page_type: 'page', language: 'es', page_title: 'Noticias', slug: '/noticias', keyword: 'noticias turismo Aragón', meta_title: 'Noticias - Aragón te espera', meta_description: 'Noticias, rutas y propuestas para descubrir Aragón como destino turístico.' },
        { page_type: 'page', language: 'es', page_title: 'Aviso legal', slug: '/aviso-legal', keyword: '', meta_title: 'Aviso legal - Aragón te espera', meta_description: 'Aviso legal y condiciones de uso del sitio web Aragón te espera.', noindex: true },
        { page_type: 'page', language: 'es', page_title: 'Política de privacidad', slug: '/politica-de-privacidad', keyword: '', meta_title: 'Política de privacidad - Aragón te espera', meta_description: 'Información sobre el tratamiento de datos personales en Aragón te espera.', noindex: true },
        { page_type: 'page', language: 'es', page_title: 'Política de cookies', slug: '/politica-de-cookies', keyword: '', meta_title: 'Política de cookies - Aragón te espera', meta_description: 'Información sobre las cookies utilizadas en el sitio web Aragón te espera.', noindex: true },
        // English pages
        { page_type: 'page', language: 'en', page_title: 'Home', slug: '/en', keyword: 'tourism Aragon Spain', meta_title: 'Aragón te espera - Tourism experiences for agencies', meta_description: 'Tourism experiences in Aragón for tour operators and international agencies. Cultural, nature and gastronomic proposals.' },
        { page_type: 'page', language: 'en', page_title: 'About us', slug: '/en/about-us', keyword: 'tour guides Aragon', meta_title: 'About us - Aragón te espera', meta_description: 'Multilingual official guides experienced in cultural, nature and gastronomic routes in Aragón.' },
        { page_type: 'page', language: 'en', page_title: 'Services', slug: '/en/services', keyword: 'tourism services Aragon', meta_title: 'Services - Aragón te espera', meta_description: 'Cultural visits, nature, wine tourism and gastronomy. Tourism experiences adapted to tour operators.' },
        { page_type: 'page', language: 'en', page_title: 'Collaborate', slug: '/en/collaborate', keyword: 'collaborate tourism agencies', meta_title: 'Collaborate - Aragón te espera', meta_description: 'Collaborate with us as a tour operator or agency. Professional support and tailored proposals.' },
        { page_type: 'page', language: 'en', page_title: 'News', slug: '/en/news', keyword: 'news tourism Aragon', meta_title: 'News - Aragón te espera', meta_description: 'News, routes and proposals to discover Aragón as a tourist destination.' },
        { page_type: 'page', language: 'en', page_title: 'Legal notice', slug: '/en/legal-notice', keyword: '', meta_title: 'Legal notice - Aragón te espera', meta_description: 'Legal notice and terms of use for the Aragón te espera website.', noindex: true },
        { page_type: 'page', language: 'en', page_title: 'Privacy policy', slug: '/en/privacy-policy', keyword: '', meta_title: 'Privacy policy - Aragón te espera', meta_description: 'Information on the processing of personal data at Aragón te espera.', noindex: true },
        { page_type: 'page', language: 'en', page_title: 'Cookie policy', slug: '/en/cookie-policy', keyword: '', meta_title: 'Cookie policy - Aragón te espera', meta_description: 'Information about the cookies used on the Aragón te espera website.', noindex: true },
    ];

    for (const page of pages) {
        const res = await fetch(`${DIRECTUS_URL}/items/seo`, { method: 'POST', headers, body: JSON.stringify(page) });
        console.log(res.ok ? `  ${page.language}: ${page.page_title}` : `  Error: ${page.page_title}`);
    }

    // 4. Seed blog posts from existing posts
    console.log('Seeding blog post SEO entries...');
    const postsRes = await fetch(`${DIRECTUS_URL}/items/posts?fields=title,slug,language&sort=id`, { headers });
    const posts = await postsRes.json();
    for (const post of posts.data) {
        const prefix = post.language === 'en' ? '/en/news/' : '/noticias/';
        const res = await fetch(`${DIRECTUS_URL}/items/seo`, {
            method: 'POST', headers,
            body: JSON.stringify({
                page_type: 'post',
                language: post.language,
                page_title: post.title,
                slug: prefix + post.slug,
                keyword: '',
                meta_title: post.title + ' - Aragón te espera',
                meta_description: ''
            })
        });
        console.log(res.ok ? `  ${post.language} post: ${post.title.substring(0, 40)}...` : `  Error: ${post.title}`);
    }

    console.log('Done!');
}

main().catch(console.error);
