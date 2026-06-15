# Estado del Proyecto — Aragón te espera

> Última actualización: 2026-06-15
> Modo activo: GEO / SEO

---

## Progreso general

[=====···············] 31% (5/16 tareas)

- **Tareas totales**: 16
- **Completadas**: 5 (T-C01 a T-C05)
- **En progreso**: 0
- **Pendientes**: 11 (T-001 a T-011)
- **Bloqueadas**: 0

---

## Progreso por fase

### Fase 1 — GEO / Structured Data
[············] 0/4 completadas
- Tareas: 0/4 completadas
- Estado: pendiente

### Fase 2 — SEO técnico y rendimiento
[············] 0/4 completadas
- Tareas: 0/4 completadas
- Estado: pendiente

### Fase 3 — Contenido y GEO avanzado
[············] 0/3 completadas
- Tareas: 0/3 completadas
- Estado: pendiente

### Completadas sesión 2026-06-15
[============] 5/5 completadas
- Tareas: 5/5 completadas
- Estado: completada

---

## Tarea actual

▸ Siguiente: **T-001** [mejora] Rellenar sameAs en TravelAgency con URLs reales

- **Archivos:** public/index.html, public/quienes-somos.html, public/en/index.html, public/en/about-us.html
- **Acción:** Añadir URLs reales (Google Business Profile, LinkedIn, Instagram, Facebook, TripAdvisor) al array sameAs
- **Impacto estimado:** +15 puntos Schema Score (68 → 83)

---

## Tareas por etiqueta

### [mejora]
- ✓ T-C01 Auditoría inicial de schema markup
- ✓ T-C02 Implementar schemas JSON-LD ES
- ✓ T-C03 Implementar schemas JSON-LD EN
- ✓ T-C05 Validación JSON-LD
- ○ T-001 Rellenar sameAs con URLs reales
- ○ T-002 Añadir speakable a páginas estáticas
- ○ T-003 Completar datos de contacto en TravelAgency
- ○ T-005 Migrar Tailwind CDN a build local
- ○ T-006 Añadir meta OG completo
- ○ T-007 Añadir hreflang ES/EN

### [fix]
- ✓ T-C04 Corregir URL logo en schemas

### [feature]
- ○ T-004 Person schema para guías/equipo
- ○ T-008 Implementar sitemap.xml bilingüe
- ○ T-009 Página /destinos con TouristAttraction schemas
- ○ T-010 Página de equipo con Person schemas
- ○ T-011 Blog SSR o generación estática

---

## Actividad reciente

| Fecha | Tarea | Fase | Acción |
|---|---|---|---|
| 2026-06-15 | T-C05 | 0 | Completada — 14/14 schemas válidos |
| 2026-06-15 | T-C04 | 0 | Completada — logo corregido (commit ec10446) |
| 2026-06-15 | T-C03 | 0 | Completada — schemas EN implementados (commit 1c2a150) |
| 2026-06-15 | T-C02 | 0 | Completada — schemas ES implementados (commit 1c2a150) |
| 2026-06-15 | T-C01 | 0 | Completada — auditoría inicial, score 8/100 |

---

## Bloqueadores

- **T-001** necesita las URLs reales de perfiles sociales de la agencia — pendiente de cliente
- **T-003** necesita teléfono, email y dirección completa — pendiente de cliente
- **T-004** requiere decisión sobre si crear colección `equipo` en Directus

---

## Próximos pasos sugeridos

1. **T-001** — Pedir al cliente las URLs de sus perfiles (Google Business, LinkedIn, Instagram, Facebook). Sin esto el impacto GEO es limitado.
2. **T-002** — Implementable ahora sin dependencias (30 min).
3. **T-007** — Añadir hreflang ES/EN — implementable ahora sin dependencias.
4. **T-006** — Auditar meta OG — implementable ahora sin dependencias.
5. Valorar con el cliente **T-011** (SSR blog) antes de invertir tiempo en T-009/T-010.
