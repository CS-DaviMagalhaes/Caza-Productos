"""
Ejemplos de uso de la API Caza Productos
"""
import requests
import json

# URL base de la API (ajusta según tu configuración)
BASE_URL = "http://localhost:8000"

def test_endpoint_root():
    """Probar el endpoint raíz"""
    response = requests.get(f"{BASE_URL}/")
    print("=== Test Endpoint Raíz ===")
    print(f"Status: {response.status_code}")
    print(f"Respuesta: {response.json()}")
    print()

def test_buscar_producto():
    """Probar el endpoint principal de búsqueda de productos"""
    data = {
        "descripcion_producto": "iPhone 15 Pro Max 256GB",
        "mensaje": "Busco el mejor precio disponible",
        "contexto": "Para uso personal, prefiero tiendas con garantía oficial"
    }
    
    response = requests.post(f"{BASE_URL}/buscar-producto", json=data)
    print("=== Test Buscar Producto ===")
    print(f"Status: {response.status_code}")
    print(f"Datos enviados: {json.dumps(data, indent=2)}")
    if response.status_code == 200:
        result = response.json()
        print(f"Descripción producto: {result['descripcion_producto']}")
        print(f"Estado: {result['estado']}")
        print(f"Mensaje: {result['mensaje']}")
        print(f"Sellers encontrados: {len(result['links_sellers'])}")
        
        for i, seller in enumerate(result['links_sellers'], 1):
            print(f"\n  Seller {i}:")
            print(f"    Tienda: {seller['nombre_tienda']}")
            print(f"    URL: {seller['url']}")
            print(f"    Precio: {seller['precio_estimado']}")
            print(f"    Descripción: {seller['descripcion']}")
    else:
        print(f"Error: {response.text}")
    print()

def test_consulta_simple():
    """Probar el endpoint de consulta simple"""
    data = {
        "busqueda": "laptop para programar",
        "presupuesto_max": "S/ 4000",
        "uso": "Desarrollo de software y diseño",
        "ubicacion": "Lima, Perú",
        "preferencias": "Pantalla grande, buen procesador"
    }
    
    response = requests.post(f"{BASE_URL}/consulta-simple", json=data)
    print("=== Test Consulta Simple ===")
    print(f"Status: {response.status_code}")
    print(f"Datos enviados: {json.dumps(data, indent=2)}")
    if response.status_code == 200:
        print(f"Respuesta: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Error: {response.text}")
    print()

if __name__ == "__main__":
    print("🚀 Iniciando tests de la API Caza Productos...\n")
    
    try:
        test_endpoint_root()
        test_buscar_producto()
        test_consulta_simple()
        print("✅ Tests completados!")
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se pudo conectar a la API. Asegúrate de que esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
