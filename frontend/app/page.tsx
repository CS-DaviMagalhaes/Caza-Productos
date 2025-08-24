"use client";
import React, { useState } from "react";

const mockProducts = [
  { name: "Producto 1", url: "https://ejemplo.com/producto-1" },
  { name: "Producto 2", url: "https://ejemplo.com/producto-2" },
  { name: "Producto 3", url: "https://ejemplo.com/producto-3" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof mockProducts>([]);

  const handleSearch = () => {
    const filtered = mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
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
        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 16, color: "#222" }}>
          Caza Productos
        </h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Encuentra links de productos similares al que buscas.
        </p>
        <input
          type="text"
          placeholder="¿Qué producto buscas?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            padding: 12,
            marginBottom: 16,
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            fontSize: 16,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "12px 0",
            width: "100%",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
            transition: "background 0.2s",
          }}
        >
          Buscar
        </button>
        <div style={{ marginTop: 32 }}>
          {results.length > 0 ? (
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
            <p style={{ color: "#888", fontSize: 15 }}>No hay resultados aún.</p>
          )}
        </div>
      </div>
    </main>
  );
}