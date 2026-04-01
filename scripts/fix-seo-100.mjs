const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';
const headers = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

const updates = [
    // ===== SPANISH PAGES =====
    { slug: '/', data: {
        keyword: 'turismo aragón',
        page_title: 'Turismo Aragón para agencias',
        meta_title: 'Turismo Aragón para agencias - Aragón te espera',
        meta_description: 'Experiencias de turismo Aragón para touroperadores y agencias internacionales. Rutas culturales, naturaleza y gastronomía con guías oficiales multilingües.'
    }},
    { slug: '/quienes-somos', data: {
        keyword: 'guías turísticos aragón',
        page_title: 'Guías turísticos Aragón - Quiénes somos',
        meta_title: 'Guías turísticos Aragón - Quiénes somos',
        meta_description: 'Somos guías turísticos Aragón oficiales y multilingües. Diseñamos rutas culturales, naturales y gastronómicas adaptadas a touroperadores y agencias.'
    }},
    { slug: '/servicios', data: {
        keyword: 'servicios turísticos aragón',
        page_title: 'Servicios turísticos Aragón',
        meta_title: 'Servicios turísticos Aragón - Visitas y rutas',
        meta_description: 'Descubre nuestros servicios turísticos Aragón: visitas culturales, senderismo en el Pirineo, enoturismo en Somontano y gastronomía aragonesa para agencias.'
    }},
    { slug: '/colabora', data: {
        keyword: 'colaborar agencias turismo aragón',
        page_title: 'Colaborar agencias turismo Aragón',
        meta_title: 'Colaborar agencias turismo Aragón - Aragón te espera',
        meta_description: 'Quieres colaborar agencias turismo Aragón? Somos tu aliado local con soporte profesional, presupuestos personalizados y propuestas a medida.'
    }},
    { slug: '/noticias', data: {
        keyword: 'noticias turismo aragón',
        page_title: 'Noticias turismo Aragón',
        meta_title: 'Noticias turismo Aragón - Blog Aragón te espera',
        meta_description: 'Las últimas noticias turismo Aragón: rutas, destinos, gastronomía y propuestas para descubrir el potencial de Aragón como destino turístico.'
    }},
    { slug: '/aviso-legal', data: {
        keyword: 'aviso legal',
        page_title: 'Aviso legal',
        meta_title: 'Aviso legal - Aragón te espera',
        meta_description: 'Consulta el aviso legal de Aragón te espera. Información sobre propiedad intelectual, condiciones de uso y legislación aplicable del sitio web.'
    }},
    { slug: '/politica-de-privacidad', data: {
        keyword: 'política de privacidad',
        page_title: 'Política de privacidad',
        meta_title: 'Política de privacidad - Aragón te espera',
        meta_description: 'Lee nuestra política de privacidad. Información completa sobre el tratamiento de datos personales, derechos del usuario y protección de datos RGPD.'
    }},
    { slug: '/politica-de-cookies', data: {
        keyword: 'política de cookies',
        page_title: 'Política de cookies',
        meta_title: 'Política de cookies - Aragón te espera',
        meta_description: 'Consulta nuestra política de cookies. Información sobre los tipos de cookies utilizadas, cómo gestionarlas y configurar tu consentimiento en el sitio.'
    }},

    // ===== ENGLISH PAGES =====
    { slug: '/en', data: {
        keyword: 'tourism aragon spain',
        page_title: 'Tourism Aragon Spain for agencies',
        meta_title: 'Tourism Aragon Spain for agencies - Aragón te espera',
        meta_description: 'Professional tourism Aragon Spain experiences for tour operators and international agencies. Cultural, nature and gastronomic routes with multilingual guides.'
    }},
    { slug: '/en/about-us', data: {
        keyword: 'tour guides aragon',
        page_title: 'Tour guides Aragon - About us',
        meta_title: 'Tour guides Aragon - About us - Aragón te espera',
        meta_description: 'We are official multilingual tour guides Aragon. We design cultural, nature and gastronomic routes adapted to tour operators and international agencies.'
    }},
    { slug: '/en/services', data: {
        keyword: 'tourism services aragon',
        page_title: 'Tourism services Aragon',
        meta_title: 'Tourism services Aragon - Visits and routes',
        meta_description: 'Discover our tourism services Aragon: cultural visits, Pyrenees hiking, Somontano wine tourism and Aragonese gastronomy for agencies and tour operators.'
    }},
    { slug: '/en/collaborate', data: {
        keyword: 'collaborate tourism agencies aragon',
        page_title: 'Collaborate tourism agencies Aragon',
        meta_title: 'Collaborate tourism agencies Aragon - Aragón te espera',
        meta_description: 'Want to collaborate tourism agencies Aragon? We are your local partner with professional support, tailored budgets and custom proposals for your market.'
    }},
    { slug: '/en/news', data: {
        keyword: 'news tourism aragon',
        page_title: 'News tourism Aragon',
        meta_title: 'News tourism Aragon - Blog Aragón te espera',
        meta_description: 'Latest news tourism Aragon: routes, destinations, gastronomy and proposals to discover the potential of Aragon as an international tourist destination.'
    }},
    { slug: '/en/legal-notice', data: {
        keyword: 'legal notice',
        page_title: 'Legal notice',
        meta_title: 'Legal notice - Aragón te espera',
        meta_description: 'Read the legal notice of Aragón te espera. Information about intellectual property, terms of use and applicable legislation for this tourism website.'
    }},
    { slug: '/en/privacy-policy', data: {
        keyword: 'privacy policy',
        page_title: 'Privacy policy',
        meta_title: 'Privacy policy - Aragón te espera',
        meta_description: 'Read our privacy policy. Complete information on personal data processing, user rights and GDPR data protection compliance at Aragón te espera.'
    }},
    { slug: '/en/cookie-policy', data: {
        keyword: 'cookie policy',
        page_title: 'Cookie policy',
        meta_title: 'Cookie policy - Aragón te espera',
        meta_description: 'Read our cookie policy. Information about cookie types used on this website, how to manage them and configure your consent preferences easily.'
    }},

    // ===== SPANISH POSTS =====
    { slug: '/noticias/descubre-el-pirineo-aragones', data: {
        keyword: 'pirineo aragonés',
        meta_title: 'Descubre el Pirineo aragonés: cumbres y experiencias',
        meta_description: 'Descubre el Pirineo aragonés con rutas de montaña, valles glaciares y experiencias únicas. Senderismo, naturaleza y guías especializados en el Pirineo aragonés.'
    }},
    { slug: '/noticias/ruta-pueblos-bonitos-aragon', data: {
        keyword: 'pueblos bonitos aragón',
        meta_title: 'Ruta por los pueblos bonitos Aragón más encantadores',
        meta_description: 'Descubre los pueblos bonitos Aragón: Alquézar, Aínsa, Sos del Rey Católico y Valderrobres. Itinerarios con patrimonio, gastronomía y alojamientos con encanto.'
    }},
    { slug: '/noticias/enoturismo-somontano', data: {
        keyword: 'enoturismo somontano',
        meta_title: 'Enoturismo Somontano: vino, paisaje y tradición',
        meta_description: 'Vive el enoturismo Somontano con visitas a bodegas, catas de vino, rutas en bicicleta entre viñedos y maridajes con producto local en el prepirineo aragonés.'
    }},
    { slug: '/noticias/aljaferia-legado-mudejar-zaragoza', data: {
        keyword: 'aljafería mudéjar zaragoza',
        meta_title: 'La Aljafería mudéjar Zaragoza - Patrimonio UNESCO',
        meta_description: 'Descubre la Aljafería mudéjar Zaragoza, Patrimonio de la Humanidad. Ruta por el arte mudéjar aragonés con guías oficiales por Zaragoza y Teruel.'
    }},
    { slug: '/noticias/senderismo-ordesa-monte-perdido', data: {
        keyword: 'senderismo ordesa',
        meta_title: 'Senderismo Ordesa y Monte Perdido - Rutas guiadas',
        meta_description: 'Rutas de senderismo Ordesa y Monte Perdido con guías de montaña titulados. Cascadas, cañones, flora y fauna en el gran parque nacional del Pirineo aragonés.'
    }},
    { slug: '/noticias/gastronomia-aragonesa-ternasco-chiron', data: {
        keyword: 'gastronomía aragonesa',
        meta_title: 'Gastronomía aragonesa: del ternasco al chirón',
        meta_description: 'Descubre la gastronomía aragonesa con experiencias de ternasco, jamón de Teruel, aceite del Bajo Aragón y rutas de tapas por el Tubo de Zaragoza para grupos.'
    }},
    { slug: '/noticias/mallos-de-riglos-escalada-naturaleza', data: {
        keyword: 'mallos de riglos',
        meta_title: 'Mallos de Riglos: escalada y naturaleza en Aragón',
        meta_description: 'Visita los Mallos de Riglos: formaciones rocosas espectaculares del prepirineo aragonés. Senderismo, vías ferratas y observación de buitres con guías locales.'
    }},
    { slug: '/noticias/albarracin-viaje-medievo', data: {
        keyword: 'albarracín',
        meta_title: 'Albarracín: un viaje al medievo en Aragón',
        meta_description: 'Visita Albarracín, uno de los pueblos más bonitos de España. Calles medievales, murallas, casas colgadas y Reserva Starlight en la Sierra de Albarracín.'
    }},
    { slug: '/noticias/festivales-tradiciones-aragon', data: {
        keyword: 'festivales tradiciones aragón',
        meta_title: 'Festivales y tradiciones Aragón - Cultura viva',
        meta_description: 'Descubre los festivales tradiciones Aragón: Fiestas del Pilar, Semana Santa del Bajo Aragón, carnaval de Bielsa y experiencias culturales inmersivas para grupos.'
    }},

    // ===== ENGLISH POSTS =====
    { slug: '/en/news/discover-aragonese-pyrenees', data: {
        keyword: 'aragonese pyrenees',
        meta_title: 'Discover the Aragonese Pyrenees: peaks and experiences',
        meta_description: 'Discover the Aragonese Pyrenees with mountain routes, glacial valleys and unique experiences. Hiking, nature and specialised guides in the Aragonese Pyrenees.'
    }},
    { slug: '/en/news/most-beautiful-villages-aragon', data: {
        keyword: 'beautiful villages aragon',
        meta_title: 'Most beautiful villages Aragon - Guided routes',
        meta_description: 'Explore the most beautiful villages Aragon: Alquézar, Aínsa, Sos del Rey Católico. Heritage itineraries with gastronomy, charming accommodation and local guides.'
    }},
    { slug: '/en/news/wine-tourism-somontano', data: {
        keyword: 'wine tourism somontano',
        meta_title: 'Wine tourism Somontano: wine, landscape and tradition',
        meta_description: 'Experience wine tourism Somontano with winery visits, tastings, cycling routes through vineyards and local produce pairings in the Aragonese pre-Pyrenees.'
    }},
    { slug: '/en/news/aljaferia-mudejar-legacy-zaragoza', data: {
        keyword: 'aljaferia mudejar zaragoza',
        meta_title: 'Aljafería Mudéjar Zaragoza - UNESCO World Heritage',
        meta_description: 'Discover the Aljafería Mudéjar Zaragoza, a UNESCO World Heritage site. Guided tours through Aragonese Mudéjar art in Zaragoza and Teruel with official guides.'
    }},
    { slug: '/en/news/hiking-ordesa-monte-perdido', data: {
        keyword: 'hiking ordesa',
        meta_title: 'Hiking Ordesa and Monte Perdido - Guided routes',
        meta_description: 'Guided hiking Ordesa and Monte Perdido routes with certified mountain guides. Waterfalls, canyons, wildlife and flora in the great Pyrenean national park.'
    }},
    { slug: '/en/news/aragonese-gastronomy', data: {
        keyword: 'aragonese gastronomy',
        meta_title: 'Aragonese gastronomy: from ternasco to chirón',
        meta_description: 'Discover Aragonese gastronomy with ternasco, Teruel ham, Bajo Aragón olive oil experiences and tapas routes through Zaragoza for international tour groups.'
    }},
    { slug: '/en/news/mallos-riglos-climbing-nature', data: {
        keyword: 'mallos de riglos',
        meta_title: 'Mallos de Riglos: climbing and nature in Aragon',
        meta_description: 'Visit the Mallos de Riglos: spectacular rock formations in the Aragonese pre-Pyrenees. Hiking, via ferratas and vulture watching with local specialist guides.'
    }},
    { slug: '/en/news/albarracin-journey-middle-ages', data: {
        keyword: 'albarracin spain',
        meta_title: 'Albarracín Spain: a journey to the Middle Ages',
        meta_description: 'Visit Albarracín Spain, one of the most beautiful villages. Medieval streets, walls, hanging houses and Starlight Reserve in the Sierra de Albarracín region.'
    }},
    { slug: '/en/news/festivals-traditions-aragon', data: {
        keyword: 'festivals traditions aragon',
        meta_title: 'Festivals and traditions Aragon - Living culture',
        meta_description: 'Discover festivals traditions Aragon: Pilar festivities, Bajo Aragón Holy Week, Bielsa carnival and immersive cultural experiences for international tour groups.'
    }},
];

async function main() {
    console.log('Updating SEO entries for score 100...');
    for (const u of updates) {
        const res = await fetch(`${DIRECTUS_URL}/items/seo?filter[slug][_eq]=${encodeURIComponent(u.slug)}&limit=1`, { headers });
        const data = await res.json();
        const item = data.data && data.data[0];
        if (!item) { console.log('  Not found: ' + u.slug); continue; }

        await fetch(`${DIRECTUS_URL}/items/seo/${item.id}`, {
            method: 'PATCH', headers,
            body: JSON.stringify(u.data)
        });
        console.log('  Updated: ' + u.slug);
    }
    console.log('Done!');
}

main().catch(console.error);
