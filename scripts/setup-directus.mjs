/**
 * Directus Setup Script
 * Creates blog collections, sets permissions, and seeds 9 sample posts.
 */

const DIRECTUS_URL = 'http://directus:8055';
const TOKEN = 'aragon-admin-token';

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
};

async function waitForDirectus() {
    console.log('Waiting for Directus to be ready...');
    for (let i = 0; i < 60; i++) {
        try {
            const res = await fetch(`${DIRECTUS_URL}/server/health`);
            if (res.ok) {
                console.log('Directus is ready.');
                return;
            }
        } catch (e) { /* retry */ }
        await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error('Directus did not become ready in time.');
}

async function collectionExists(name) {
    const res = await fetch(`${DIRECTUS_URL}/collections/${name}`, { headers });
    return res.ok;
}

async function createCollections() {
    // --- Categories ---
    if (await collectionExists('categories')) {
        console.log('Collection "categories" already exists, skipping.');
    } else {
        console.log('Creating "categories" collection...');
        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'categories',
                meta: { icon: 'category', note: 'Blog categories', sort_field: 'sort' },
                schema: {},
                fields: [
                    { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
                    { field: 'name', type: 'string', meta: { interface: 'input', required: true, width: 'half' }, schema: { is_nullable: false } },
                    { field: 'slug', type: 'string', meta: { interface: 'input', width: 'half', note: 'URL-friendly name' }, schema: { is_unique: true, is_nullable: false } },
                    { field: 'sort', type: 'integer', meta: { hidden: true, interface: 'input' }, schema: {} },
                ],
            }),
        });
    }

    // --- Posts ---
    if (await collectionExists('posts')) {
        console.log('Collection "posts" already exists, skipping.');
    } else {
        console.log('Creating "posts" collection...');
        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'posts',
                meta: { icon: 'article', note: 'Blog posts', sort_field: 'sort' },
                schema: {},
                fields: [
                    { field: 'id', type: 'integer', meta: { hidden: true, interface: 'input', readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
                    { field: 'status', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', required: true }, schema: { default_value: 'draft', is_nullable: false } },
                    { field: 'title', type: 'string', meta: { interface: 'input', required: true, width: 'full' }, schema: { is_nullable: false } },
                    { field: 'slug', type: 'string', meta: { interface: 'input', width: 'half', note: 'Auto-generated from title, editable' }, schema: { is_unique: true, is_nullable: false } },
                    { field: 'date_published', type: 'timestamp', meta: { interface: 'datetime', width: 'half' }, schema: {} },
                    { field: 'featured_image', type: 'uuid', meta: { interface: 'file-image', width: 'full' }, schema: {} },
                    { field: 'content', type: 'text', meta: { interface: 'input-rich-text-html', width: 'full', note: 'Post content (WYSIWYG)' }, schema: {} },
                    { field: 'sort', type: 'integer', meta: { hidden: true, interface: 'input' }, schema: {} },
                ],
            }),
        });

        // Add featured_image relation to directus_files
        console.log('Creating featured_image relation...');
        await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'posts',
                field: 'featured_image',
                related_collection: 'directus_files',
            }),
        });
    }

    // --- Junction: posts_categories ---
    if (await collectionExists('posts_categories')) {
        console.log('Collection "posts_categories" already exists, skipping.');
    } else {
        console.log('Creating "posts_categories" junction...');
        await fetch(`${DIRECTUS_URL}/collections`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'posts_categories',
                meta: { hidden: true, icon: 'import_export' },
                schema: {},
                fields: [
                    { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
                    { field: 'posts_id', type: 'integer', meta: { hidden: true }, schema: {} },
                    { field: 'categories_id', type: 'integer', meta: { hidden: true }, schema: {} },
                ],
            }),
        });

        // M2M relation: posts -> categories
        console.log('Creating M2M relations...');
        await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'posts_categories',
                field: 'posts_id',
                related_collection: 'posts',
                meta: { one_field: 'categories', junction_field: 'categories_id' },
                schema: { on_delete: 'SET NULL' },
            }),
        });
        await fetch(`${DIRECTUS_URL}/relations`, {
            method: 'POST', headers,
            body: JSON.stringify({
                collection: 'posts_categories',
                field: 'categories_id',
                related_collection: 'categories',
                meta: { one_field: 'posts', junction_field: 'posts_id' },
                schema: { on_delete: 'SET NULL' },
            }),
        });

        // Create categories alias field on posts for M2M display
        console.log('Creating categories alias field on posts...');
        await fetch(`${DIRECTUS_URL}/fields/posts`, {
            method: 'POST', headers,
            body: JSON.stringify({
                field: 'categories',
                type: 'alias',
                meta: { interface: 'list-m2m', special: ['m2m'], options: { template: '{{categories_id.name}}' }, display: 'related-values', display_options: { template: '{{categories_id.name}}' } },
            }),
        });
    }
}

async function setPublicPermissions() {
    console.log('Setting public read permissions...');

    // Find the public policy (Directus v11 uses policies instead of roles for permissions)
    const policiesRes = await fetch(`${DIRECTUS_URL}/policies`, { headers });
    const policiesData = await policiesRes.json();
    const publicPolicy = policiesData.data.find(p => p.name === '$t:public_label' || p.icon === 'public');
    if (!publicPolicy) {
        console.error('  Could not find public policy. Skipping permissions.');
        return;
    }
    const policyId = publicPolicy.id;
    console.log(`  Found public policy: ${policyId}`);

    const collections = ['posts', 'categories', 'posts_categories', 'directus_files'];
    for (const collection of collections) {
        // Check if permission already exists
        const checkRes = await fetch(`${DIRECTUS_URL}/permissions?filter[collection][_eq]=${collection}&filter[policy][_eq]=${policyId}&filter[action][_eq]=read`, { headers });
        const checkData = await checkRes.json();
        if (checkData.data && checkData.data.length > 0) {
            console.log(`  Public read for "${collection}" already exists.`);
            continue;
        }
        await fetch(`${DIRECTUS_URL}/permissions`, {
            method: 'POST', headers,
            body: JSON.stringify({
                policy: policyId,
                collection,
                action: 'read',
                fields: ['*'],
                permissions: {},
                validation: null,
            }),
        });
        console.log(`  Public read for "${collection}" created.`);
    }
}

async function uploadImage(filePath, title) {
    const { readFileSync } = await import('node:fs');
    const fileBuffer = readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', blob, filePath.split('/').pop());

    const res = await fetch(`${DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        body: formData,
    });
    if (!res.ok) {
        const errText = await res.text();
        console.error(`  Upload failed for ${filePath}: ${errText}`);
        return null;
    }
    const data = await res.json();
    return data.data.id;
}

async function seedData() {
    // Check if data already exists
    const postsCheck = await fetch(`${DIRECTUS_URL}/items/posts?limit=1`, { headers });
    const postsData = await postsCheck.json();
    if (postsData.data && postsData.data.length > 0) {
        console.log('Posts already seeded, skipping.');
        return;
    }

    console.log('Uploading images...');
    const imageIds = {};
    const images = [
        { path: '/img/cabecera-01.jpg', title: 'Pirineo aragonés' },
        { path: '/img/cabecera-02.jpg', title: 'Paisaje de Aragón' },
        { path: '/img/cabecera-03.jpg', title: 'Patrimonio cultural' },
        { path: '/img/cabecera-04.jpg', title: 'Tradiciones aragonesas' },
        { path: '/img/cultura-01.jpg', title: 'Cultura y patrimonio' },
        { path: '/img/naturaleza-01.jpg', title: 'Naturaleza y montaña' },
        { path: '/img/naturaleza-02.jpg', title: 'Senderismo en Aragón' },
        { path: '/img/naturaleza-03.jpg', title: 'Paisaje natural' },
        { path: '/img/enoturismo-01.jpg', title: 'Enoturismo' },
    ];
    for (const img of images) {
        imageIds[img.path] = await uploadImage(img.path, img.title);
        console.log(`  Uploaded: ${img.title}`);
    }

    console.log('Creating categories...');
    const categoriesData = [
        { name: 'Cultura', slug: 'cultura' },
        { name: 'Naturaleza', slug: 'naturaleza' },
        { name: 'Gastronomía', slug: 'gastronomia' },
        { name: 'Rutas', slug: 'rutas' },
        { name: 'Patrimonio', slug: 'patrimonio' },
    ];
    const categoryIds = {};
    for (const cat of categoriesData) {
        const res = await fetch(`${DIRECTUS_URL}/items/categories`, {
            method: 'POST', headers,
            body: JSON.stringify(cat),
        });
        const data = await res.json();
        categoryIds[cat.slug] = data.data.id;
        console.log(`  Category: ${cat.name}`);
    }

    console.log('Creating 9 blog posts...');
    const posts = [
        {
            title: 'Descubre el Pirineo aragonés: cumbres, valles y experiencias únicas',
            slug: 'descubre-el-pirineo-aragones',
            status: 'published',
            date_published: '2027-01-15T10:00:00',
            featured_image: imageIds['/img/cabecera-01.jpg'],
            categories: [{ categories_id: categoryIds['naturaleza'] }, { categories_id: categoryIds['rutas'] }],
            content: `<h2>Un destino de montaña sin igual</h2>
<p>El Pirineo aragonés es uno de los grandes tesoros naturales de Europa. Con cumbres que superan los 3.000 metros, valles glaciares de una belleza sobrecogedora y una red de senderos que conecta pueblos con siglos de historia, esta cordillera ofrece un escenario perfecto para programas de turismo activo, cultural y de naturaleza.</p>
<p>Desde el Valle de Ordesa hasta el de Benasque, pasando por Ansó, Hecho o Panticosa, cada rincón del Pirineo tiene su propia personalidad. Los grupos descubren paisajes que combinan alta montaña con prados alpinos, bosques de hayas y abetos, y ríos cristalinos que han modelado el terreno durante miles de años.</p>
<h2>Experiencias para todos los niveles</h2>
<p>Diseñamos rutas adaptadas a cada perfil: desde paseos suaves por fondos de valle ideales para familias o grupos senior, hasta travesías de varios días para los más aventureros. Todas las actividades incluyen guías de montaña titulados y equipamiento profesional.</p>
<p>Entre las propuestas más demandadas destacan las rutas por el Parque Nacional de Ordesa y Monte Perdido, las excursiones al ibón de Plan, y los itinerarios por los pueblos de arquitectura tradicional del Sobrarbe.</p>
<h2>Logística profesional</h2>
<p>Nos encargamos de toda la coordinación: transporte desde Zaragoza o Huesca, alojamiento en hoteles de montaña seleccionados, restauración con producto local y gestión de permisos en espacios protegidos. Todo con la flexibilidad que necesita el operador profesional.</p>`,
        },
        {
            title: 'Ruta por los pueblos más bonitos de Aragón',
            slug: 'ruta-pueblos-bonitos-aragon',
            status: 'published',
            date_published: '2027-01-28T10:00:00',
            featured_image: imageIds['/img/cultura-01.jpg'],
            categories: [{ categories_id: categoryIds['cultura'] }, { categories_id: categoryIds['rutas'] }],
            content: `<h2>Pueblos que cuentan historias</h2>
<p>Aragón alberga algunos de los pueblos más bellos y mejor conservados de España. Localidades como Alquézar, Aínsa, Sos del Rey Católico o Valderrobres ofrecen un viaje en el tiempo a través de calles empedradas, iglesias románicas y castillos que dominan el paisaje.</p>
<p>Estos pueblos no son solo postales: son lugares vivos donde la tradición convive con una oferta gastronómica y cultural cada vez más rica. Ideales para circuitos que combinan patrimonio, naturaleza y gastronomía.</p>
<h2>Itinerarios a medida</h2>
<p>Proponemos rutas de entre 3 y 7 días que recorren las comarcas más atractivas, con paradas en miradores, talleres artesanales y bodegas locales. Cada itinerario se adapta al perfil del grupo y al mercado de origen.</p>
<p>Nuestros guías locales conocen cada rincón y aportan un valor narrativo que transforma la visita en una experiencia memorable. Disponemos de guías en inglés, francés, alemán, italiano y portugués.</p>
<h2>Alojamientos con encanto</h2>
<p>Trabajamos con una selección de hoteles rurales, casas palaciegas restauradas y paradores que refuerzan la experiencia de inmersión en el territorio. Cada alojamiento ha sido elegido por su calidad, ubicación y autenticidad.</p>`,
        },
        {
            title: 'Enoturismo en Somontano: vino, paisaje y tradición',
            slug: 'enoturismo-somontano',
            status: 'published',
            date_published: '2027-02-10T10:00:00',
            featured_image: imageIds['/img/enoturismo-01.jpg'],
            categories: [{ categories_id: categoryIds['gastronomia'] }, { categories_id: categoryIds['rutas'] }],
            content: `<h2>La denominación de origen que sorprende</h2>
<p>Somontano se ha consolidado como una de las denominaciones de origen más dinámicas de España. Situada en el prepirineo oscense, esta zona vinícola combina variedades autóctonas como la Moristel y la Parraleta con internacionales como Cabernet Sauvignon o Gewürztraminer, logrando vinos de carácter único.</p>
<p>Las bodegas de Somontano destacan por su arquitectura vanguardista, sus paisajes de viñedos entre montañas y una apuesta decidida por el enoturismo de calidad.</p>
<h2>Experiencias en bodega</h2>
<p>Organizamos visitas privadas a bodegas como Viñas del Vero, Enate o Laus, con catas dirigidas por enólogos, paseos entre viñedos y maridajes con producto local. Cada visita se adapta al nivel de conocimiento del grupo.</p>
<p>También ofrecemos talleres de cata, experiencias de vendimia en temporada y rutas en bicicleta entre viñedos, combinando deporte y gastronomía en un mismo programa.</p>
<h2>Más allá del vino</h2>
<p>La ruta del Somontano se completa con visitas a Barbastro, Alquézar y el Parque Natural de la Sierra y los Cañones de Guara. Un programa redondo que conecta gastronomía, patrimonio y naturaleza en un radio de pocos kilómetros.</p>`,
        },
        {
            title: 'La Aljafería y el legado mudéjar de Zaragoza',
            slug: 'aljaferia-legado-mudejar-zaragoza',
            status: 'published',
            date_published: '2027-02-22T10:00:00',
            featured_image: imageIds['/img/cabecera-03.jpg'],
            categories: [{ categories_id: categoryIds['cultura'] }, { categories_id: categoryIds['patrimonio'] }],
            content: `<h2>Patrimonio de la Humanidad</h2>
<p>El arte mudéjar aragonés, declarado Patrimonio de la Humanidad por la UNESCO, es una de las expresiones artísticas más singulares de Europa. Nacido de la convivencia entre culturas cristiana, musulmana y judía, este estilo arquitectónico único adorna torres, iglesias y palacios en todo Aragón.</p>
<p>Zaragoza es el epicentro de este legado. La Aljafería, palacio islámico del siglo XI, es una joya que rivaliza con la Alhambra. Sus arcos de herradura, yeserías y jardines interiores transportan al visitante a la época de los reinos de taifas.</p>
<h2>Ruta mudéjar en Zaragoza</h2>
<p>Nuestro itinerario urbano recorre los principales monumentos mudéjares: la torre de San Pablo, la Seo (con su mezcla de estilos), la iglesia de la Magdalena y el propio palacio de la Aljafería. Un recorrido de medio día que puede complementarse con visitas al Museo del Foro Romano y la Basílica del Pilar.</p>
<h2>Extensión a Teruel</h2>
<p>Para programas más completos, proponemos una extensión a Teruel, donde las torres mudéjares de San Martín y El Salvador son iconos del arte medieval. La ciudad ofrece además el Mausoleo de los Amantes y una escena gastronómica centrada en el jamón de Teruel con denominación de origen.</p>`,
        },
        {
            title: 'Senderismo en Ordesa y Monte Perdido',
            slug: 'senderismo-ordesa-monte-perdido',
            status: 'published',
            date_published: '2027-03-05T10:00:00',
            featured_image: imageIds['/img/naturaleza-01.jpg'],
            categories: [{ categories_id: categoryIds['naturaleza'] }],
            content: `<h2>El gran parque nacional del Pirineo</h2>
<p>El Parque Nacional de Ordesa y Monte Perdido es uno de los espacios naturales más impresionantes de Europa. Con cuatro valles principales —Ordesa, Añisclo, Escuaín y Pineta—, el parque ofrece una diversidad paisajística extraordinaria: cascadas de más de 70 metros, cañones vertiginosos, praderas alpinas y cumbres que rozan los 3.400 metros.</p>
<p>Declarado Patrimonio de la Humanidad y Reserva de la Biosfera, Ordesa es un destino imprescindible para cualquier programa de turismo de naturaleza en España.</p>
<h2>Rutas guiadas para grupos</h2>
<p>Ofrecemos rutas de diferentes niveles: desde el paseo por la pradera de Ordesa (apto para todos los públicos) hasta la ascensión a la Cola de Caballo o la travesía de las Tres Sorores para grupos experimentados.</p>
<p>Todos los itinerarios incluyen guía de montaña titulado, seguro de actividad, transporte desde el punto de encuentro y picnic con productos locales. Los guías trabajan en español, inglés, francés y alemán.</p>
<h2>Flora y fauna</h2>
<p>El parque alberga especies emblemáticas como el quebrantahuesos, el sarrio (rebeco pirenaico) y la edelweiss. Nuestros guías especializados en naturaleza enriquecen la experiencia con interpretación ambiental y observación de fauna.</p>`,
        },
        {
            title: 'Gastronomía aragonesa: del ternasco al chirón',
            slug: 'gastronomia-aragonesa-ternasco-chiron',
            status: 'published',
            date_published: '2027-03-12T10:00:00',
            featured_image: imageIds['/img/cabecera-04.jpg'],
            categories: [{ categories_id: categoryIds['gastronomia'] }],
            content: `<h2>Sabores con denominación de origen</h2>
<p>La gastronomía aragonesa es un reflejo de su geografía diversa: desde los platos contundentes de montaña hasta las recetas de huerta del Valle del Ebro. El ternasco de Aragón, el jamón de Teruel, el aceite del Bajo Aragón y las frutas de Calanda son solo algunos de los productos con denominación de origen que definen esta cocina.</p>
<p>Para los touroperadores, la gastronomía aragonesa es un complemento perfecto para cualquier programa: añade autenticidad, genera experiencias memorables y conecta al viajero con la cultura local de forma directa.</p>
<h2>Experiencias gastronómicas</h2>
<p>Diseñamos menús degustación en restaurantes seleccionados, visitas a mercados locales como el Mercado Central de Zaragoza, talleres de cocina aragonesa y cenas temáticas en espacios singulares como bodegas centenarias o masías restauradas.</p>
<p>También organizamos rutas de tapas por el Tubo zaragozano, una experiencia social y gastronómica que encanta a los grupos internacionales.</p>
<h2>Producto de proximidad</h2>
<p>Trabajamos exclusivamente con proveedores locales que comparten nuestro compromiso con la calidad y la sostenibilidad. Cada experiencia gastronómica se diseña para reflejar la estacionalidad del producto y la tradición culinaria de cada comarca.</p>`,
        },
        {
            title: 'Los Mallos de Riglos: escalada y naturaleza',
            slug: 'mallos-de-riglos-escalada-naturaleza',
            status: 'published',
            date_published: '2027-03-20T10:00:00',
            featured_image: imageIds['/img/naturaleza-02.jpg'],
            categories: [{ categories_id: categoryIds['naturaleza'] }, { categories_id: categoryIds['rutas'] }],
            content: `<h2>Paredes verticales en el prepirineo</h2>
<p>Los Mallos de Riglos son una formación geológica espectacular: gigantescas columnas de conglomerado rojizo que se elevan más de 300 metros sobre el río Gállego. Este paisaje único, situado a solo 45 minutos de Huesca, es un icono del prepirineo aragonés y un paraíso para la escalada deportiva.</p>
<p>Pero los Mallos no son solo para escaladores. El entorno ofrece rutas de senderismo accesibles, observación de aves rapaces (buitres leonados, alimoches y águilas) y un patrimonio rural que incluye el monasterio de San Juan de la Peña.</p>
<h2>Actividades para grupos</h2>
<p>Organizamos excursiones de medio día y día completo que combinan senderismo por la base de los Mallos, visita al pueblo de Riglos, y almuerzo en restaurante local. Para grupos aventureros, ofrecemos vías ferratas guiadas y rappel de iniciación.</p>
<p>La cercanía a Huesca permite combinar la visita con un recorrido por la ciudad y su catedral gótica, o con una ruta por los castillos del prepirineo.</p>
<h2>Un paisaje de película</h2>
<p>Los Mallos han sido escenario de documentales y películas por su fotogenia extraordinaria. Al atardecer, cuando la luz dora las paredes de conglomerado, el espectáculo visual es difícil de igualar. Un lugar que deja huella en cualquier viajero.</p>`,
        },
        {
            title: 'Albarracín, un viaje al medievo',
            slug: 'albarracin-viaje-medievo',
            status: 'published',
            date_published: '2027-04-02T10:00:00',
            featured_image: imageIds['/img/cabecera-02.jpg'],
            categories: [{ categories_id: categoryIds['cultura'] }, { categories_id: categoryIds['patrimonio'] }],
            content: `<h2>La joya de la Sierra</h2>
<p>Albarracín está considerado uno de los pueblos más bonitos de España. Encaramado sobre un meandro del río Guadalaviar y rodeado por murallas medievales, este conjunto histórico ofrece un paisaje urbano de calles estrechas, casas colgadas de tonos rojizos y una atmósfera que transporta al visitante varios siglos atrás.</p>
<p>Para el viajero internacional, Albarracín es una revelación: un destino que combina la belleza de los pueblos italianos con la autenticidad de la España profunda, lejos de las masificaciones turísticas.</p>
<h2>Visita guiada por el casco histórico</h2>
<p>Nuestros guías oficiales recorren con el grupo los puntos clave: la catedral, el palacio episcopal, la casa de la Julianeta, las murallas y los miradores sobre el río. La visita dura aproximadamente dos horas y se adapta al idioma del grupo.</p>
<p>Para programas más completos, añadimos la visita a las pinturas rupestres del Parque Cultural de Albarracín y una ruta por los pinares de rodeno, con sus formaciones rocosas de arenisca roja.</p>
<h2>Sierra de Albarracín</h2>
<p>El entorno natural de Albarracín ofrece posibilidades excelentes para el senderismo, la observación de estrellas (es Reserva Starlight) y las actividades al aire libre. Diseñamos programas de 2-3 días que combinan patrimonio, naturaleza y gastronomía serrana.</p>`,
        },
        {
            title: 'Festivales y tradiciones en Aragón',
            slug: 'festivales-tradiciones-aragon',
            status: 'published',
            date_published: '2027-04-15T10:00:00',
            featured_image: imageIds['/img/naturaleza-03.jpg'],
            categories: [{ categories_id: categoryIds['cultura'] }, { categories_id: categoryIds['rutas'] }],
            content: `<h2>Un calendario vivo de tradiciones</h2>
<p>Aragón mantiene vivas tradiciones centenarias que ofrecen al viajero una inmersión cultural auténtica. Desde las fiestas del Pilar en Zaragoza hasta la Semana Santa de Calanda, pasando por el carnaval de Bielsa o la romería de Santa Orosia en Jaca, el calendario festivo aragonés es rico, variado y profundamente arraigado.</p>
<p>Para los touroperadores, integrar una festividad local en el programa es un valor añadido que diferencia el producto y genera experiencias irrepetibles.</p>
<h2>Fiestas destacadas</h2>
<p>Las Fiestas del Pilar (octubre) transforman Zaragoza durante una semana con ofrenda de flores, jotas, gigantes y cabezudos. La Semana Santa del Bajo Aragón, con sus tambores atronadores, ha sido declarada de Interés Turístico Internacional.</p>
<p>En el Pirineo, el carnaval de Bielsa recupera figuras ancestrales como las trangas, mientras que la Morisma de Aínsa recrea la batalla entre moros y cristianos con cientos de participantes.</p>
<h2>Experiencias inmersivas</h2>
<p>Organizamos programas especiales en torno a las principales festividades: accesos preferentes, explicaciones culturales, participación en talleres y cenas temáticas. Todo con la logística y coordinación profesional que requiere un grupo organizado.</p>
<p>También diseñamos experiencias en torno a tradiciones cotidianas: visitas a pastores trashumantes, talleres de cerámica en Muel o jornadas de recogida de azafrán en el Jiloca.</p>`,
        },
    ];

    for (const post of posts) {
        if (!post.featured_image) delete post.featured_image;
        const res = await fetch(`${DIRECTUS_URL}/items/posts`, {
            method: 'POST', headers,
            body: JSON.stringify(post),
        });
        if (res.ok) {
            console.log(`  Post created: ${post.title.substring(0, 50)}...`);
        } else {
            const err = await res.text();
            console.error(`  Error creating post "${post.title}": ${err}`);
        }
    }
}

async function main() {
    try {
        await waitForDirectus();
        await createCollections();
        await setPublicPermissions();
        await seedData();
        console.log('\nSetup complete!');
        console.log('  Website: http://localhost');
        console.log('  Directus Admin: http://localhost:8055/admin');
        console.log('  Email: admin@aragonteespera.com');
        console.log('  Password: Admin.123');
    } catch (err) {
        console.error('Setup failed:', err);
        process.exit(1);
    }
}

main();
