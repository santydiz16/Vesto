/* eslint-disable */

function Product({ onNav, productId, onAddToCart, products }) {
  const allProducts = products || PRODUCTS;
  const product = allProducts.find(p => p.id === productId) || allProducts[0];
  const [size, setSize] = useState(null);
  const [qty,  setQty]  = useState(1);

  const w        = useWindowWidth();
  const isMobile = w < 900;

  if (!product) return null;

  const ganancia      = (product.pricePvp || 0) - (product.priceMay || 0);
  const margen        = product.pricePvp > 0 ? Math.round((ganancia / product.pricePvp) * 100) : 0;
  const gananciaTotal = ganancia * qty;

  // Related products: same category, exclude current, max 4
  const related = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const shareOnWhatsApp = () => {
    const text = `¡Mirá esta prenda! *${product.name}*\n\nPrecio mayorista: $${(product.priceMay || 0).toLocaleString('es-AR')}\nPVP sugerido: $${(product.pricePvp || 0).toLocaleString('es-AR')}\nGanás: $${ganancia.toLocaleString('es-AR')} por unidad\n\nVía VESTO — plataforma mayorista de indumentaria.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  return (
    <main style={{ padding: `${isMobile ? 16 : 24}px var(--container-gutter) 64px` }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-muted)', marginBottom: isMobile ? 20 : 32, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('landing'); }} style={{ borderBottom: 'none' }}>Inicio</a>
          <span>/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('catalog'); }} style={{ borderBottom: 'none' }}>Catálogo</a>
          <span>/</span>
          <span style={{ color: 'var(--fg)' }}>{product.name}</span>
        </div>

        {/* ── Main product layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '7fr 5fr', gap: isMobile ? 28 : 56 }}>

          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: '4/5', background: product.bg, borderRadius: 12, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              {product.image && (
                <img src={product.image} alt={product.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              )}
              {product.badge && <div style={{ position: 'absolute', top: 16, left: 16 }}><Badge variant={product.badgeVariant}>{product.badge}</Badge></div>}
              {margen > 0 && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(22,163,74,0.9)', borderRadius: 4, padding: '4px 10px', backdropFilter: 'blur(4px)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>+{margen}% margen</span>
                </div>
              )}
              {!product.image && (
                <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,240,232,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>FOTO 1 · principal</div>
              )}
            </div>
            {/* Thumbnails */}
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ aspectRatio: '4/5', background: product.bg, borderRadius: 8, opacity: i === 1 ? 1 : 0.7, border: i === 1 ? '2px solid var(--vesto-noche)' : '2px solid transparent', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                    {product.image && i === 1 && (
                      <img src={product.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>
                    )}
                    {!product.image && (
                      <div style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>FOTO {i}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'capitalize' }}>{product.category}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 36 : 48, letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.05 }}>{product.name}</h1>

            {/* Prices */}
            <div style={{ display: 'flex', gap: isMobile ? 20 : 32, padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>Tu precio mayorista</div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 32 : 40, lineHeight: 1, color: 'var(--fg)' }}>${(product.priceMay || 0).toLocaleString('es-AR')}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>PVP sugerido</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? 20 : 24, fontWeight: 500, color: 'var(--fg-muted)' }}>${(product.pricePvp || 0).toLocaleString('es-AR')}</div>
              </div>
              <div style={{ marginLeft: 'auto', alignSelf: 'center', textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 4 }}>Ganás</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 700, color: 'var(--vesto-verde-exito)' }}>
                  ${ganancia.toLocaleString('es-AR')} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)' }}>· {margen}%</span>
                </div>
              </div>
            </div>

            {/* Mini profit calculator */}
            {ganancia > 0 && (
              <div style={{ background: 'rgba(22,163,74,0.07)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 2 }}>Con {qty} {qty === 1 ? 'unidad' : 'unidades'}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'var(--vesto-verde-exito)' }}>${gananciaTotal.toLocaleString('es-AR')}</div>
                </div>
                <button onClick={() => onNav('calculator')}
                  style={{ background: 'transparent', border: '1px solid rgba(22,163,74,0.4)', borderRadius: 4, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--vesto-verde-exito)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                  <Icon name="trending" size={14} color="var(--vesto-verde-exito)"/> Calculadora
                </button>
              </div>
            )}

            {/* Sizes */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Talle</span>
                <a href="#" style={{ fontSize: 12, color: 'var(--fg-muted)', borderBottom: 'none' }}>Guía de talles</a>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(product.sizes || []).map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{ minWidth: 52, height: 44, background: size === s ? 'var(--vesto-noche)' : 'transparent', color: size === s ? 'var(--vesto-marfil)' : 'var(--fg)', border: '1px solid ' + (size === s ? 'var(--vesto-noche)' : 'var(--border-strong)'), borderRadius: 4, fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)', cursor: 'pointer', padding: '0 12px' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden', height: 56, flexShrink: 0 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 44, height: 56, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="minus" size={16} />
                </button>
                <span style={{ width: 36, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)}
                  style={{ width: 44, height: 56, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <Button variant="primary" size="lg" iconAfter="arrowRight" style={{ flex: 1 }}
                onClick={() => { onAddToCart({ ...product, size: size || (product.sizes || [])[0], qty }); onNav('cart'); }}>
                Agregar al pedido
              </Button>
            </div>

            {/* WhatsApp share */}
            <button onClick={shareOnWhatsApp}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 44, background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#1a7a3a', fontFamily: 'var(--font-body)', marginBottom: 20 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a7a3a" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>
              </svg>
              Compartir por WhatsApp
            </button>

            {/* Logistics info */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="truck" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Envío en 48hs hábiles</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Despachamos por OCA o Andreani a todo el país.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="package" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Stock: {product.stock || 0} unidades
                    {(product.stock || 0) > 0 && (product.stock || 0) <= 8 && (
                      <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: 'var(--vesto-coral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>¡Últimas!</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Reposición prevista cada 2 semanas.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="instagram" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Material listo para Instagram</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Descargá fotos y descripción optimizada en un click.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section style={{ marginTop: isMobile ? 48 : 72 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>De la misma colección</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 28 : 36, letterSpacing: '-0.025em' }}>También te puede interesar.</h2>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); onNav('catalog'); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, borderBottom: 'none', whiteSpace: 'nowrap', color: 'var(--fg-muted)' }}>
                Ver todo <Icon name="arrowRight" size={16}/>
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${related.length < 4 ? related.length : 4}, 1fr)`, gap: isMobile ? 12 : 20 }}>
              {related.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => { onNav('product', p.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}/>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

window.Product = Product;
