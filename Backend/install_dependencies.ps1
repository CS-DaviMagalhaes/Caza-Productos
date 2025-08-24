# Script de PowerShell para resolver conflictos de dependencias
# Ejecutar como: .\install_dependencies.ps1

Write-Host "🔧 Resolviendo conflictos de dependencias..." -ForegroundColor Yellow

# Función para instalar dependencias paso a paso
function Install-Dependencies {
    Write-Host "📦 Instalando dependencias principales..." -ForegroundColor Green
    
    # Instalar dependencias básicas primero
    pip install fastapi==0.104.1
    pip install uvicorn[standard]==0.24.0
    pip install pydantic==2.5.0
    pip install pydantic-settings==2.1.0
    pip install python-dotenv==1.0.0
    pip install httpx==0.25.2
    pip install requests==2.31.0
    
    Write-Host "🤖 Instalando OpenAI y LangChain compatibles..." -ForegroundColor Green
    
    # Instalar OpenAI con versión compatible
    pip install "openai>=1.6.1,<2.0.0"
    
    # Instalar LangChain compatible
    pip install "langchain>=0.1.0"
    pip install "langchain-openai>=0.0.5"
    
    Write-Host "📚 Instalando dependencias adicionales..." -ForegroundColor Green
    
    # Resto de dependencias
    pip install aiohttp==3.9.1
    pip install python-multipart==0.0.6
    pip install loguru==0.7.2
    
    Write-Host "✅ Instalación completada!" -ForegroundColor Green
}

# Verificar si Python está instalado
try {
    $pythonVersion = python --version
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no encontrado. Por favor instala Python 3.8+" -ForegroundColor Red
    exit 1
}

# Crear entorno virtual si no existe
if (!(Test-Path "venv")) {
    Write-Host "🏗️  Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Activar entorno virtual
Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Actualizar pip
Write-Host "⬆️  Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependencias
Install-Dependencies

Write-Host ""
Write-Host "🎉 ¡Instalación completada exitosamente!" -ForegroundColor Green
Write-Host "💡 Ahora puedes ejecutar: python start_dev.py" -ForegroundColor Cyan
