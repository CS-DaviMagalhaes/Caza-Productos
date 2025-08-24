"use client";
import React, { useState } from "react";

type Product = {
  name: string;
  url: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      // Simulación de llamada a API. Reemplaza por tu endpoint real.
      // const res = await fetch(`/api/similar-products?q=${encodeURIComponent(query)}`);
      // const data = await res.json();
      // setResults(data);

      // Simulación temporal
      setTimeout(() => {
        const mockProducts = [
          { name: "Producto 1", url: "https://ejemplo.com/producto-1" },
          { name: "Producto 2", url: "https://ejemplo.com/producto-2" },
          { name: "Producto 3", url: "https://ejemplo.com/producto-3" },
        ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        setResults(mockProducts);
        setLoading(false);
      }, 1200);
    } catch (err) {
      setError("Hubo un problema al buscar productos. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 60,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "32px 40px",
          minWidth: 350,
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: "#222" }}>
          Caza Productos
        </h1>
        <p style={{ color: "#555", marginBottom: 24, fontSize: 16 }}>
          Ingresa el producto que buscas y te mostraremos links similares encontrados por IA.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="¿Qué producto buscas?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              padding: 12,
              width: "100%",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              fontSize: 16,
              outline: "none",
              flex: 1,
            }}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "0 18px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
              transition: "background 0.2s",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>
        {error && (
          <div style={{ color: "#e11d48", marginBottom: 16, fontSize: 15 }}>{error}</div>
        )}
        <div style={{ marginTop: 24 }}>
          {loading ? (
            <div style={{ color: "#2563eb", fontSize: 16, marginTop: 16 }}>
              <span className="loader" style={{
                display: "inline-block",
                width: 18,
                height: 18,
                border: "3px solid #2563eb",
                borderTop: "3px solid #fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginRight: 8,
                verticalAlign: "middle"
              }} />
              Buscando productos similares...
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg);}
                  100% { transform: rotate(360deg);}
                }
              `}</style>
            </div>
          ) : results.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {results.map(product => (
                <li
                  key={product.url}
                  style={{
                    background: "#f3f4f6",
                    borderRadius: 10,
                    marginBottom: 16,
                    padding: "16px 12px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#222" }}>{product.name}</span>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      padding: "8px 16px",
                      borderRadius: 6,
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: 15,
                      marginLeft: 12,
                      transition: "background 0.2s",
                    }}
                  >
                    Ver
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#888", fontSize: 15, marginTop: 16 }}>
              Ingresa un producto y presiona buscar para ver resultados.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}