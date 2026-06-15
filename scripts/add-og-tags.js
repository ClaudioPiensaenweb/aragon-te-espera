const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, '..', 'public');

const pages = [
  // ES static pages
  {
    file: 'index.html',
    title: 'Aragón te espera - Experiencias turísticas para agencias',
    desc: 'Experiencias turísticas en Aragón para touroperadores y agencias internacionales. Propuestas culturales, de naturaleza y gastronómicas con operativa profesional.',
    url: 'https://aragonteespera.com/',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'quienes-somos.html',
    title: 'Quiénes somos - Aragón te espera',
    desc: 'Guías oficiales multilingües y especialistas locales que conectan touroperadores y agencias internacionales con la esencia auténtica de Aragón.',
    url: 'https://aragonteespera.com/quienes-somos',
    image: 'https://aragonteespera.com/img/quienes-somos-cabecera.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'servicios.html',
    title: 'Servicios - Aragón te espera',
    desc: 'Diseñamos experiencias turísticas pensadas para integrarse fácilmente en los programas de touroperadores, agencias receptivas y plataformas internacionales.',
    url: 'https://aragonteespera.com/servicios',
    image: 'https://aragonteespera.com/img/servicios-cabecera.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'colabora.html',
    title: 'Colabora con nosotros - Aragón te espera',
    desc: 'Únete a nuestra red de colaboradores en Aragón. Buscamos guías, agencias y profesionales del turismo para ofrecer experiencias auténticas a clientes internacionales.',
    url: 'https://aragonteespera.com/colabora',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'blog.html',
    title: 'Noticias - Aragón te espera',
    desc: 'Ideas, rutas y propuestas para descubrir el potencial de Aragón como destino turístico internacional.',
    url: 'https://aragonteespera.com/noticias',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'blog-single.html',
    title: 'Noticias - Aragón te espera',
    desc: 'Aragón te espera - Noticias sobre turismo en Aragón para agencias internacionales.',
    url: 'https://aragonteespera.com/noticias',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'article',
    locale: 'es_ES',
    dynamic: true
  },
  {
    file: 'blog-category.html',
    title: 'Noticias - Aragón te espera',
    desc: 'Ideas, rutas y propuestas para descubrir el potencial de Aragón como destino turístico internacional.',
    url: 'https://aragonteespera.com/noticias',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'aviso-legal.html',
    title: 'Aviso legal - Aragón te espera',
    desc: 'Aviso legal de Aragón te espera. Información sobre el responsable del sitio web y condiciones de uso.',
    url: 'https://aragonteespera.com/aviso-legal',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'politica-de-privacidad.html',
    title: 'Política de privacidad - Aragón te espera',
    desc: 'Política de privacidad de Aragón te espera. Información sobre el tratamiento de datos personales.',
    url: 'https://aragonteespera.com/politica-de-privacidad',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  {
    file: 'politica-de-cookies.html',
    title: 'Política de cookies - Aragón te espera',
    desc: 'Política de cookies de Aragón te espera. Información sobre el uso de cookies en este sitio web.',
    url: 'https://aragonteespera.com/politica-de-cookies',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'es_ES'
  },
  // EN pages
  {
    file: 'en/index.html',
    title: 'Aragón te espera - Tourism experiences for agencies',
    desc: 'Tourism experiences in Aragón for tour operators and international agencies. Cultural, nature and gastronomic proposals with professional operations.',
    url: 'https://aragonteespera.com/en/',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/about-us.html',
    title: 'About us - Aragón te espera',
    desc: 'Official multilingual guides and local specialists connecting tour operators and international agencies with the authentic essence of Aragón.',
    url: 'https://aragonteespera.com/en/about-us',
    image: 'https://aragonteespera.com/img/quienes-somos-cabecera.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/services.html',
    title: 'Services - Aragón te espera',
    desc: 'We design tourism experiences that integrate easily into the programmes of tour operators, incoming agencies and international platforms.',
    url: 'https://aragonteespera.com/en/services',
    image: 'https://aragonteespera.com/img/servicios-cabecera.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/collaborate.html',
    title: 'Collaborate with us - Aragón te espera',
    desc: 'Join our network of collaborators in Aragón. We are looking for guides, agencies and tourism professionals to offer authentic experiences to international clients.',
    url: 'https://aragonteespera.com/en/collaborate',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/blog.html',
    title: 'News - Aragón te espera',
    desc: 'Ideas, routes and proposals to discover the potential of Aragón as an international tourist destination.',
    url: 'https://aragonteespera.com/en/news',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/blog-single.html',
    title: 'News - Aragón te espera',
    desc: 'Aragón te espera - News about tourism in Aragón for international agencies.',
    url: 'https://aragonteespera.com/en/news',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'article',
    locale: 'en_GB',
    dynamic: true
  },
  {
    file: 'en/blog-category.html',
    title: 'News - Aragón te espera',
    desc: 'Ideas, routes and proposals to discover the potential of Aragón as an international tourist destination.',
    url: 'https://aragonteespera.com/en/news',
    image: 'https://aragonteespera.com/img/cabecera-02.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/legal-notice.html',
    title: 'Legal notice - Aragón te espera',
    desc: 'Legal notice for Aragón te espera. Information about the website operator and terms of use.',
    url: 'https://aragonteespera.com/en/legal-notice',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/privacy-policy.html',
    title: 'Privacy policy - Aragón te espera',
    desc: 'Privacy policy for Aragón te espera. Information about the processing of personal data.',
    url: 'https://aragonteespera.com/en/privacy-policy',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'en_GB'
  },
  {
    file: 'en/cookie-policy.html',
    title: 'Cookie policy - Aragón te espera',
    desc: 'Cookie policy for Aragón te espera. Information about the use of cookies on this website.',
    url: 'https://aragonteespera.com/en/cookie-policy',
    image: 'https://aragonteespera.com/img/cabecera-01.jpg',
    type: 'website',
    locale: 'en_GB'
  }
];

function buildOgBlock(p) {
  const dynNote = p.dynamic
    ? '\n    <!-- Note: og:title, og:description, og:url, og:image updated at runtime by JS in loadPost() -->'
    : '';
  return [
    '',
    '    <!-- Open Graph / Social -->' + dynNote,
    '    <meta property="og:type" content="' + p.type + '">',
    '    <meta property="og:site_name" content="Aragón te espera">',
    '    <meta property="og:locale" content="' + p.locale + '">',
    '    <meta property="og:url" content="' + p.url + '">',
    '    <meta property="og:title" content="' + p.title + '">',
    '    <meta property="og:description" content="' + p.desc + '">',
    '    <meta property="og:image" content="' + p.image + '">',
    '    <meta property="og:image:width" content="1200">',
    '    <meta property="og:image:height" content="630">',
    '    <meta name="twitter:card" content="summary_large_image">',
    '    <meta name="twitter:title" content="' + p.title + '">',
    '    <meta name="twitter:description" content="' + p.desc + '">',
    '    <meta name="twitter:image" content="' + p.image + '">'
  ].join('\n');
}

let updated = 0;
let skipped = 0;

pages.forEach(p => {
  const filePath = path.join(base, p.file);

  if (!fs.existsSync(filePath)) {
    console.log('[MISSING] ' + p.file);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('og:type')) {
    console.log('[SKIP] ' + p.file + ' (already has og:type)');
    skipped++;
    return;
  }

  const ogBlock = buildOgBlock(p);

  // Strategy 1: insert after last hreflang link (x-default)
  let replaced = html.replace(
    /(<link rel="alternate" hreflang="x-default"[^>]*>)/,
    '$1\n' + ogBlock
  );

  // Strategy 2 (fallback): after meta description
  if (replaced === html) {
    replaced = html.replace(
      /(<meta name="description"[^>]*>)/,
      '$1\n' + ogBlock
    );
  }

  // Strategy 3 (fallback): after meta viewport
  if (replaced === html) {
    replaced = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      '$1\n' + ogBlock
    );
  }

  if (replaced === html) {
    console.log('[ERROR] No insertion point found: ' + p.file);
    return;
  }

  fs.writeFileSync(filePath, replaced, 'utf8');
  console.log('[OK] ' + p.file);
  updated++;
});

console.log('\nActualizados: ' + updated + ' | Saltados: ' + skipped);
