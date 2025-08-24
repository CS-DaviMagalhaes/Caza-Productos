# Instalación manual paso a paso para evitar conflictos
# Ejecutar comando por comando en PowerShell

Write-Host "🔧 Instalación Manual - Paso a Paso" -ForegroundColor Green
Write-Host "Ejecuta estos comandos uno por uno:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Crear y activar entorno virtual:" -ForegroundColor Cyan
Write-Host "python -m venv venv" -ForegroundColor White
Write-Host ".\venv\Scripts\Activate.ps1" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Actualizar herramientas básicas:" -ForegroundColor Cyan
Write-Host "python -m pip install --upgrade pip" -ForegroundColor White
Write-Host "pip install --upgrade setuptools wheel" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  Instalar FastAPI y dependencias básicas:" -ForegroundColor Cyan
Write-Host "pip install fastapi==0.104.1" -ForegroundColor White
Write-Host "pip install uvicorn[standard]==0.24.0" -ForegroundColor White
Write-Host "pip install pydantic==2.5.0" -ForegroundColor White
Write-Host "pip install python-dotenv==1.0.0" -ForegroundColor White
Write-Host "pip install requests==2.31.0" -ForegroundColor White
Write-Host "pip install httpx==0.25.2" -ForegroundColor White
Write-Host "pip install python-multipart==0.0.6" -ForegroundColor White
Write-Host "pip install loguru==0.7.2" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  Instalar OpenAI (puede tardar):" -ForegroundColor Cyan
Write-Host "pip install --only-binary=all openai==1.35.0" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣  Verificar instalación:" -ForegroundColor Cyan
Write-Host "python -c `"import fastapi, openai; print('✅ Todo instalado correctamente!')`"" -ForegroundColor White
Write-Host ""

Write-Host "6️⃣  Ejecutar API:" -ForegroundColor Cyan
Write-Host "python start_dev.py" -ForegroundColor White
Write-Host ""

Write-Host "💡 Alternativamente, usa:" -ForegroundColor Yellow
Write-Host "pip install -r requirements-basic.txt" -ForegroundColor White
