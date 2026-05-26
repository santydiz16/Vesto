/* eslint-disable */

function Catalog({ onNav, products, favoritesOnly, onAddToCart }) {
  const [category,     setCategory]     = useState('todos');
  const [sort,         setSort]         = useState('Más recientes');
  const [search,       setSearch]       = useState('');
  const [priceFilters, setPriceFilters] = useState([]);
  const [sizeFilter,   setSizeFilter]   = useState([]);
  const [viewMode,     setViewMode]     = useState('grid'); // 'grid' | 'list'
  const [quickViewId,  setQuickViewId]  = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const w        = useWindowWidth();
  const isMobile = w < 900;

  const catList     = getCategories().filter(c => c.active !== false);
  const allProducts = products || PRODUCTS;

  const priceRanges = [
    { label: '$0 — $5.000',        min: 0,     max: 5000 },
    { label: '$5.000 — $10.000',   min: 5000,  max: 10000 },
    { label: '$10.000 — $15.000',  min: 10000, max: 15000 },
    { label: 'Más de $15.000',     min: 15000, max: Infinity },
  ];

  const togglePriceFilter = (label) =>
    setPriceFilters(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);

  const toggleSizeFilter = (size) =>
    setSizeFilter(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

  // ── Filter pipeline ──
  let visible = category === 'todos' ? allProducts : allProducts.filter(p => p.category === category);

  if (favoritesOnly) {
    const favs = getFavorites();
    visible = visible.filter(p => favs.includes(p.id));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    visible = visible.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (priceFilters.length > 0) {
    visible = visible.filter(p =>
      priceFilters.some(label => {
        const range = priceRanges.find(r => r.label === label);
        return range && p.priceMay >= range.min && p.priceMay < range.max;
      })
    );
  }

  if (sizeFilter.length > 0) {
    visible = visible.filter(p => p.sizes && sizeFilter.some(s => p.sizes.includes(s)));
  }

  if (sort === 'Precio: menor a mayor') visible = [...visible].sort((a, b) => a.priceMay - b.priceMay);
  if (sort === 'Precio: mayor a menor') visible = [...visible].sort((a, b) => b.priceMay - a.priceMay);
  if (sort === 'Mayor margen')          visible = [...visible].sort((a, b) =>
    ((b.pricePvp - b.priceMay) / b.pricePvp) - ((a.pricePvp - a.priceMay) / a.pricePvp)
  );

  const currentCat = catList.find(c => c.id === category) || catList[0];

  // ── Active filter chips ──
  const activeFilters = [];
  if (category !== 'todos') {
    const cat = catList.find(c => c.id === category);
    if (cat) activeFilters.push({ label: cat.label, clear: () => setCategory('todos') });
  }
  priceFilters.forEach(label => activeFilters.push({ label, clear: () => togglePriceFilter(label) }));
  sizeFilter.forEach(s => activeFilters.push({ label: `Talle ${s}`, clear: () => toggleSizeFilter(s) }));
  if (search.trim()) activeFilters.push({ label: `"${search}"`, clear: () => setSearch('') });

  const clearAll = () => { setCategory('todos'); setPriceFilters([]); setSizeFilter([]); setSearch(''); };

  const quickViewProduct = quickViewId ? allProducts.find(p => p.id === quickViewId) : null;
  const gridCols = viewMode === 'list' ? '1fr' : (isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)');

  // ── Sidebar (reused in desktop aside + mobile drawer) ──
  const renderSidebar = () => (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Categoría</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 32 }}>
        {catList.map(c => (
          <li key={c.id}>
            <button
              onClick={() => { setCategory(c.id); setSidebarOpen(false); }}
              style={{ background: category === c.id ? 'rgba(26,26,46,0.08)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: category === c.id ? 600 : 400, color: 'var(--fg)' }}>
              <span>{c.label}</span>
              <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{c.count}</span>
            </button>
          </li>
        ))}
      </ul>

      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Talle</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
        {['XS','S','M','L','XL','36','38','40','42'].map(t => (
          <button key={t} onClick={() => toggleSizeFilter(t)}
            style={{ width: 40, height: 36, background: sizeFilter.includes(t) ? 'var(--vesto-noche)' : 'transparent', border: `1px solid ${sizeFilter.includes(t) ? 'var(--vesto-noche)' : 'var(--border)'}`, borderRadius: 4, fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)', cursor: 'pointer', color: sizeFilter.includes(t) ? 'var(--vesto-marfil)' : 'var(--fg)' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Precio mayorista</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, marginBottom: 32 }}>
        {priceRanges.map(r => (
          <label key={r.label} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
            <input type="checkbox" checked={priceFilters.includes(r.label)} onChange={() => togglePriceFilter(r.label)} style={{ accentColor: 'var(--vesto-noche)', width: 16, height: 16 }}/> {r.label}
          </label>
        ))}
      </div>

      <div style={{ background: 'rgba(22,163,74,0.08)', borderRadius: 8, padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 6 }}>¿Cuánto ganás?</div>
        <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 12 }}>Usá la calculadora para proyectar tus ganancias antes de comprar.</p>
        <button onClick={() => { onNav('calculator'); setSidebarOpen(false); }}
          style={{ background: 'transparent', border: '1px solid var(--vesto-verde-exito)', borderRadius: 4, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--vesto-verde-exito)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="trending" size={14} color="var(--vesto-verde-exito)"/> Abrir calculadora
        </button>
      </div>
    </div>
  );

  return (
    <main style={{ padding: `${isMobile ? 24 : 40}px var(--container-gutter) 64px` }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', marginBottom: 20, flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>
              {favoritesOnly ? 'Mis favoritas' : "Catálogo · OI '26"}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 40 : 56, letterSpacing: '-0.025em' }}>
              {favoritesOnly ? 'Favoritas.' : `${currentCat ? currentCat.label : 'Todas'}.`}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Desktop search */}
            {!isMobile && (
              <Input icon="search" placeholder="Buscar prendas…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }}/>
            )}
            <span style={{ fontSize: 13, color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>{visible.length} prendas</span>
            <select
              className="vesto-input"
              style={{ height: 40, width: isMobile ? 160 : 180, padding: '0 36px 0 14px', fontSize: 13, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231A1A2E%22 stroke-width=%221.75%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', flexShrink: 0 }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option>Más recientes</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mayor margen</option>
            </select>

            {/* View toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
              <button onClick={() => setViewMode('grid')} title="Vista grilla"
                style={{ width: 36, height: 40, background: viewMode === 'grid' ? 'var(--vesto-noche)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: viewMode === 'grid' ? 'var(--vesto-marfil)' : 'var(--fg-muted)', transition: 'background 180ms' }}>
                <Icon name="grid" size={15}/>
              </button>
              <button onClick={() => setViewMode('list')} title="Vista lista"
                style={{ width: 36, height: 40, background: viewMode === 'list' ? 'var(--vesto-noche)' : 'transparent', border: 'none', borderLeft: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: viewMode === 'list' ? 'var(--vesto-marfil)' : 'var(--fg-muted)', transition: 'background 180ms' }}>
                <Icon name="list" size={15}/>
              </button>
            </div>

            {/* Mobile filter button */}
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 14px', background: activeFilters.length > 0 ? 'var(--vesto-noche)' : 'transparent', border: `1px solid ${activeFilters.length > 0 ? 'var(--vesto-noche)' : 'var(--border)'}`, borderRadius: 6, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', color: activeFilters.length > 0 ? 'var(--vesto-marfil)' : 'var(--fg)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Icon name="filter" size={14} color={activeFilters.length > 0 ? 'var(--vesto-marfil)' : 'currentColor'}/>
                Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {isMobile && (
          <div style={{ marginBottom: 14 }}>
            <Input icon="search" placeholder="Buscar prendas…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%' }}/>
          </div>
        )}

        {/* ── Active filter chips ── */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
            {activeFilters.map((f, i) => (
              <button key={i} onClick={f.clear}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 30, padding: '0 12px', background: 'rgba(26,26,46,0.08)', border: 'none', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--fg)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,26,46,0.14)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(26,26,46,0.08)'}
              >
                {f.label} <Icon name="x" size={12}/>
              </button>
            ))}
            {activeFilters.length > 1 && (
              <button onClick={clearAll}
                style={{ fontSize: 12, fontWeight: 600, color: 'var(--vesto-champagne)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: '0 4px' }}>
                Limpiar todo
              </button>
            )}
          </div>
        )}

        {/* ── Main layout: sidebar + products ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', gap: 40 }}>

          {/* Desktop sidebar */}
          {!isMobile && <aside>{renderSidebar()}</aside>}

          {/* Products */}
          <div>
            {visible.length > 0 ? (
              viewMode === 'list' ? (
                <div>
                  {visible.map(p => <ProductListRow key={p.id} product={p} onClick={() => onNav('product', p.id)}/>)}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: isMobile ? 12 : 20 }}>
                  {visible.map(p => (
                    <CardWithQuickView key={p.id} product={p}
                      onClick={() => onNav('product', p.id)}
                      onQuickView={() => setQuickViewId(p.id)}
                    />
                  ))}
                </div>
              )
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <Icon name={favoritesOnly ? 'heart' : 'search'} size={36} color="var(--fg-subtle)" style={{ display: 'block', margin: '0 auto 16px' }}/>
                <p style={{ fontSize: 16, color: 'var(--fg-muted)' }}>
                  {favoritesOnly
                    ? 'Todavía no guardaste ninguna prenda.'
                    : 'No hay prendas que coincidan con los filtros aplicados.'}
                </p>
                {favoritesOnly ? (
                  <button onClick={() => onNav('catalog')}
                    style={{ marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--vesto-champagne)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    Ir al catálogo
                  </button>
                ) : (
                  <button onClick={clearAll}
                    style={{ marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--vesto-champagne)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {isMobile && sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setSidebarOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-overlay)', backdropFilter: 'blur(4px)' }}/>
          <div
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: Math.min(320, w * 0.88), background: 'var(--bg)', overflowY: 'auto', padding: 24, boxShadow: '6px 0 24px rgba(26,26,46,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, margin: 0 }}>Filtros</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--fg-muted)' }}>
                <Icon name="x" size={20}/>
              </button>
            </div>
            {renderSidebar()}
          </div>
        </div>
      )}

      {/* ── Quick view modal ── */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewId(null)}
          onNav={onNav}
          onAddToCart={onAddToCart}
        />
      )}
    </main>
  );
}

// Card with "Vista rápida" hover overlay
function CardWithQuickView({ product, onClick, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  const w = useWindowWidth();
  const isTouch = w < 900; // touch devices: show button always
  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProductCard product={product} onClick={onClick}/>
      <button
        onClick={e => { e.stopPropagation(); onQuickView(); }}
        style={{
          position: 'absolute',
          bottom: 72,
          left: '50%',
          transform: `translateX(-50%) translateY(${(hovered || isTouch) ? 0 : 8}px)`,
          opacity: (hovered || isTouch) ? 1 : 0,
          transition: 'opacity 180ms, transform 180ms',
          background: 'rgba(26,26,46,0.88)',
          color: 'var(--vesto-marfil)',
          border: 'none',
          borderRadius: 6,
          padding: '7px 14px',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          backdropFilter: 'blur(8px)',
          whiteSpace: 'nowrap',
          pointerEvents: (hovered || isTouch) ? 'auto' : 'none',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}>
        <Icon name="eye" size={13} color="var(--vesto-marfil)"/> Vista rápida
      </button>
    </div>
  );
}

window.Catalog = Catalog;
