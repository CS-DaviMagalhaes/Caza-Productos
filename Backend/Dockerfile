# ---------- Stage 1: Builder ----------
FROM python:3.13.0 AS builder

WORKDIR /app

# Copy dependency list first for caching
COPY requirements-basic.txt requirements.txt

# Build wheels (fat image already has gcc/make/etc.)
RUN pip install --no-cache-dir --upgrade pip setuptools wheel \
    && pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt


# ---------- Stage 2: Runner ----------
FROM python:3.13.0-slim AS runner

# Prevents Python from writing .pyc files and buffers stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install only runtime dependencies from built wheels
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/* \
    && rm -rf /wheels

# Copy app code
COPY . ./app

# Create non-root user
RUN useradd -m fastapiuser
USER fastapiuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
