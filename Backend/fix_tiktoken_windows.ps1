# Script para resolver el error de tiktoken en Windows
# Ejecutar como: .\fix_tiktoken_windows.ps1

Write-Host "🔧 Resolviendo error de tiktoken en Windows..." -ForegroundColor Yellow

# Función para instalar con wheel precompilado
function Install-WithPrecompiledWheels {
    Write-Host "📦 Actualizando pip, setuptools y wheel..." -ForegroundColor Green
    python -m pip install --upgrade pip setuptools wheel
    
    Write-Host "🏗️  Instalando herramientas de build..." -ForegroundColor Green
    pip install --upgrade build
    
    Write-Host "🎯 Instalando tiktoken con wheel precompilado..." -ForegroundColor Green
    # Forzar instalación desde PyPI con wheels precompilados
    pip install --only-binary=all tiktoken
    
    Write-Host "🤖 Instalando OpenAI..." -ForegroundColor Green
    pip install "openai>=1.6.1,<2.0.0"
    
    Write-Host "✅ tiktoken y OpenAI instalados correctamente!" -ForegroundColor Green
}

# Función para instalar dependencias básicas sin LangChain
function Install-BasicDependencies {
    Write-Host "📦 Instalando dependencias básicas de FastAPI..." -ForegroundColor Green
    
    pip install fastapi==0.104.1
    pip install uvicorn[standard]==0.24.0
    pip install pydantic==2.5.0
    pip install pydantic-settings==2.1.0
    pip install python-dotenv==1.0.0
    pip install httpx==0.25.2
    pip install requests==2.31.0
    pip install python-multipart==0.0.6
    pip install loguru==0.7.2
    pip install aiohttp==3.9.1
    
    Write-Host "✅ Dependencias básicas instaladas!" -ForegroundColor Green
}

# Función para instalar LangChain (opcional)
function Install-LangChainOptional {
    $response = Read-Host "¿Deseas instalar LangChain? (y/N) - Nota: Puede causar conflictos"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "📚 Intentando instalar LangChain..." -ForegroundColor Yellow
        try {
            pip install "langchain>=0.1.0"
            pip install "langchain-openai>=0.0.5"
            Write-Host "✅ LangChain instalado correctamente!" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Error instalando LangChain. Continuando sin él..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "ℹ️  Saltando instalación de LangChain" -ForegroundColor Blue
    }
}

Write-Host "🚀 Iniciando instalación de dependencias..." -ForegroundColor Green

# Verificar Python
try {
    $pythonVersion = python --version
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no encontrado. Instala Python 3.8+" -ForegroundColor Red
    exit 1
}

# Crear y activar entorno virtual
if (!(Test-Path "venv")) {
    Write-Host "🏗️  Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Instalar en pasos
try {
    Install-WithPrecompiledWheels
    Install-BasicDependencies
    Install-LangChainOptional
    
    Write-Host ""
    Write-Host "🎉 ¡Instalación completada exitosamente!" -ForegroundColor Green
    Write-Host "💡 Puedes ejecutar: python start_dev.py" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error durante la instalación: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Prueba la instalación manual alternativa..." -ForegroundColor Yellow
}
