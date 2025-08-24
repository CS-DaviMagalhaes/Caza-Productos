"use client";
import React, { useState, useEffect } from "react";

type Product = {
  name: string;
  url: string;
};

type Section = {
  id: string;
  name: string;
  products: Product[];
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showFav, setShowFav] = useState(false);
  const [showSections, setShowSections] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    const dark = localStorage.getItem("darkMode");
    if (dark === "true") setDarkMode(true);
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
    const storedSections = localStorage.getItem("sections");
    if (storedSections) setSections(JSON.parse(storedSections));
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections));
  }, [sections]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    setHistory(prev => {
      const filtered = prev.filter(item => item !== query.trim());
      return [query.trim(), ...filtered].slice(0, 8);
    });

    try {
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

  const addFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.url === product.url);
      if (exists) return prev;
      return [product, ...prev];
    });
  };

  const removeFavorite = (product: Product) => {
    setFavorites(prev => prev.filter(fav => fav.url !== product.url));
  };

  const clearHistory = () => setHistory([]);
  const removeHistoryItem = (item: string) => {
    setHistory(prev => prev.filter(h => h !== item));
  };

  // Secciones personalizadas
  const addSection = () => {
    if (!newSectionName.trim()) return;
    setSections(prev => [
      ...prev,
      { id: Date.now().toString(), name: newSectionName.trim(), products: [] },
    ]);
    setNewSectionName("");
  };

  const removeSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  // Drag & Drop
  const onDragStart = (product: Product) => setDraggedProduct(product);
  const onDropProduct = (sectionId: string) => {
    if (!draggedProduct) return;
    setSections(prev =>
      prev.map(s =>
        s.id === sectionId && !s.products.some(p => p.url === draggedProduct.url)
          ? { ...s, products: [...s.products, draggedProduct] }
          : s
      )
    );
    setDraggedProduct(null);
  };

  const isDark = darkMode;
  const colors = {
    bg: isDark ? "#18181b" : "rgba(255,255,255,0.85)",
    mainBg: isDark
      ? "linear-gradient(135deg, #18181b 0%, #27272a 100%)"
      : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    text: isDark ? "#fafafa" : "#222",
    subText: isDark ? "#a1a1aa" : "#555",
    card: isDark ? "#232326" : "#f3f4f6",
    button: isDark ? "#6366f1" : "#2563eb",
    border: isDark ? "#27272a" : "#d1d5db",
    shadow: isDark
      ? "0 4px 24px rgba(0,0,0,0.40)"
      : "0 4px 24px rgba(0,0,0,0.10)",
    link: isDark ? "#818cf8" : "#2563eb",
    error: "#e11d48",
    inputBg: isDark ? "#18181b" : "#f8fafc",
    fav: "#f59e42",
    favBg: isDark ? "#3b2f1e" : "#fff7ed",
    xBtn: isDark ? "#e11d48" : "#b91c1c",
    xBg: isDark ? "#232326" : "#fff",
    favPanelBg: isDark ? "#232326" : "#fff",
    sectionBg: isDark ? "#232326" : "#f3f4f6",
    sectionBorder: isDark ? "#6366f1" : "#2563eb",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: colors.mainBg,
        transition: "background 0.3s",
      }}
    >
      {/* Fondo decorativo SVG */}
      <img
        src="/globe.svg"
        alt="Decoración"
        style={{
          position: "absolute",
          top: "-80px",
          left: "-120px",
          width: "600px",
          opacity: isDark ? 0.10 : 0.18,
          zIndex: 0,
          filter: "blur(1px)",
          pointerEvents: "none",
        }}
      />
      <img
        src="/window.svg"
        alt="Decoración"
        style={{
          position: "absolute",
          bottom: "-60px",
          right: "-80px",
          width: "400px",
          opacity: isDark ? 0.07 : 0.13,
          zIndex: 0,
          filter: "blur(2px)",
          pointerEvents: "none",
        }}
      />
      {/* Menú despegable de secciones personalizadas */}
      <button
        onClick={() => setShowSections(s => !s)}
        style={{
          position: "fixed",
          top: 32,
          left: 32,
          zIndex: 20,
          background: colors.button,
          color: "#fff",
          border: "none",
          borderRadius: 24,
          padding: "10px 22px",
          fontSize: 17,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.12)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        aria-label="Mostrar secciones"
      >
        {showSections ? "Cerrar menú" : "☰ Secciones"}
      </button>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: showSections ? 0 : -340,
          width: 320,
          height: "100vh",
          background: colors.sectionBg,
          boxShadow: showSections ? "4px 0 24px rgba(0,0,0,0.10)" : "none",
          borderRight: `2px solid ${colors.sectionBorder}`,
          transition: "left 0.35s cubic-bezier(.4,0,.2,1)",
          zIndex: 19,
          padding: "36px 24px 24px 24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 18, color: colors.text }}>
          Mis Secciones
        </h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            value={newSectionName}
            onChange={e => setNewSectionName(e.target.value)}
            placeholder="Nombre de la sección"
            style={{
              padding: 8,
              borderRadius: 6,
              border: `1px solid ${colors.border}`,
              width: "70%",
              marginRight: 8,
              background: colors.inputBg,
              color: colors.text,
            }}
          />
          <button
            onClick={addSection}
            style={{
              padding: "8px 12px",
              background: colors.button,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Crear
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {sections.length === 0 ? (
            <div style={{ color: colors.subText, fontSize: 15 }}>
              No hay secciones creadas.
            </div>
          ) : (
            sections.map(section => (
              <div
                key={section.id}
                style={{
                  background: colors.bg,
                  borderRadius: 8,
                  marginBottom: 12,
                  padding: "10px 10px",
                  border: `1px solid ${colors.sectionBorder}`,
                }}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDropProduct(section.id)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600 }}>{section.name}</span>
                  <button
                    onClick={() => removeSection(section.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: colors.xBtn,
                      fontSize: 16,
                      cursor: "pointer",
                      marginLeft: 8,
                    }}
                    title="Eliminar sección"
                  >
                    ×
                  </button>
                </div>
                <div style={{ marginTop: 8 }}>
                  {section.products.length === 0 ? (
                    <span style={{ color: colors.subText, fontSize: 14 }}>
                      Arrastra aquí productos favoritos
                    </span>
                  ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {section.products.map(product => (
                        <li
                          key={product.url}
                          style={{
                            background: colors.favBg,
                            borderRadius: 6,
                            marginBottom: 6,
                            padding: "6px 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: colors.text,
                            border: `1px solid ${colors.fav}`,
                          }}
                        >
                          <span style={{ fontWeight: 500 }}>{product.name}</span>
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: colors.link,
                              color: "#fff",
                              padding: "4px 10px",
                              borderRadius: 6,
                              textDecoration: "none",
                              fontWeight: 500,
                              fontSize: 13,
                              marginLeft: 8,
                            }}
                          >
                            Ver
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Botón para abrir favoritos */}
      <button
        onClick={() => setShowFav(f => !f)}
        style={{
          position: "fixed",
          top: 32,
          right: 32,
          zIndex: 20,
          background: colors.button,
          color: "#fff",
          border: "none",
          borderRadius: 24,
          padding: "10px 22px",
          fontSize: 17,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(37,99,235,0.12)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        aria-label="Mostrar favoritos"
      >
        {showFav ? "Cerrar favoritos" : "★ Favoritos"}
      </button>
      {/* Panel de favoritos despegable */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: showFav ? 0 : -340,
          width: 320,
          height: "100vh",
          background: colors.favPanelBg,
          boxShadow: showFav ? "-4px 0 24px rgba(0,0,0,0.10)" : "none",
          borderLeft: `1px solid ${colors.fav}`,
          transition: "right 0.35s cubic-bezier(.4,0,.2,1)",
          zIndex: 19,
          padding: "36px 24px 24px 24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontWeight: 600, fontSize: 22, marginBottom: 18, color: colors.text }}>
          Favoritos
        </h2>
        {favorites.length === 0 ? (
          <div style={{ color: colors.subText, fontSize: 15 }}>
            No tienes productos favoritos aún.
          </div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, flex: 1, overflowY: "auto" }}>
            {favorites.map(product => (
              <li
                key={product.url}
                draggable
                onDragStart={() => onDragStart(product)}
                style={{
                  background: colors.favBg,
                  borderRadius: 8,
                  marginBottom: 8,
                  padding: "10px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: colors.text,
                  border: `1px solid ${colors.fav}`,
                  cursor: "grab",
                }}
              >
                <span style={{ fontWeight: 500 }}>{product.name}</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: colors.link,
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 6,
                      textDecoration: "none",
                      fontWeight: 500,
                      fontSize: 14,
                      transition: "background 0.2s",
                    }}
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => removeFavorite(product)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: colors.fav,
                      fontSize: 18,
                      cursor: "pointer",
                      marginLeft: 2,
                    }}
                    title="Quitar de favoritos"
                    aria-label="Quitar de favoritos"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Centrado vertical y horizontal */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: colors.bg,
            borderRadius: 18,
            boxShadow: colors.shadow,
            padding: "36px 44px",
            minWidth: 350,
            maxWidth: 420,
            textAlign: "center",
            backdropFilter: "blur(2px)",
            color: colors.text,
            transition: "background 0.3s, color 0.3s",
            position: "relative",
          }}
        >
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: isDark ? "#27272a" : "#f3f4f6",
              color: isDark ? "#fafafa" : "#222",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 15,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              transition: "background 0.2s",
            }}
            aria-label="Cambiar modo"
          >
            {isDark ? "🌙 Modo claro" : "🌞 Modo oscuro"}
          </button>
          <h1 style={{ fontWeight: 700, fontSize: 30, marginBottom: 8 }}>
            Caza Productos
          </h1>
          <p style={{ color: colors.subText, marginBottom: 24, fontSize: 16 }}>
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
                border: `1px solid ${colors.border}`,
                fontSize: 16,
                outline: "none",
                flex: 1,
                background: colors.inputBg,
                color: colors.text,
                transition: "background 0.3s, color 0.3s",
              }}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "0 18px",
                background: colors.button,
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
          {/* Historial de búsqueda */}
          {history.length > 0 && (
            <div style={{ marginBottom: 18, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: colors.subText, fontSize: 14, marginBottom: 6 }}>
                  Historial de búsqueda:
                </div>
                <button
                  onClick={clearHistory}
                  style={{
                    background: colors.card,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    padding: "2px 10px",
                    fontSize: 13,
                    cursor: "pointer",
                    marginBottom: 2,
                    marginLeft: 8,
                  }}
                  aria-label="Borrar historial"
                >
                  Borrar historial
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {history.map((item, idx) => (
                  <div
                    key={item + idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: colors.card,
                      border: `1px solid ${colors.border}`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 14,
                      marginBottom: 2,
                      transition: "background 0.2s",
                      color: colors.text,
                      position: "relative",
                    }}
                  >
                    <button
                      onClick={() => setQuery(item)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: colors.text,
                        fontSize: 14,
                        cursor: "pointer",
                        padding: 0,
                        marginRight: 6,
                      }}
                      aria-label={`Buscar ${item}`}
                    >
                      {item}
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item)}
                      style={{
                        background: colors.xBg,
                        border: "none",
                        color: colors.xBtn,
                        fontSize: 16,
                        cursor: "pointer",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 2,
                      }}
                      title="Eliminar búsqueda"
                      aria-label="Eliminar búsqueda"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && (
            <div style={{ color: colors.error, marginBottom: 16, fontSize: 15 }}>{error}</div>
          )}
          <div style={{ marginTop: 24 }}>
            {loading ? (
              <div style={{ color: colors.button, fontSize: 16, marginTop: 16 }}>
                <span className="loader" style={{
                  display: "inline-block",
                  width: 18,
                  height: 18,
                  border: `3px solid ${colors.button}`,
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
                {results.map(product => {
                  const isFav = favorites.some(fav => fav.url === product.url);
                  return (
                    <li
                      key={product.url}
                      style={{
                        background: colors.card,
                        borderRadius: 10,
                        marginBottom: 16,
                        padding: "16px 12px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: colors.text,
                        transition: "background 0.3s, color 0.3s",
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{product.name}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: colors.link,
                            color: "#fff",
                            padding: "8px 16px",
                            borderRadius: 6,
                            textDecoration: "none",
                            fontWeight: 500,
                            fontSize: 15,
                            marginLeft: 2,
                            transition: "background 0.2s",
                          }}
                        >
                          Ver
                        </a>
                        <button
                          onClick={() => addFavorite(product)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: isFav ? colors.fav : colors.subText,
                            fontSize: 20,
                            cursor: isFav ? "not-allowed" : "pointer",
                            marginLeft: 2,
                          }}
                          title={isFav ? "Ya en favoritos" : "Guardar en favoritos"}
                          aria-label={isFav ? "Ya en favoritos" : "Guardar en favoritos"}
                          disabled={isFav}
                        >
                          ★
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div style={{ color: colors.subText, fontSize: 15, marginTop: 16 }}>
                Ingresa un producto y presiona buscar para ver resultados.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}