/* eslint-disable */

function Catalog({ onNav, products }) {
  const [category, setCategory] = useState('todos');
  const [sort, setSort] = useState('Más recientes');
  const [search, setSearch] = useState('');
  const [priceFilters, setPriceFilters] = useState([]);
  const [sizeFilter, setSizeFilter] = useState([]);

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

  let visible = category === 'todos' ? allProducts : allProducts.filter(p => p.category === category);

  if (search.trim()) {
    const q = search.toLowerCase();
    visible = visible.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (priceFilters.length > 0) {
    visible = visible.filter(p => {
      return priceFilters.some(label => {
        const range = priceRanges.find(r => r.label === label);
        return range && p.priceMay >= range.min && p.priceMay < range.max;
      });
    });
  }

  if (sizeFilter.length > 0) {
    visible = visible.filter(p => p.sizes && sizeFilter.some(s => p.sizes.includes(s)));
  }

  if (sort === 'Precio: menor a mayor') visible = [...visible].sort((a, b) => a.priceMay - b.priceMay);
  if (sort === 'Precio: mayor a menor') visible = [...visible].sort((a, b) => b.priceMay - a.priceMay);
  if (sort === 'Mayor margen')          visible = [...visible].sort((a, b) => ((b.pricePvp - b.priceMay) / b.pricePvp) - ((a.pricePvp - a.priceMay) / a.pricePvp));

  const currentCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];

  return (
    <main style={{ padding: '40px var(--container-gutter) 64px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Catálogo · OI '26</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, letterSpacing: '-0.025em' }}>{currentCat.label}.</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Input
              icon="search"
              placeholder="Buscar prendas…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 220 }}
            />
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{visible.length} prendas · ordenar por</span>
            <select
              className="vesto-input"
              style={{ height: 40, width: 200, padding: '0 36px 0 14px', fontSize: 14, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231A1A2E%22 stroke-width=%221.75%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option>Más recientes</option>
              <option>Precio: menor a mayor</option>
              <option>Precio: mayor a menor</option>
              <option>Mayor margen</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>
          {/* SIDEBAR */}
          <aside>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Categoría</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 32 }}>
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <button onClick={() => setCategory(c.id)} style={{ background: category === c.id ? 'rgba(26,26,46,0.08)' : 'transparent', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: category === c.id ? 600 : 400, color: 'var(--fg)' }}>
                    <span>{c.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>{c.count}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Talle</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
              {['XS','S','M','L','XL','36','38','40','42'].map(t => (
                <button key={t} onClick={() => toggleSizeFilter(t)} style={{ width: 40, height: 36, background: sizeFilter.includes(t) ? 'var(--vesto-noche)' : 'transparent', border: `1px solid ${sizeFilter.includes(t) ? 'var(--vesto-noche)' : 'var(--border)'}`, borderRadius: 4, fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)', cursor: 'pointer', color: sizeFilter.includes(t) ? 'var(--vesto-marfil)' : 'var(--fg)' }}>{t}</button>
              ))}
            </div>

            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Precio mayorista</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, marginBottom: 32 }}>
              {priceRanges.map(r => (
                <label key={r.label} style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={priceFilters.includes(r.label)} onChange={() => togglePriceFilter(r.label)} style={{ accentColor: 'var(--vesto-noche)', width: 16, height: 16 }}/> {r.label}
                </label>
              ))}
            </div>

            {/* Quick calc link */}
            <div style={{ background: 'rgba(22,163,74,0.08)', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 6 }}>¿Cuánto ganás?</div>
              <p style={{ fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.5, marginBottom: 12 }}>Usá la calculadora para proyectar tus ganancias antes de comprar.</p>
              <button onClick={() => onNav('calculator')} style={{ background: 'transparent', border: '1px solid var(--vesto-verde-exito)', borderRadius: 4, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--vesto-verde-exito)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="trending" size={14} color="var(--vesto-verde-exito)"/> Abrir calculadora
              </button>
            </div>
          </aside>

          {/* GRID */}
          <div>
            {visible.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {visible.map(p => <ProductCard key={p.id} product={p} onClick={() => onNav('product', p.id)} />)}
              </div>
            ) : (
              <div style={{ padding: '80px 0', textAlign: 'center' }}>
                <Icon name="search" size={36} color="var(--fg-subtle)" style={{ display: 'block', margin: '0 auto 16px' }}/>
                <p style={{ fontSize: 16, color: 'var(--fg-muted)' }}>No hay prendas que coincidan con los filtros aplicados.</p>
                <button onClick={() => { setSearch(''); setPriceFilters([]); setSizeFilter([]); setCategory('todos'); }} style={{ marginTop: 12, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--vesto-champagne)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Limpiar filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

window.Catalog = Catalog;
