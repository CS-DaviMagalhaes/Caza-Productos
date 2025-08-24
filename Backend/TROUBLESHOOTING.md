# 🚨 Solución de Problemas - Error tiktoken en Windows

## Problema
```
ERROR: Failed building wheel for tiktoken
Failed to build tiktoken
```

## ¿Qué es tiktoken?
`tiktoken` es una biblioteca de OpenAI para tokenizar texto, necesaria para contar tokens en las APIs de OpenAI. El error ocurre porque requiere compilación de C++ en Windows.

## 🛠️ Soluciones (en orden de preferencia)

### ✅ Solución 1: Instalación Básica (Recomendada)
```powershell
# Usar requirements básicos sin LangChain
pip install -r requirements-basic.txt
```

### ✅ Solución 2: Forzar Wheel Precompilado
```powershell
# Ejecutar script automático
.\fix_tiktoken_windows.ps1
```

### ✅ Solución 3: Instalación Manual Paso a Paso
```powershell
# Ver instrucciones
.\install_manual.ps1

# O ejecutar manualmente:
python -m pip install --upgrade pip setuptools wheel
pip install --only-binary=all openai==1.35.0
pip install fastapi uvicorn python-dotenv requests
```

### ✅ Solución 4: Sin OpenAI (Solo FastAPI)
Si nada funciona, puedes usar la API sin OpenAI temporalmente:

```powershell
pip install fastapi uvicorn python-dotenv requests pydantic
```

Y comentar las líneas de OpenAI en `main.py`:
```python
# from openai import OpenAI
# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

## 🔧 Troubleshooting Adicional

### Si persiste el error:

1. **Instalar Microsoft C++ Build Tools:**
   - Descargar: https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Instalar "C++ build tools"

2. **Usar Conda en lugar de pip:**
   ```powershell
   conda install -c conda-forge openai
   ```

3. **Usar versión específica de Python:**
   ```powershell
   # Python 3.9-3.11 funcionan mejor
   python --version
   ```

## 📁 Archivos de Requirements Disponibles

- `requirements-basic.txt` - Solo lo esencial (sin LangChain)
- `requirements-minimal.txt` - Incluye LangChain (puede fallar)
- `requirements.txt` - Completo (original, puede tener conflictos)

## ✅ Verificar Instalación

```powershell
python -c "import fastapi, openai; print('✅ Todo bien!')"
```

## 🚀 Ejecutar API

Una vez instalado:
```powershell
python start_dev.py
```

La API funcionará en: http://localhost:8000
