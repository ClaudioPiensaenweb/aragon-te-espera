# ROADMAP — Aragón te espera

> Última actualización: 2026-06-15
> Schema Score actual: 68/100

---

## Fase 1 — GEO / Structured Data
> Objetivo: llevar el Schema Score de 68 a 85+/100

### T-001 [mejora] Rellenar sameAs en TravelAgency con URLs reales
- **Estado:** [pending]
- **Archivos:** public/index.html, public/quienes-somos.html, public/en/index.html, public/en/about-us.html
- **Descripción:** El array `sameAs` está declarado vacío en los schemas TravelAgency.
  Hay que añadir las URLs reales: Google Business Profile, LinkedIn, Instagram, Facebook,
  TripAdvisor y cualquier otro perfil verificable de la agencia.
- **Impacto:** +15 puntos en Schema Score. Acción de mayor retorno GEO.
- **Dependencias:** ninguna

### T-002 [mejora] Añadir speakable a páginas estáticas
- **Estado:** [pending]
- **Archivos:** public/index.html, public/quienes-somos.html, public/servicios.html,
  public/en/index.html, public/en/about-us.html, public/en/services.html
- **Descripción:** Añadir propiedad `speakable` con `cssSelector` apuntando a `h1` y
  primer párrafo descriptivo en los schemas de las páginas estáticas principales.
  Actualmente solo existe en BlogPosting via JS.
- **Impacto:** +4 puntos en Schema Score.
- **Dependencias:** ninguna

### T-003 [mejora] Completar datos de contacto en TravelAgency
- **Estado:** [pending]
- **Archivos:** public/index.html, public/en/index.html
- **Descripción:** Añadir `telephone`, `email`, `streetAddress` y `postalCode` al schema
  TravelAgency una vez confirmados los datos reales. Necesario para LocalBusiness
  rich results en Google.
- **Impacto:** Mejora elegibilidad rich results LocalBusiness.
- **Dependencias:** T-001 (confirmar datos al mismo tiempo que sameAs)

### T-004 [feature] Implementar Person schema para guías/equipo
- **Estado:** [pending]
- **Archivos:** public/quienes-somos.html, public/en/about-us.html + CMS Directus
- **Descripción:** Crear schema `Person` para los guías oficiales o equipo de la agencia.
  Requiere: (1) crear colección `equipo` en Directus con campos name, jobTitle, photo,
  linkedin, languages; (2) cargar los datos en quienes-somos y añadir schema Person.
- **Impacto:** +15 puntos en Schema Score. Señal E-E-A-T para LLMs.
- **Dependencias:** Cambio en CMS Directus previo

---

## Fase 2 — SEO técnico y rendimiento
> Objetivo: mejorar Core Web Vitals y señales técnicas de SEO

### T-005 [mejora] Migrar Tailwind CSS de CDN a build local
- **Estado:** [pending]
- **Archivos:** todos los HTML + añadir paso de build
- **Descripción:** Tailwind CDN carga todo el framework (~350KB). Un build local con
  purge reduciría el CSS a ~5-15KB. Requiere introducir un paso de build (npm + vite
  o tailwind CLI) y actualizar el Dockerfile.web.
- **Impacto:** Mejora significativa en LCP y Core Web Vitals.
- **Dependencias:** ninguna (pero es un cambio de arquitectura — valorar con el cliente)

### T-006 [mejora] Añadir meta OG completo a todas las páginas
- **Estado:** [pending]
- **Archivos:** todos los HTML
- **Descripción:** Verificar que todas las páginas tienen og:title, og:description,
  og:image, og:type, og:url, twitter:card. Actualmente los meta vienen del sistema
  de SEO de Directus pero no se ha auditado la cobertura completa.
- **Impacto:** Mejora apariencia en redes sociales y señales para LLMs.
- **Dependencias:** ninguna

### T-007 [mejora] Añadir hreflang ES/EN en todas las páginas
- **Estado:** [pending]
- **Archivos:** todos los HTML (ES y EN)
- **Descripción:** Añadir `<link rel="alternate" hreflang="es" href="...">` y
  `<link rel="alternate" hreflang="en" href="...">` en el `<head>` de todas las páginas.
  Crítico para que Google indexe correctamente las versiones bilingües.
- **Impacto:** Evita canibalización entre versiones ES y EN en Google.
- **Dependencias:** ninguna

### T-008 [mejora] Implementar sitemap.xml bilingüe
- **Estado:** [pending]
- **Archivos:** public/sitemap.xml (nuevo)
- **Descripción:** Generar sitemap.xml con todas las URLs del sitio (ES + EN) incluyendo
  alternates hreflang. Para el blog, el sitemap debe generarse dinámicamente o
  actualizarse al publicar un artículo.
- **Impacto:** Mejora indexación y descubrimiento de contenido por crawlers.
- **Dependencias:** T-007

---

## Fase 3 — Contenido y GEO avanzado
> Objetivo: aumentar citabilidad en motores de IA

### T-009 [feature] Crear página /destinos con TouristAttraction schemas
- **Estado:** [pending]
- **Archivos:** public/destinos.html (nuevo), public/en/destinations.html (nuevo)
- **Descripción:** Página que liste los principales atractivos turísticos de Aragón
  (Ordesa, La Alhambra de Teruel, Zaragoza, Pirineos...) con schema `TouristAttraction`
  para cada uno, enlazados con sus Wikidata IDs.
- **Impacto:** Alta visibilidad GEO para búsquedas sobre destinos en Aragón.
- **Dependencias:** T-004 (tener base GEO sólida primero)

### T-010 [feature] Página de equipo con Person schemas
- **Estado:** [pending]
- **Archivos:** public/equipo.html (nuevo), public/en/team.html (nuevo)
- **Descripción:** Página dedicada al equipo de guías con foto, idiomas, especialidad
  y links a perfiles sociales. Cada guía con schema `Person` completo.
- **Impacto:** E-E-A-T máximo para LLMs — personas reales verificables.
- **Dependencias:** T-004 (colección equipo en Directus)

### T-011 [feature] Blog SSR o generación estática de artículos
- **Estado:** [pending]
- **Archivos:** arquitectura a definir
- **Descripción:** El blog actual es 100% client-rendered. Los schemas BlogPosting
  son invisibles para GPTBot, ClaudeBot y PerplexityBot. Evaluar: (A) migrar a Astro
  con SSG, o (B) añadir endpoint en Directus que sirva el schema en el HTML inicial.
- **Impacto:** Hace artículos visibles para todos los crawlers de IA.
- **Dependencias:** Decisión de arquitectura — valorar con cliente

---

## Completadas en sesión 2026-06-15

### T-C01 [mejora] Auditoría inicial de schema markup
- **Estado:** [done]
- **Descripción:** Auditoría de schemas en /, /quienes-somos, /servicios.
  Score inicial: 8/100.

### T-C02 [mejora] Implementar schemas JSON-LD completos ES
- **Estado:** [done]
- **Commit:** 1c2a150
- **Descripción:** TravelAgency completo, WebSite, TouristDestination en homepage.
  AboutPage + BreadcrumbList en quienes-somos. BreadcrumbList + 4×Service en servicios.
  BlogPosting dinámico en blog-single.

### T-C03 [mejora] Implementar schemas JSON-LD EN (espejo)
- **Estado:** [done]
- **Commit:** 1c2a150
- **Descripción:** Espejo completo de schemas ES adaptado a inglés en 4 páginas EN.

### T-C04 [fix] Corregir URL del logo en schemas
- **Estado:** [done]
- **Commit:** ec10446
- **Descripción:** Logo apuntaba a archivo inexistente (.svg). Corregido a
  /marca/aragon-te-espera-logo.png verificado en disco.

### T-C05 [mejora] Validación JSON-LD de todos los schemas
- **Estado:** [done]
- **Descripción:** 14/14 bloques estáticos sin errores. 2 scripts JS sin errores de sintaxis.
