# Briefing técnico — Aragón te espera

> Última actualización: 2026-06-15
> Estado: En desarrollo activo

---

## Contexto del proyecto

**Aragón te espera** es un portal web B2B de turismo receptivo en Aragón (España). Su objetivo
es conectar touroperadores y agencias internacionales con la oferta turística de Aragón:
visitas culturales, naturaleza y montaña, gastronomía y vino, y gestión logística de grupos.

El sitio opera en dos idiomas (ES en `/`, EN en `/en/`) con guías oficiales multilingües
(español, inglés, francés, alemán, italiano, portugués).

**URL producción:** https://aragonteespera.com
**CMS admin:** https://admin.aragonteespera.com (Directus 11)
**Repositorio:** git local en main, deploy automático via webhook Dokploy

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | HTML estático + vanilla JS |
| CMS | Directus 11 (headless, API REST) |
| Base de datos | PostgreSQL (gestionada por Directus) |
| Estilos | Tailwind CSS CDN + CSS variables de Directus |
| Animaciones | GSAP 3.12 + Lenis 1.0 |
| Iconos | Lucide |
| Servidor | Nginx en Docker (Dockerfile.web) |
| Deploy | Dokploy con webhook automático en push a main |
| CI/CD | GitHub Actions → webhook Dokploy |

**Arquitectura:** Sin paso de build. HTML puro servido directamente. Contenido dinámico
(blog, empresa, colores) cargado en runtime via `fetch()` a la API de Directus.

---

## Páginas actuales

### Versión ES
| Ruta | Archivo | Estado |
|---|---|---|
| / | public/index.html | Producción |
| /quienes-somos | public/quienes-somos.html | Producción |
| /servicios | public/servicios.html | Producción |
| /colabora | public/colabora.html | Producción |
| /noticias | public/blog.html | Producción |
| /noticias/[slug] | public/blog-single.html | Producción |
| /aviso-legal | public/aviso-legal.html | Producción |
| /politica-de-privacidad | public/politica-de-privacidad.html | Producción |
| /politica-de-cookies | public/politica-de-cookies.html | Producción |

### Versión EN
| Ruta | Archivo | Estado |
|---|---|---|
| /en/ | public/en/index.html | Producción |
| /en/about-us | public/en/about-us.html | Producción |
| /en/services | public/en/services.html | Producción |
| /en/collaborate | public/en/collaborate.html | Producción |
| /en/news | public/en/blog.html | Producción |
| /en/news/[slug] | public/en/blog-single.html | Producción |

---

## Sistema de contenidos (Directus)

**Colecciones API:**
- `empresa` — datos de contacto, logo, dirección, Google Maps, Kit Digital
- `posts` — artículos del blog (campos: title, content, slug, date_published,
  date_updated, featured_image, categories, language, status, translation_group)
- `categories` — categorías del blog
- `seo` — metadatos SEO por página (slug + language)

**Patrón de carga:** `fetch('https://admin.aragonteespera.com/items/[coleccion]')`
ejecutado en DOMContentLoaded desde `templates-es.js` / `templates-en.js`.

---

## GEO / SEO — Estado actual

**Schema Score:** 68/100 (antes de esta sesión: 8/100)

### Schemas implementados (commits 1c2a150 y ec10446)

| Página ES | Schemas |
|---|---|
| / | TravelAgency, WebSite, TouristDestination |
| /quienes-somos | AboutPage, BreadcrumbList |
| /servicios | BreadcrumbList, @graph [Service × 4] |
| /noticias/[slug] | BlogPosting + BreadcrumbList (JS runtime) |

Ídem en versión EN con URLs y textos en inglés.

### Pendientes GEO críticos
1. `sameAs` en TravelAgency — array vacío, pendiente de URLs reales
2. `Person` schema para guías — requiere perfiles en CMS
3. `speakable` en páginas estáticas (homepage, quienes-somos, servicios)
4. `telephone`, `email`, `streetAddress`, `postalCode` en TravelAgency

---

## Colecciones de marca Directus (estándar Piensaenweb)

- `estilo` — CSS variables (colores, fuentes, bordes)
- `empresa` — logo, favicon, datos de contacto, dirección, Kit Digital
- `seo` — metadatos por página (title, description, og:image, no_index)

---

## Deploy

**Flujo actual:**
1. Push a `main` en GitHub
2. GitHub Actions dispara webhook de Dokploy
3. Dokploy hace pull y reconstruye los contenedores Docker

**Dockerfile.web:** Nginx sirviendo `/public` como directorio raíz.
**No hay Dockerfile separado para Directus** en este repo — Directus corre en su
propio servicio en Dokploy.

---

## Restricciones conocidas

- Sin Node.js en el frontend — HTML puro, sin build step
- Tailwind via CDN (no purge, no JIT local)
- El blog es 100% client-rendered — schemas de artículos son JS-injected
- El logo está en `/marca/aragon-te-espera-logo.png` (no en `/img/`)
- La versión EN debe mantenerse siempre en paralelo con la ES
