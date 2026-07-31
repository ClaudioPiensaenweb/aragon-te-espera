# Estado del Proyecto — Aragón te espera

> Última actualización: 2026-07-31 por AndresBernad
> Handoff preparado: sí

---

## Fase actual

**Fase 1** — GEO / Structured Data

---

## Progreso

[=====···············] 31% (5/16 tareas)

- **Completadas**: 5 (T-C01 a T-C05, todas en sesión 2026-06-15)
- **En progreso**: 0
- **Pendientes**: 11 (T-001 a T-011)
- **Bloqueadas**: 0

---

## Qué se hizo (sesiones anteriores y esta)

- ✓ T-C01 Auditoría inicial de schema markup (score inicial: 8/100)
- ✓ T-C02 Schemas JSON-LD ES completos (commit 1c2a150)
- ✓ T-C03 Schemas JSON-LD EN espejo (commit 1c2a150)
- ✓ T-C04 Corregir URL logo en schemas (commit ec10446)
- ✓ T-C05 Validación JSON-LD — 14/14 schemas OK

**Fixes adicionales desplegados (2026-07-31):**
- ✓ Blog-single ES: corregido crash por `meta[name="description"]` nulo que impedía cargar artículos (commits 0236e7f, af3a8ed)
- ✓ Blog-single EN: mismo fix aplicado (commit 3485ae4)
- ✓ Tamaño `.titulo-hero` y `.titulo-1` en móvil (≤767px) → 28px — actualizado en Directus `estilo` (no requirió deploy)
- ✓ Fechas del blog actualizadas en Directus: 9 pares ES/EN distribuidos de enero a junio 2026, último el 14 jun 2026
- ✓ Banner cookies: centrado en móvil corregido (transform: none en breakpoint)
- ✓ Nginx: security headers + gzip añadidos
- ✓ `llms.txt` creado en raíz (visibilidad ante crawlers IA)
- ✓ Textos acordeones EN /services actualizados (gestión integral + senderismo)
- ✓ Cookie banner: "Aceptar todas" → "Aceptar" / "Accept all" → "Accept"
- ✓ Compose duplicado en Dokploy eliminado

---

## Qué falta (siguiente)

- ▸ **T-001** Rellenar `sameAs` en TravelAgency — necesita URLs reales del cliente (Google Business, LinkedIn, Instagram, Facebook, TripAdvisor). **Mayor impacto GEO: +15 pts.**
- ▸ **T-002** Añadir `speakable` a páginas estáticas — implementable ahora, sin dependencias (~30 min)
- ▸ **T-007** Añadir hreflang ES/EN en todas las páginas — implementable ahora, sin dependencias

---

## Notas del dev saliente

> Autor: AndresBernad
> Fecha: 2026-07-31

**Deploy:** Dokploy + Docker en `185.14.58.119`. Push a `main` → rebuild automático. Autodeploy activo.

**Directus:** `https://admin.aragonteespera.com` — token API: `aragon-admin-token`. La colección `estilo` controla todas las tipografías y colores del sitio. El archivo `dynamic-styles.js` las inyecta como CSS variables al cargar la página — **los cambios de fuentes se hacen en Directus, no en style.css**.

**Blog:** Las noticias se cargan 100% desde la API de Directus en runtime (client-rendered). Los schemas BlogPosting los genera JS, por lo que **los crawlers de IA no los ven** — esto es T-011 (SSR/SSG, decisión de arquitectura pendiente).

**Pendiente de cliente:**
- URLs reales de perfiles sociales → T-001
- Teléfono, email y dirección postal → T-003
- Decisión sobre colección `equipo` en Directus → T-004

**Pendiente de servidor (ver `.planning/pendiente-servidor.md`):**
- El proxy de `admin.aragonteespera.com` apunta al puerto 8057 (incorrecto) — debería ser 8061. El SEO dashboard da "Failed to fetch" hasta que se corrija en Plesk.
- Hay archivos temporales de migración en Plesk httpdocs: `mig_db_x7k2p9q.sql` y `mig_uploads_x7k2p9q.tar.gz` — **borrar cuando se resuelva la migración a Dokploy**.
- PM2 save pendiente para persistir Directus tras reinicio del servidor.

---

## Comandos útiles

- `/piensa:continuar` — retomar el proyecto con todo el contexto
- `/piensa:estado` — ver estado detallado
- `/piensa:desarrollar` — empezar con la siguiente tarea
