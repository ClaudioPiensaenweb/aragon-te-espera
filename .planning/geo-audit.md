# Auditoría GEO — aragonteespera.com

> Fecha: 2026-06-15
> GEO Score: 30/100 (Bajo)
> Tipo de negocio: Agencia receptiva / DMC local (turismo B2B en Aragón)

---

## Resumen ejecutivo

aragonteespera.com tiene presencia web funcional y una propuesta de valor clara dirigida a touroperadores internacionales, pero su visibilidad ante las IAs generativas es críticamente baja (30/100). Las razones principales son tres: el sitio es prácticamente invisible para los crawlers de IA porque el header, el footer y todo el contenido del blog se renderizan mediante JavaScript (las IAs ven páginas casi vacías); no existe ningún fichero `llms.txt` ni presencia en las plataformas que los modelos consultan para verificar entidades (Wikipedia, LinkedIn, Reddit); y el contenido actual —unos 150 palabras por página en media— es insuficiente para que ningún modelo lo cite como fuente.

La buena noticia es que la arquitectura de URL es limpia, los bots IA están técnicamente autorizados en robots.txt, y el esquema básico de TravelAgency ya existe. Las mejoras de mayor impacto no requieren rediseño: son de contenido, configuración y presencia de marca.

---

## Puntuaciones por dimensión

| Dimensión | Score | Peso | Estado |
|-----------|-------|------|--------|
| Citabilidad IA | 32/100 | 25% | Bajo |
| Autoridad de Marca | 10/100 | 20% | Crítico |
| Contenido E-E-A-T | 31/100 | 20% | Bajo |
| Técnico | 52/100 | 15% | Medio |
| Schema | 30/100 | 10% | Bajo |
| Plataformas | 32/100 | 10% | Bajo |
| **GEO Score total** | **30/100** | | **Bajo** |

---

## Hallazgos detallados

### Citabilidad IA (32/100)

**Qué mide:** ¿Pueden los modelos IA extraer y citar el contenido del sitio?

- **Crawlers IA permitidos** (95/100): GPTBot, ClaudeBot, PerplexityBot están autorizados vía robots.txt. Bien.
- **llms.txt** (0/100): No existe. Es el fichero que le dice a los modelos qué páginas citar y cuáles ignorar. Ausente = invisible por defecto.
- **Citabilidad del contenido** (32/100): Los bloques de texto tienen una media de 22 palabras (el rango óptimo para que las IAs citen es 134-167). No hay estadísticas con fuente, no hay definiciones del tipo "X es...", no hay citas de autoridad. El blog existe pero sus 20 artículos se cargan por JavaScript y los crawlers ven una parrilla vacía.
- **Menciones de marca** (10/100): Cero presencia en Wikipedia, Reddit, YouTube, LinkedIn. Los modelos IA no reconocen la entidad.

### Autoridad de Marca (10/100)

**Qué mide:** ¿Los modelos "conocen" esta marca desde su entrenamiento y fuentes externas?

- No hay artículo en Wikipedia ni entrada en Wikidata.
- No hay página de empresa en LinkedIn.
- No hay canal de YouTube ni vídeos asociados a la marca.
- No aparece en Reddit ni foros de viajes.
- No hay menciones en medios ni prensa turística.
- No hay logos de asociaciones, sellos de calidad o certificaciones de Turismo de Aragón.

> Esta es la dimensión más urgente a largo plazo: los modelos IA citan marcas que existen en su entrenamiento. Si la marca no está en ninguna plataforma, no existe para la IA.

### Contenido E-E-A-T (31/100)

**Qué mide:** ¿Demuestra el sitio experiencia real, pericia, autoridad y confianza?

- **Experience** (8/25): Se mencionan lugares reales de Aragón (Ordesa, Mallos de Riglos, DOs de Somontano y Cariñena) pero no hay casos de éxito, relatos de primera mano, ni datos originales.
- **Expertise** (7/25): No hay ningún nombre de guía, ninguna credencial, ninguna licencia. Los textos de servicios son descriptivos pero superficiales (~520 palabras en toda la página de servicios).
- **Authority** (6/25): Sin citas externas, sin menciones en medios, sin logos de clientes o partners.
- **Trust** (10/25): HTTPS activo. Pero: la política de privacidad y el aviso legal contienen texto de plantilla sin rellenar (incumplimiento legal). La página de contacto devuelve 404. No hay teléfono, email ni dirección visible en ninguna página del sitio.

> **Urgente legal:** La política de privacidad y el aviso legal tienen variables sin rellenar `[NOMBRE]`, `[DIRECCIÓN]`, etc. Esto incumple la Ley 34/2002 y el RGPD.

### Técnico (52/100)

**Qué mide:** ¿Puede Google y las IAs rastrear, entender y cargar bien el sitio?

**Bien:**
- URLs limpias sin extensión (.html)
- HTTPS activo
- Sitemap.xml presente con hreflang para español e inglés
- HTTP/3 (QUIC) habilitado
- Mobile: viewport correcto, layout responsive

**Crítico:**
- **Header y footer en JavaScript:** Todo el menú de navegación y el footer (contacto, legal, redes) se inyectan mediante JS. Los crawlers IA ven `<header id="main-header"></header>` vacío.
- **Blog en JavaScript:** Los 20 artículos del blog se cargan via fetch() a la API de Directus. Los crawlers ven una parrilla vacía.
- **Sin cabeceras de seguridad:** Faltan HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy.
- **Sin etiquetas Open Graph:** Redes sociales e IAs no obtienen imagen, título ni descripción al compartir.
- **Sin canonical:** Riesgo de contenido duplicado www/no-www.
- **Sin hreflang en `<head>`:** Solo está en el sitemap, no en las páginas. Google recomienda ambos.
- **Tailwind CDN:** Se carga el framework completo (~350KB) en lugar de una build de producción optimizada.
- **Sin preload del hero:** La imagen principal no tiene `fetchpriority="high"` ni preload, lo que penaliza el LCP.

### Schema (30/100)

**Qué mide:** ¿Tiene el sitio datos estructurados que los buscadores e IAs puedan leer?

- **Presente:** TravelAgency en homepage (nombre, descripción, URL, dirección parcial). BreadcrumbList y Service schemas en /servicios.
- **Falta en homepage:** telephone, image, logo, sameAs (perfiles sociales), postalCode, streetAddress.
- **Falta en todo el sitio:** WebSite con SearchAction, FAQPage, Person (para autores), Article/BlogPosting en noticias.
- **sameAs vacío:** Sin enlaces a Wikipedia, LinkedIn, Google Knowledge Graph.

### Plataformas (32/100)

**Qué mide:** ¿Está el contenido preparado para aparecer en respuestas de ChatGPT, Google AIO, Perplexity y Gemini?

| Plataforma | Score | Problema principal |
|------------|-------|-------------------|
| Google AI Overviews | 38/100 | Sin estructura pregunta-respuesta, sin FAQ schema |
| ChatGPT / Bing | 27/100 | Sin entidad reconocible, sin datos con fuente |
| Perplexity | 26/100 | Sin menciones comunitarias, sin datos primarios |
| Gemini | 31/100 | Sin YouTube, sin Google Business Profile |
| Bing Copilot | 30/100 | Sin IndexNow, sin Bing Webmaster Tools |

---

## Plan de acción (priorizado)

### Rápido — esta semana (alto impacto, bajo esfuerzo)

1. **Crear llms.txt** en la raíz del dominio con el mapa de páginas clave para los modelos IA. Cero desarrollo: solo crear el fichero y subirlo.

2. **Completar aviso legal y política de privacidad** rellenando las variables de plantilla. Es un riesgo legal activo (Ley 34/2002 + RGPD).

3. **Restaurar la página de contacto** (actualmente devuelve 404). Un B2B sin página de contacto funcional pierde conversiones y puntos de E-E-A-T.

4. **Añadir teléfono y email visibles** en el footer del HTML estático (no solo via JS de Directus).

5. **Crear página de empresa en LinkedIn** y enlazarla desde el footer. Impacto inmediato en ChatGPT y Bing Copilot.

### Medio plazo — 1-2 meses

6. **Renderizar header, footer y blog en HTML estático.** El cambio técnico más importante para GEO: mover el menú, el footer y los artículos recientes al HTML servido por el servidor, para que los crawlers los lean.

7. **Añadir Open Graph y Twitter Card** a todas las páginas (og:title, og:description, og:image).

8. **Añadir etiqueta canonical** en cada página.

9. **Añadir hreflang en el `<head>`** de cada página para es y en.

10. **Expandir schema en homepage:** Añadir telephone, image, logo, sameAs (LinkedIn, Google Maps), streetAddress y postalCode al TravelAgency.

11. **Añadir cabeceras de seguridad en nginx:** HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. Se hace en un bloque `add_header` en el nginx.conf.

12. **Publicar los primeros 3 artículos del blog** con estructura optimizada para IA: H2/H3 como preguntas, párrafo de respuesta directa de 40-60 palabras, mínimo 800 palabras, autoría visible.

### Estratégico — 3-6 meses

13. **Construir presencia de marca en plataformas citadas por IAs:** Ficha en TripAdvisor, Google Business Profile, menciones en foros de turismo profesional (ASTA, WTAAA), artículo en Wikipedia sobre turismo receptivo en Aragón.

14. **Crear canal de YouTube** con 3-5 vídeos de destino alineados con los servicios (Pirineos, Zaragoza, rutas del vino). Impacto directo en Gemini y Google AIO.

15. **Añadir FAQPage schema** en homepage y servicios con las 5-6 preguntas más habituales de touroperadores.

16. **Migrar Tailwind CDN a build de producción** para reducir el payload JS/CSS en más de un 90%.

---

## Checklist de los 10 items (geo-content-checklist.md)

| # | Item | Estado |
|---|------|--------|
| 1 | Bloques clave de 134-167 palabras | ❌ Media: 22 palabras |
| 2 | 5 estadísticas con fuente por cada 500 palabras | ❌ Ninguna |
| 3 | Autor identificado con credenciales | ❌ Ninguno |
| 4 | Schema JSON-LD: Organization + Article + Person | ⚠️ Solo TravelAgency básico |
| 5 | Meta description < 160 chars respondiendo una pregunta | ✅ Correcto |
| 6 | Headers H2/H3 como preguntas | ❌ Todos son títulos descriptivos |
| 7 | FAQ section con schema | ❌ Ausente |
| 8 | robots.txt permite GPTBot, ClaudeBot, PerplexityBot | ✅ Sí (herencia wildcard) |
| 9 | llms.txt en la raíz | ❌ 404 |
| 10 | Contenido sin jerga innecesaria | ✅ Lenguaje claro |

---

> Generado por piensa + geo-seo-claude · 2026-06-15
