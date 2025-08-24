# Backend API - Caza Productos

API backend desarrollada con FastAPI que integra OpenAI para el procesamiento de datos del frontend.

## 🚀 Características

- **FastAPI**: Framework moderno y rápido para APIs
- **Integración OpenAI**: Procesamiento inteligente de datos
- **CORS habilitado**: Listo para frontend
- **Validación de datos**: Con Pydantic
- **Documentación automática**: Swagger UI incluido

## 📋 Requisitos Previos

- Python 3.8+
- Clave API de OpenAI

## ⚙️ Instalación

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` y agrega tu clave de OpenAI:
   ```
   OPENAI_API_KEY=tu_clave_api_aqui
   ```

## 🏃‍♂️ Ejecutar la API

### Opción 1: Usando uvicorn directamente
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Opción 2: Usando el script de desarrollo
```bash
python start_dev.py
```

La API estará disponible en: `http://localhost:8000`

## 📖 Documentación

Una vez ejecutando la API, puedes acceder a:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🔗 Endpoints Principales

### 1. Endpoint Raíz
- **GET** `/`
- Verificar que la API está funcionando

### 2. Buscar Producto (Principal)
- **POST** `/buscar-producto`
- Recibe descripción de producto del frontend y retorna 5 links de sellers en Perú

**Ejemplo de request:**
```json
{
  "descripcion_producto": "iPhone 15 Pro Max 256GB",
  "mensaje": "Busco el mejor precio",
  "contexto": "Para uso personal, prefiero garantía oficial"
}
```

**Ejemplo de response:**
```json
{
  "descripcion_producto": "iPhone 15 Pro Max 256GB",
  "links_sellers": [
    {
      "nombre_tienda": "Mercado Libre Perú",
      "url": "https://mercadolibre.com.pe/...",
      "precio_estimado": "S/ 5,200.00 (aproximado)",
      "descripcion": "iPhone 15 Pro Max nuevo con garantía"
    }
  ],
  "estado": "exitoso",
  "mensaje": "Encontrados 5 sellers para 'iPhone 15 Pro Max 256GB'"
}
```

### 3. Consulta Simple
- **POST** `/consulta-simple`
- Endpoint flexible para cualquier JSON

**Ejemplo de request:**
```json
{
  "busqueda": "laptop para programar",
  "presupuesto": "S/ 3000 - S/ 4000",
  "ubicacion": "Lima, Perú"
}
```

## 🧪 Testing

Ejecutar tests de ejemplo:
```bash
python test_api.py
```

## 📁 Estructura del Proyecto

```
Backend/
├── main.py              # Aplicación principal FastAPI
├── start_dev.py         # Script de desarrollo
├── test_api.py          # Tests de ejemplo
├── requirements.txt     # Dependencias Python
├── .env.example         # Ejemplo de variables de entorno
└── README.md           # Esta documentación
```

## 🔧 Configuración de Desarrollo

Para desarrollo, la API incluye:
- Recarga automática con `--reload`
- CORS habilitado para desarrollo
- Logging detallado
- Validación automática de esquemas

## 🌐 Integración con Frontend

La API está configurada para recibir peticiones desde cualquier origen durante el desarrollo. Para producción, ajusta la configuración de CORS en `main.py`.

Ejemplo de petición desde JavaScript:
```javascript
const response = await fetch('http://localhost:8000/buscar-producto', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    descripcion_producto: "laptop gaming RTX 4060",
    mensaje: "Busco el mejor precio",
    contexto: "Para gaming y trabajo"
  })
});

const data = await response.json();
console.log(data.links_sellers); // Array con 5 sellers
```

## 🚨 Troubleshooting

### Error: Import could not be resolved
- Asegúrate de haber instalado las dependencias: `pip install -r requirements.txt`

### Error: OpenAI API Key
- Verifica que tu clave API esté correctamente configurada en `.env`
- Asegúrate de que la clave tenga permisos para usar la API de chat

### Error de CORS
- Para producción, actualiza la configuración de CORS en `main.py`

## 📝 Notas

- La API está configurada para usar el modelo `gpt-3.5-turbo` de OpenAI
- Los límites de tokens están configurados en 500 para respuestas
- El campo `campo_a_sumar` se procesa multiplicándolo por 2 (puedes modificar esta lógica)

### Variables de Entorno
```bash
# API Keys
OPENAI_API_KEY=your_openai_key
GOOGLE_SEARCH_API_KEY=your_google_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/caza_productos
REDIS_URL=redis://localhost:6379

# Configuration
ENVIRONMENT=development
DEBUG=true
API_PORT=8000
```

## Instalación Rápida

1. **Clonar y configurar entorno**:
```bash
cd Backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. **Configurar base de datos**:
```bash
docker-compose up -d postgres redis
python -m alembic upgrade head
```

3. **Ejecutar desarrollo**:
```bash
uvicorn main:app --reload --port 8000
```

## Endpoints API

### POST /api/v1/search
Buscar productos por descripción

**Request**:
```json
{
  "description": "iPhone 15 Pro Max 256GB color negro",
  "max_results": 5,
  "filters": {
    "min_price": 100,
    "max_price": 2000,
    "country": "US"
  }
}
```

**Response**:
```json
{
  "request_id": "uuid-here",
  "results": [
    {
      "url": "https://amazon.com/product/...",
      "title": "iPhone 15 Pro Max 256GB - Black",
      "price": "$1199.99",
      "rating": 4.5,
      "reviews_count": 1250,
      "ecommerce_site": "amazon.com",
      "confidence_score": 0.95,
      "image_url": "https://..."
    }
  ],
  "processing_time": 2.3,
  "total_found": 15,
  "search_metadata": {
    "search_terms_used": ["iPhone 15 Pro Max", "256GB", "black"],
    "sites_searched": ["amazon.com", "ebay.com", "walmart.com"]
  }
}
```

### GET /api/v1/health
Health check del servicio

### GET /api/v1/sites
Lista de sitios de ecommerce soportados

## Próximos Pasos

1. Implementar estructura base de FastAPI
2. Configurar servicios de IA y scraping
3. Agregar tests unitarios
4. Documentar API con Swagger
5. Configurar CI/CD pipeline
