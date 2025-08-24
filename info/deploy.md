# Guía de despliegue

Este documento explica cómo instalar dependencias y ejecutar el frontend (Next.js) y el backend (FastAPI) en desarrollo y producción.

## Prerrequisitos

- Node.js 18+ y npm (para el frontend)
- Python 3.10+ y pip (para el backend)
- Claves:
  - `GEMINI_API_KEY` (para `backend/gemini.py` que genera los links)

## Backend (FastAPI)

### Instalación

```bash
cd backend
pip install -r requirements.txt
```

### Variables de entorno

- `PORT` (por defecto: 4000)
- `SEARCH_COUNTRY` (por defecto: `pe`)
- `SEARCH_NUM_RESULTS` (por defecto: `8`)
- `GEMINI_API_KEY` (requerido para generar los enlaces con Gemini)

En Windows PowerShell (temporal, sesión actual):

```powershell
$env:PORT="4000"
$env:SEARCH_COUNTRY="pe"
$env:SEARCH_NUM_RESULTS="8"
$env:GEMINI_API_KEY="tu_gemini_key"
```

### Ejecutar en desarrollo (solo Gemini)

```bash
cd backend
uvicorn gemini:app --host 0.0.0.0 --port 4000 --reload
```

### Producción (ejemplos)

- Uvicorn (simple):

```bash
uvicorn gemini:app --host 0.0.0.0 --port 4000
```

- Gunicorn + Uvicorn workers (Linux):

```bash
gunicorn -k uvicorn.workers.UvicornWorker -w 2 -b 0.0.0.0:4000 gemini:app
```

Asegúrate de configurar un proxy inverso (Nginx) y HTTPS si expones públicamente.

## Frontend (Next.js)

### Instalación

```bash
cd frontend
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Luego abre `http://localhost:3000`.

El frontend llama por defecto a `http://localhost:4000/api/search`. Si tu backend está en otra URL, cambia el fetch en `frontend/app/page.tsx`.

### Build de producción

```bash
npm run build
npm run start
```

## Prueba del endpoint

Con el backend corriendo, prueba:

```bash
curl -X POST http://localhost:4000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"gorra azul","country":"pe","numResults":8,"useReranker":true,"onlyPeDomains":true}'
```

Deberías recibir un JSON con la lista de resultados (título, link, snippet).

## Solución de problemas

- ¿No ves resultados? Verifica `GEMINI_API_KEY` y tu cuota de la API.
- CORS: el backend ya permite orígenes `*`. Ajusta la configuración de CORS si despliegas en producción con dominios específicos.
- Windows PowerShell: al setear env vars usa `$env:NOMBRE="valor"` (no `NOMBRE=valor`).
