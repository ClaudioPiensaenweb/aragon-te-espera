# Pendiente — Servidor producción (actualizado 2026-06-04)

## ✅ Resuelto
- Directus caído → arrancado via PM2 en puerto **8061**
- Puerto 8057 ocupado por Directus de otro cliente (victorfornies.com) → cambiado PORT en `.env`

---

## 🔴 Pendiente crítico

### 1. Actualizar proxy de `admin.aragonteespera.com` → puerto 8061
- **Problema:** proxy apunta al puerto `8057` (Directus de otro cliente → CORS devuelve `victorfornies.com`)
- **Solución:** Panel de Plesk → Dominios → `admin.aragonteespera.com` → Configuración Apache/nginx
  - Cambiar: `ProxyPass / http://127.0.0.1:8057/` → `http://127.0.0.1:8061/`
  - Lo mismo en `ProxyPassReverse`
- **Impacto:** SEO dashboard sigue roto ("Failed to fetch") hasta que se corrija

### 2. PM2 save — persistir Directus tras reinicio
- **Solución:**
  ```bash
  # Conectar al servidor y ejecutar:
  pm2 save
  pm2 startup  # copiar y ejecutar el comando que genera
  ```

---

## 🟠 Migración a Dokploy — BLOQUEADA

### Estado: compose.yml preparado, deploy falla

**Lo que se ha hecho:**
- Repo `ClaudioPiensaenweb/aragon-te-espera` puesto en **público**
- `compose.yml` creado para Dokploy con Traefik labels, dos routers para web/www, directus en 8055
- Compose registrado en Dokploy (composeId: `ilK0PtYhYLW9d69dRFeBi`, appName: `compose-connect-virtual-bus-8a1i3o`)
- Dos deploys exitosos históricos (07:27 y 07:31 del 04/06) con imágenes cacheadas

**El bloqueo:**
- El git clone desde Dokploy falla siempre — tanto SSH como HTTPS
- Todos los deploys actuales retornan `error` inmediatamente
- Sin SSH al servidor Dokploy (185.14.58.119) no se puede diagnosticar
- Sin credenciales del panel Dokploy (`http://185.14.58.119:3000`) no se pueden ver los logs

**Para desbloquear — REQUIERE:**
1. **Credenciales del panel Dokploy** (`http://185.14.58.119:3000`) → ver logs del deploy fallido
2. **O acceso SSH a 185.14.58.119** → diagnosticar directamente el error del git clone
3. Si el error es de red/firewall: contactar con el hosting de Dokploy

**Qué tiene el repo listo para cuando se resuelva:**
- `compose.yml` para producción (en rama `main`, commit `68f06d1`)
- Traefik labels correctos (dos routers: `aragon-web` para aragonteespera.com, `aragon-web-www` para www)
- Directus en `11.5.0` sin extensión (el SEO plugin necesita revisión de compatibilidad con pnpm en ese tag)
- Postgres expuesto en 15432 temporalmente para restaurar el dump
- Dump de BD y uploads listos en Plesk: `https://aragonteespera.com/mig_db_x7k2p9q.sql` y `mig_uploads_x7k2p9q.tar.gz` (**eliminar cuando se migre**)

---

## 🟡 Pendiente secundario

### Puerto hardcodeado en servidor compartido
- Puerto 8061 es el primero libre (8055-8060, 8080 ocupados)
- Documentar en `.env` y `ecosystem.config.cjs` como definitivo

### Directus 35 versiones por detrás
- Versión actual: `11.5.0` → última: `11.17.4`
- No urgente, planificar actualización

---

## Contexto técnico
- **Servidor Plesk:** `185.14.57.159` | usuario: `aragonteespera.com_b9dga3699f`
- **Directus:** `/var/www/vhosts/aragonteespera.com/directus/` | PM2 `aragon-directus` | puerto 8061
- **Dokploy:** `185.14.58.119:3000` | composeId: `ilK0PtYhYLW9d69dRFeBi`
- **Archivos temporales en Plesk httpdocs:** `mig_db_x7k2p9q.sql` + `mig_uploads_x7k2p9q.tar.gz` (borrar)
