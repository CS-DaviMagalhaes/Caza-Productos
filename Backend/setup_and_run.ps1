# Script de PowerShell para configurar y ejecutar la API
# Ejecutar como: .\setup_and_run.ps1

Write-Host "🚀 Configurando API Caza Productos..." -ForegroundColor Green

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
    Write-Host "📦 Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Activar entorno virtual
Write-Host "🔧 Activando entorno virtual..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Instalar dependencias
Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
Write-Host "⚠️  Usando requirements-minimal.txt para evitar conflictos..." -ForegroundColor Yellow
pip install -r requirements-minimal.txt

# Verificar archivo .env
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Copiando desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Por favor edita el archivo .env y agrega tu OPENAI_API_KEY" -ForegroundColor Cyan
    
    $response = Read-Host "¿Deseas continuar sin configurar la API key? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "⏹️  Configuración pausada. Configura tu .env y ejecuta nuevamente." -ForegroundColor Yellow
        exit 0
    }
}

# Ejecutar la API
Write-Host "🚀 Iniciando API en http://localhost:8000..." -ForegroundColor Green
Write-Host "📖 Documentación disponible en http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🛑 Presiona Ctrl+C para detener la API" -ForegroundColor Yellow
Write-Host ""

python start_dev.py
