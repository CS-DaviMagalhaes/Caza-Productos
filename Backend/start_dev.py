#!/usr/bin/env python3
"""
Script para iniciar la API de desarrollo
"""
import uvicorn
import os
from main import app

if __name__ == "__main__":
    # Configuración para desarrollo
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Recarga automática en desarrollo
        log_level="info"
    )
