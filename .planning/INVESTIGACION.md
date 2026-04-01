# Investigacion — Equivalente a Google Site Kit para Directus CMS

> Generado por piensa researcher — 2026-03-18

---

## Pregunta de investigacion

Existe algun plugin, extension o modulo para Directus CMS equivalente al "Site Kit" de Google
para WordPress, que integre en el panel de administracion:
- Google Analytics (metricas de visitas, paginas vistas, etc.)
- Google Search Console (rendimiento en busquedas, keywords)
- Google Tag Manager
- PageSpeed Insights

---

## Conclusion ejecutiva

**No existe un equivalente directo a Google Site Kit para Directus.**

No hay ninguna extension oficial ni comunitaria que integre en un solo plugin las cuatro
funcionalidades de Site Kit (GA4 + Search Console + GTM + PageSpeed) dentro del panel de
Directus. La razon tecnica principal es que Google bloquea el iframe de su interfaz de Analytics
mediante cabeceras `X-Frame-Options: SAMEORIGIN`, por lo que no se puede embeber la UI de
Google directamente.

Lo que si existe son soluciones parciales y workarounds que, combinados, cubren parte
de esta necesidad.

---

## Estado del ecosistema Directus para analytics

### Marketplace oficial de Directus

El Marketplace de Directus usa npm como fuente de datos (keyword `directus-extension`).
Tiene busqueda, filtrado y listas de seguridad. Se accede desde el propio Data Studio.
URL: https://directus.io/extensions

Directorios de terceros:
- https://www.dirextensions.com/ — directorio comunitario independiente

---

## Extensiones existentes — Analisis detallado

### 1. Plausible Analytics Bundle (oficial Directus Labs)

| Campo         | Valor |
|---------------|-------|
| Paquete npm   | `@directus-labs/plausible-analytics-bundle` |
| Autor         | Directus Labs (oficial) |
| Ultima version | 1.0.0 |
| Compatible con | Directus v10.10.0+ |
| Estado        | ADVERTENCIA: sin actualizaciones hace ~1 año |
| Descargas npm | 3.300 totales |
| URL           | https://directus.io/extensions/@directus-labs/plausible-analytics-bundle |

**Que hace:**
- Embebe el dashboard de Plausible Analytics dentro del panel de Directus
- Proporciona un componente Interface (en la vista de item/formulario)
- Proporciona un componente Panel (en los dashboards de Insights)
- Permite filtrar por URL especifica para ver metricas de una pagina concreta
- Requiere una cuenta en Plausible y generar un "shared link URL"

**Que NO hace:**
- No integra Google Analytics
- No integra Google Search Console
- No integra PageSpeed ni GTM
- Plausible es una alternativa de pago a GA (desde 9 EUR/mes)

**Veredicto:** Util si ya usas Plausible, pero no cubre Google. Poco mantenido.

---

### 2. Directus Extension Umami

| Campo         | Valor |
|---------------|-------|
| Repositorio   | https://github.com/egidiusmengelberg/directus-extension-umami |
| Autor         | Comunidad (egidiusmengelberg) |
| Ultima version | v1.0.5 — 12 marzo 2024 |
| Stars GitHub  | 6 |
| Estado        | Activo pero niche, 5 PRs abiertas |
| Licencia      | MIT |

**Que hace:**
- Inyecta el script de tracking de Umami en el panel de Directus
- Configuracion por variables de entorno (script src, website ID, dominio, cache)
- Soporta directivas CSP automaticamente
- Umami es open source y self-hosteable (alternativa a GA)

**Que NO hace:**
- No muestra un dashboard de metricas dentro de Directus
- Solo inyecta el tag de tracking — los datos se ven en la interfaz de Umami
- No integra Google

**Veredicto:** Sirve para trackear el propio panel de Directus con Umami. No es lo que se busca.

---

### 3. SEO Plugin (oficial Directus Labs)

| Campo         | Valor |
|---------------|-------|
| Paquete npm   | `@directus-labs/seo-plugin` |
| Autor         | Directus Labs (ukmadlz) |
| Descargas ultimo año | 33.600 |
| Ultima actualizacion | hace ~9 meses |
| URL marketplace | https://directus.io/extensions/@directus-labs/seo-plugin |

**Que hace:**
- Gestion de metadatos SEO: titulo, meta description, OG image, canonical
- Preview de como se ve en Google y redes sociales
- Analisis de keyphrase principal (densidad en titulo, descripcion, slug, contenido)
- Configuracion de sitemap (frecuencia, prioridad)
- Campos no-index, no-follow

**Que NO hace:**
- No conecta con Google Search Console
- No muestra datos de trafico ni posicionamiento real
- No integra PageSpeed Insights
- No tiene conexion con ninguna API de Google

**Veredicto:** Excelente para gestionar metadatos SEO on-page, pero no es un panel de metricas.
Ya esta instalado en proyectos de este tipo. Recomendado.

---

### 4. Directus SEO Extension (Codihaus)

| Campo         | Valor |
|---------------|-------|
| Repositorio   | https://github.com/codihaus/directus-extension-seo |
| Stars GitHub  | 23 |
| Ultima actualizacion | julio 2024 |
| Estado        | Poco activo |

**Que hace:**
- Scoring SEO con validador
- AI SEO via ChatGPT para sugerencias automaticas
- Wizard de configuracion

**Que NO hace:**
- No integra Google Search Console, GA4, ni PageSpeed

**Veredicto:** Alternativa al SEO Plugin oficial pero con menos traccion y mantenimiento.

---

### 5. inFrame Module (Devix Tecnologia)

| Campo         | Valor |
|---------------|-------|
| Directorio    | https://www.dirextensions.com/details/directus-extension-inframe/ |
| Repositorio   | github.com/devix-tecnologia/directus-extension-inframe |
| Ultima actualizacion | hace ~1 mes |
| Estado        | Activo |

**Que hace:**
- Permite embeber URLs externas en iframes dentro del panel de Directus como modulo
- Soporta navegacion persistente, organizacion en carpetas, iconos Material Design
- Plug-and-play, sin configuracion manual
- Pensado para Power BI, Tableau, Metabase o cualquier herramienta BI

**Limitaciones criticas para Google:**
- Google Analytics bloquea el iframe con `X-Frame-Options: SAMEORIGIN` — NO embebible
- Google Search Console bloquea el iframe — NO embebible
- PageSpeed Insights (web.dev) — posiblemente bloqueable
- Looker Studio SI soporta embedding via iframe (con configuracion)

**Veredicto:** NO sirve para Google Analytics ni Search Console directamente.
SI podria funcionar para embeber un reporte de Looker Studio (ver seccion de workarounds).

---

### 6. Directus Usage Analytics (interno)

| Campo         | Valor |
|---------------|-------|
| Directorio    | https://www.dirextensions.com/details/directus-extension-usage-analytics/ |
| Ultima actualizacion | hace ~2 meses |

**Que hace:**
- Analiza el uso interno del propio Directus: filas por coleccion, operaciones CRUD, trafico por IP
- Lee de la tabla `directus_activity`

**Relevancia:** Ninguna para el caso de uso. Es monitoreo interno, no analitica web.

---

## Limitacion tecnica fundamental

La razon por la que no existe un "Site Kit para Directus" es tecnica:

1. **Google Analytics UI**: Google bloquea su interfaz con `X-Frame-Options: SAMEORIGIN`.
   No se puede embeber en ningun iframe externo. Punto.

2. **Google Search Console**: Mismo bloqueo. La interfaz no es embebible.

3. **Google Tag Manager**: No tiene UI de metricas — solo gestiona tags. Se configura
   en el frontend, no en el CMS.

4. **PageSpeed Insights**: La interfaz de web.dev/pagespeed puede tener restricciones,
   pero la API es publica y se puede consumir.

Esta es una diferencia fundamental con WordPress: Site Kit usa la Google Data API
para extraer datos y renderizarlos con su propio UI, no embebiendo la interfaz de Google.
Construir algo equivalente para Directus requeriria desarrollo custom.

---

## Workarounds que usa la comunidad

### Workaround A — Looker Studio (Google Data Studio) embebido via inFrame

Looker Studio SI permite embedding por iframe (es su caso de uso oficial).
Se puede crear un reporte en Looker Studio que conecte con:
- Google Analytics 4
- Google Search Console
- Cualquier fuente de Google

Y luego embeber ese reporte dentro de Directus usando la extension inFrame o un
panel personalizado.

**Pasos:**
1. Crear reporte en Looker Studio conectando GA4 + Search Console
2. Activar "Compartir > Embeber informe" en Looker Studio
3. Instalar `directus-extension-inframe` en Directus
4. Configurar CSP en docker-compose: `CONTENT_SECURITY_POLICY_DIRECTIVES__FRAME_SRC`
5. Añadir la URL del reporte embebido

**Limitaciones:**
- No es nativo — el usuario sale visualmente del contexto de Directus
- Looker Studio requiere cuenta Google
- Los datos no estan en el sistema de Insights de Directus

**Madurez:** Workaround funcional, no elegante. Usado por la comunidad.

---

### Workaround B — Panel personalizado con Google Analytics Data API

Construir un panel de Directus (Vue 3) que llame a la Google Analytics Data API v1
y renderice los datos con charts nativos.

**Stack necesario:**
- Extension tipo "bundle" (endpoint backend + panel frontend)
- Google Analytics Data API: `@google-analytics/data`
- OAuth 2.0 o Service Account para autenticacion
- Charts: ApexCharts o Chart.js (ya disponibles en el ecosistema Directus)

**Esfuerzo estimado:** 2-4 dias de desarrollo para un MVP funcional.
**Madurez:** No existe como extension publicada — hay que construirlo.

---

### Workaround C — Panel con Search Console API

Similar al anterior pero usando la Google Search Console API.
La API esta documentada y es publica (requiere OAuth).

**Esfuerzo estimado:** 2-3 dias adicionales a los del workaround B.

---

### Workaround D — PageSpeed Insights via API publica

PageSpeed Insights tiene una API completamente publica sin autenticacion obligatoria:
`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=URL`

Es la mas facil de implementar como panel de Directus porque:
- No requiere OAuth
- Devuelve JSON estructurado (score, metricas Core Web Vitals, oportunidades)
- Se puede hacer desde un panel frontend directamente

**Esfuerzo estimado:** 1 dia de desarrollo.

---

### Workaround E — Modificar CSP para inyectar script de GA en el panel de Directus

Para tener tracking de GA4 sobre el propio uso del panel de Directus:

```
CONTENT_SECURITY_POLICY_DIRECTIVES__SCRIPT_SRC='self' 'unsafe-eval' https://www.googletagmanager.com
CONTENT_SECURITY_POLICY_DIRECTIVES__IMG_SRC='self' data: blob: https://www.google-analytics.com
CONTENT_SECURITY_POLICY_DIRECTIVES__CONNECT_SRC='self' https://www.google-analytics.com https://analytics.google.com
```

Documentado en la discusion de la comunidad: https://github.com/directus/directus/discussions/13171

**Nota:** Esto trackea el uso del CMS, no el sitio publico.

---

## Tabla resumen de soluciones

| Solucion | GA4 | Search Console | PageSpeed | GTM | Nativo Directus | Esfuerzo | Estado |
|----------|-----|----------------|-----------|-----|-----------------|----------|--------|
| Plausible Bundle (oficial) | No (alternativa) | No | No | No | Si (panel + interface) | Cero | Poco mantenido |
| SEO Plugin (oficial) | No | No | No | No | Si (interface) | Cero | Activo |
| inFrame + Looker Studio | Via reporte | Via reporte | No | No | Modulo iframe | Bajo | Activo |
| Panel custom GA4 API | Si | No | No | No | Si (panel nativo) | Medio (2-4d) | A construir |
| Panel custom Search Console API | No | Si | No | No | Si (panel nativo) | Medio (2-3d) | A construir |
| Panel custom PageSpeed API | No | No | Si | No | Si (panel nativo) | Bajo (1d) | A construir |
| CSP + GTM script | No | No | No | Si (tracking) | Configuracion | Minimo | Documentado |

---

## Recomendacion para este proyecto

Dado el contexto del proyecto (portal de turismo Aragon Te Espera con Directus):

### Inmediato — Sin desarrollo

1. **Instalar `@directus-labs/seo-plugin`** si no esta ya — cubre SEO on-page en el CMS.
2. **Crear reporte en Looker Studio** conectando GA4 + Search Console y embeber
   en Directus con `directus-extension-inframe`. Soluciona el 80% de la necesidad
   con 0 codigo.

### Medio plazo — Desarrollo custom (si se justifica)

3. **Panel PageSpeed Insights** — El mas rapido de construir (API publica, ~1 dia).
   Muy util para un portal de turismo donde el rendimiento movil importa.
4. **Panel GA4** — Requiere Service Account de Google. ~3 dias para MVP con metricas
   basicas (sesiones, usuarios, paginas mas vistas).

### No recomendado

- Intentar embeber la interfaz de Google Analytics directamente — bloqueado tecnicamente.
- Usar la extension de Umami si el stack de analitica es Google.
- Invertir en construir los 4 paneles a la vez — alto coste, bajo retorno vs Looker Studio.

---

## Fuentes consultadas

- https://directus.io/extensions — Marketplace oficial Directus
- https://github.com/directus-labs/extensions — Repo de extensiones de Directus Labs
- https://github.com/directus-labs/awesome-directus — Lista curada de extensiones
- https://www.dirextensions.com/ — Directorio comunitario de extensiones
- https://github.com/directus/directus/discussions/13171 — Discusion GA en Directus
- https://github.com/egidiusmengelberg/directus-extension-umami — Extension Umami
- https://github.com/codihaus/directus-extension-seo — Extension SEO Codihaus
- https://developers.google.com/looker-studio/integrate/embed — Docs embedding Looker Studio
- https://npmjs.com/package/@directus-labs/plausible-analytics-bundle — Plausible bundle npm
