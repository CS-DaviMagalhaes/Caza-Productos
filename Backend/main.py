from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from typing import List
import os
from dotenv import load_dotenv
import json
import re

# Cargar variables de entorno
load_dotenv()

app = FastAPI(title="Caza Productos API", version="1.0.0")

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware simple de logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        print(f"[REQ] {request.method} {request.url}")
        response = await call_next(request)
        print(f"[RES] {request.method} {request.url.path} -> {response.status_code}")
        return response
    except Exception as e:
        # Log y rethrow para que lo capture el handler global
        print(f"[ERR] {request.method} {request.url.path} -> {e}")
        raise

# Manejadores globales de errores
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    print(f"[HTTPException] {request.method} {request.url.path} -> {exc.status_code}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    import traceback
    tb = traceback.format_exc()
    print(f"[Exception] {request.method} {request.url.path} -> {exc}\n{tb}")
    return JSONResponse(status_code=500, content={"detail": str(exc)})

# Función para obtener la API key de OpenAI de diferentes fuentes
def get_openai_api_key():
    """
    Obtiene la API key de OpenAI desde diferentes fuentes en orden de prioridad:
    1. Variable de entorno OPENAI_API_KEY
    2. Archivo .env
    3. Header de autenticación (para requests específicos)
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Intentar cargar desde .env si no está en las variables de entorno
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
    
    return api_key

# Inicializar cliente de OpenAI
openai_api_key = get_openai_api_key()
client = None
DEFAULT_OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

if openai_api_key:
    client = OpenAI(api_key=openai_api_key)
    print("Cliente OpenAI inicializado correctamente")
else:
    print("OpenAI API Key no encontrada. Algunas funcionalidades estarán limitadas.")

# Modelos Pydantic para la validación de datos
class ProductoRequest(BaseModel):
    descripcion_producto: str
    mensaje: str = ""
    contexto: str = ""
    #openai_api_key: str = ""  # Opcional: API key específica para esta request

class SellerLink(BaseModel):
    nombre_tienda: str
    url: str
    precio_estimado: str = ""
    descripcion: str = ""

class ProductoResponse(BaseModel):
    descripcion_producto: str
    links_sellers: List[SellerLink]
    estado: str
    mensaje: str = ""

class SearchRequest(BaseModel):
    query: str
    country: str = "pe"
    numResults: int = 8
    useReranker: bool | None = None
    onlyPeDomains: bool | None = None

class SearchItem(BaseModel):
    id: str
    name: str
    description: str
    price: float
    imageUrl: str
    url: str

class SearchResponse(BaseModel):
    results: List[SearchItem]

class ConfigRequest(BaseModel):
    openai_api_key: str

class ConfigResponse(BaseModel):
    mensaje: str
    estado: str
    api_key_configurada: bool

@app.get("/")
async def root():
    """Endpoint raíz para verificar que la API está funcionando"""
    api_key_status = "configurada" if openai_api_key else "no configurada"
    return {
        "mensaje": "API Caza Productos funcionando correctamente",
        "openai_status": f"API Key {api_key_status}",
        "endpoints_disponibles": [
            "GET /",
            "POST /buscar-producto",
            "POST /consulta-simple", 
            "POST /configurar-openai",
            "GET /status-openai"
        ]
    }

@app.post("/configurar-openai", response_model=ConfigResponse)
async def configurar_openai(config: ConfigRequest):
    """
    Endpoint para configurar la API key de OpenAI dinámicamente
    """
    global client, openai_api_key
    
    try:
        # Validar que la API key no esté vacía
        if not config.openai_api_key or len(config.openai_api_key.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="API key inválida. Debe tener al menos 10 caracteres"
            )
        
        # Configurar nuevo cliente
        test_client = OpenAI(api_key=config.openai_api_key.strip())
        
        # Hacer una prueba rápida para validar la API key
        test_response = test_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Test"}],
            max_tokens=5
        )
        
        # Si llega aquí, la API key es válida
        client = test_client
        openai_api_key = config.openai_api_key.strip()
        
        return ConfigResponse(
            mensaje="API key configurada correctamente",
            estado="exitoso",
            api_key_configurada=True
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error al configurar API key: {str(e)}"
        )

@app.get("/status-openai")
async def status_openai():
    """
    Endpoint para verificar el estado de la configuración de OpenAI
    """
    return {
        "api_key_configurada": openai_api_key is not None,
        "cliente_inicializado": client is not None,
        "estado": "listo" if (openai_api_key and client) else "necesita_configuracion"
    }

@app.post("/buscar-producto", response_model=ProductoResponse)
async def buscar_producto(request: ProductoRequest):
    """
    Endpoint principal que recibe la descripción de un producto del frontend
    y retorna 5 links de sellers disponibles en Perú
    """
    try:
        # Determinar qué cliente de OpenAI usar
        current_client = client
        
        # Verificar que tenemos un cliente válido
        if not current_client:
            raise HTTPException(
                status_code=400,
                detail="No hay API key de OpenAI configurada. Usa /configurar-openai para configurar tu API key"
            )
        
        # Crear el system prompt especializado para buscar sellers en Perú
        system_query = f"""
        Eres un asistente especializado en encontrar productos en tiendas online de Perú.
        El usuario busca: "{request.descripcion_producto}"
        
        Contexto adicional: {request.contexto if request.contexto else 'Búsqueda general de producto'}
        
        Tu tarea es proporcionar exactamente 5 links de tiendas online reales que vendan este producto en Perú.
        
        IMPORTANTE: Responde ÚNICAMENTE en el siguiente formato JSON válido, sin texto adicional:
        {{
            "sellers": [
                {{
                    "nombre_tienda": "Nombre de la tienda",
                    "url": "https://url-real-de-la-tienda.com/producto",
                    "precio_estimado": "S/ XXX.XX (aproximado)",
                    "descripcion": "Breve descripción del producto en esta tienda"
                }}
            ]
        }}
        
        Enfócate en tiendas populares de Perú como:
        - Mercado Libre Perú
        - Ripley
        - Saga Falabella
        - Oechsle
        - Hiraoka
        - Curacao
        - Linio Perú
        - Wong
        - Plaza Vea
        - Tiendas especializadas según el producto
        
        Asegúrate de que los URLs sean realistas y específicos para el producto buscado.
        """
        
        # Crear el mensaje del usuario
        user_message = request.mensaje if request.mensaje else f"Busca sellers para: {request.descripcion_producto}"
        
        # Hacer la petición a OpenAI
        response = current_client.chat.completions.create(
            model=DEFAULT_OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_query},
                {"role": "user", "content": user_message}
            ],
            max_tokens=1500
        )
        
        # Extraer la respuesta de OpenAI
        openai_response = response.choices[0].message.content.strip()
        
        # Intentar parsear la respuesta JSON
        try:
            # Buscar el JSON en la respuesta
            json_match = re.search(r'\{.*\}', openai_response, re.DOTALL)
            if json_match:
                json_str = json_match.group()
                sellers_data = json.loads(json_str)
                
                # Convertir a lista de SellerLink
                links_sellers = []
                for seller in sellers_data.get("sellers", []):
                    links_sellers.append(SellerLink(
                        nombre_tienda=seller.get("nombre_tienda", ""),
                        url=seller.get("url", ""),
                        precio_estimado=seller.get("precio_estimado", ""),
                        descripcion=seller.get("descripcion", "")
                    ))
                
                return ProductoResponse(
                    descripcion_producto=request.descripcion_producto,
                    links_sellers=links_sellers,
                    estado="exitoso",
                    mensaje=f"Encontrados {len(links_sellers)} sellers para '{request.descripcion_producto}'"
                )
            else:
                raise ValueError("No se encontró JSON válido en la respuesta")
                
        except (json.JSONDecodeError, ValueError) as e:
            # Si hay error parseando, devolver respuesta con la información disponible
            return ProductoResponse(
                descripcion_producto=request.descripcion_producto,
                links_sellers=[],
                estado="error_parseo",
                mensaje=f"Error procesando respuesta de OpenAI: {str(e)}. Respuesta original: {openai_response[:200]}..."
            )
        
    except HTTPException:
        # Re-lanzar HTTPExceptions tal como están
        raise
    except Exception as e:
        # Manejo de errores generales
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar producto: {str(e)}"
        )

@app.post("/consulta-simple")
async def consulta_simple(request: dict):
    """
    Endpoint alternativo para consultas más simples
    Recibe cualquier JSON y hace una consulta básica a OpenAI
    """
    try:
        # Determinar qué cliente usar
        current_client = client
        
        # Si el request incluye una API key, usarla
        if "openai_api_key" in request and request["openai_api_key"]:
            try:
                current_client = OpenAI(api_key=request["openai_api_key"])
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"API key proporcionada es inválida: {str(e)}"
                )
        
        # Verificar que tenemos un cliente válido
        if not current_client:
            raise HTTPException(
                status_code=400,
                detail="No hay API key de OpenAI configurada. Usa /configurar-openai o incluye 'openai_api_key' en el JSON"
            )
        
        # Extraer información del JSON recibido (excluyendo la API key para el análisis)
        request_copy = request.copy()
        request_copy.pop("openai_api_key", None)  # Remover API key del análisis
        json_str = json.dumps(request_copy, indent=2)
        
        # System query simple
        system_query = f"""
        Analiza el siguiente JSON recibido del frontend y proporciona un resumen útil:
        {json_str}
        
        Responde con un análisis conciso y profesional.
        """
        
        # Consultar OpenAI
        response = current_client.chat.completions.create(
            model=DEFAULT_OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_query},
                {"role": "user", "content": "Analiza estos datos"}
            ],
            max_tokens=300
        )

        return {
            "datos_recibidos": request_copy,  # Sin incluir la API key
            "analisis_openai": response.choices[0].message.content,
            "estado": "exitoso"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en consulta simple: {str(e)}"
        )

@app.post("/api/search", response_model=SearchResponse)
async def api_search(body: SearchRequest):
    """
    Alias compatible con el frontend: recibe { query, country, numResults }
    y devuelve { results: Array<Product> }.
    Internamente usa la lógica de /buscar-producto para generar enlaces.
    """
    try:
        # Mapear al formato existente de buscar-producto
        producto_req = ProductoRequest(
            descripcion_producto=body.query,
            mensaje=f"Buscar {body.numResults} resultados en {body.country}",
            contexto="Búsqueda generada desde /api/search"
        )

        producto_resp = await buscar_producto(producto_req)

        # Convertir los sellers a un arreglo tipo Product consumible por el frontend
        results: List[SearchItem] = []
        for idx, seller in enumerate(producto_resp.links_sellers):
            results.append(SearchItem(
                id=str(idx + 1),
                name=seller.nombre_tienda or "Tienda",
                description=seller.descripcion or seller.url,
                price=0.0,
                imageUrl="/vercel.svg",
                url=seller.url or ""
            ))

        return SearchResponse(results=results)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en /api/search: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
