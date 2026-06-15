# Aragón te espera

## Reglas del proyecto

### Las 3 reglas de oro
1. `.planning/` NUNCA va en `.gitignore` — es lo que permite que cualquiera continúe el proyecto
2. Actualizar `estado.md` antes de cada push — es el archivo más importante para el traspaso
3. Commits separados: docs (.planning/) y código van en commits distintos

### Convenciones
- Commits: `tipo: descripcion en imperativo` (feat, fix, docs, style, refactor, chore)
- Ramas: `feature/descripcion-corta` desde main
- Idioma: español

### Stack
- Frontend: HTML estático + vanilla JS en `public/`
- CMS: Directus 11 en `https://admin.aragonteespera.com`
- Estilos: Tailwind CSS via CDN + CSS variables de Directus
- Animaciones: GSAP + Lenis
- Iconos: Lucide
- Deploy: Docker + Dokploy (webhook automático en push a main)
- Bilingüe: ES (`/`) y EN (`/en/`) con templates JS separados

### Estructura de archivos clave
- `public/` — HTML estático servido directamente
- `public/js/templates-es.js` — header, footer y lógica ES
- `public/js/templates-en.js` — header, footer y lógica EN
- `public/css/style.css` — estilos globales
- `public/marca/` — logo e identidad visual
- `public/img/` — imágenes del sitio
- `nginx/` — configuración del servidor
- `Dockerfile.web` — imagen Docker del frontend

### Reglas específicas de este proyecto
- Siempre editar ES y EN en paralelo cuando se toca una página
- JSON-LD en `<head>` estático — nunca inyectado por JS salvo blog-single
- El logo está en `/marca/aragon-te-espera-logo.png` (no en /img/)
- `sameAs` en TravelAgency pendiente de rellenar con URLs reales
- Contenido del blog cargado desde API Directus en runtime

### Comandos piensa
- `/piensa:estado` — ver progreso del proyecto
- `/piensa:handoff` — preparar proyecto para pasar a otro dev
- `/piensa:continuar` — retomar proyecto donde lo dejó otro
- `/piensa:desarrollar` — implementar siguiente tarea
- `/geo-schema` — auditoría de schema markup
- `/geo-audit` — auditoría GEO completa
