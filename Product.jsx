/* eslint-disable */

function Product({ onNav, productId, onAddToCart, products }) {
  const allProducts = products || PRODUCTS;
  const product = allProducts.find(p => p.id === productId) || allProducts[0];
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const ganancia = (product.pricePvp || 0) - (product.priceMay || 0);
  const margen = product.pricePvp > 0 ? Math.round((ganancia / product.pricePvp) * 100) : 0;
  const gananciaTotal = ganancia * qty;

  return (
    <main style={{ padding: '24px var(--container-gutter) 64px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Breadcrumb */}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-muted)', marginBottom: 32, display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('landing'); }} style={{ borderBottom: 'none' }}>Inicio</a>
          <span>/</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('catalog'); }} style={{ borderBottom: 'none' }}>Catálogo</a>
          <span>/</span>
          <span style={{ color: 'var(--fg)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 56 }}>
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: '4/5', background: product.bg, borderRadius: 12, marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
              {product.image && (
                <img
                  src={product.image} alt={product.name}
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
              {!product.image && <div style={{ position: 'absolute', bottom: 16, right: 16, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(245,240,232,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>FOTO 1 · principal</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ aspectRatio: '4/5', background: product.bg, borderRadius: 8, opacity: i === 1 ? 1 : 0.7, border: i === 1 ? '2px solid var(--vesto-noche)' : '2px solid transparent', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  {product.image && i === 1 && (
                    <img src={product.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>
                  )}
                  {!product.image && <div style={{ position: 'absolute', bottom: 8, left: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(245,240,232,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>FOTO {i}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12, textTransform: 'capitalize' }}>{product.category}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '-0.025em', marginBottom: 16, lineHeight: 1.05 }}>{product.name}</h1>

            {/* Prices */}
            <div style={{ display: 'flex', gap: 32, padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>Tu precio mayorista</div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 40, lineHeight: 1, color: 'var(--fg)' }}>${(product.priceMay || 0).toLocaleString('es-AR')}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>PVP sugerido</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 500, color: 'var(--fg-muted)' }}>${(product.pricePvp || 0).toLocaleString('es-AR')}</div>
              </div>
              <div style={{ marginLeft: 'auto', alignSelf: 'center', textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 4 }}>Ganás</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: 'var(--vesto-verde-exito)' }}>${ganancia.toLocaleString('es-AR')} <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)' }}>· {margen}%</span></div>
              </div>
            </div>

            {/* Mini calc row */}
            {ganancia > 0 && (
              <div style={{ background: 'rgba(22,163,74,0.07)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 2 }}>Con {qty} {qty === 1 ? 'unidad' : 'unidades'}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: 'var(--vesto-verde-exito)' }}>${gananciaTotal.toLocaleString('es-AR')}</div>
                </div>
                <button onClick={() => onNav('calculator')} style={{ background: 'transparent', border: '1px solid rgba(22,163,74,0.4)', borderRadius: 4, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: 'var(--vesto-verde-exito)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="trending" size={14} color="var(--vesto-verde-exito)"/> Calculadora
                </button>
              </div>
            )}

            {/* Sizes */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Talle</span>
                <a href="#" style={{ fontSize: 12, color: 'var(--fg-muted)', borderBottom: 'none' }}>Guía de talles</a>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(product.sizes || []).map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ minWidth: 52, height: 44, background: size === s ? 'var(--vesto-noche)' : 'transparent', color: size === s ? 'var(--vesto-marfil)' : 'var(--fg)', border: '1px solid ' + (size === s ? 'var(--vesto-noche)' : 'var(--border-strong)'), borderRadius: 4, fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)', cursor: 'pointer', padding: '0 12px' }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden', height: 56 }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 56, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="minus" size={16} /></button>
                <span style={{ width: 36, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 56, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={16} /></button>
              </div>
              <Button variant="primary" size="lg" iconAfter="arrowRight" style={{ flex: 1 }} onClick={() => { onAddToCart({ ...product, size: size || (product.sizes || [])[0], qty }); onNav('cart'); }}>
                Agregar al pedido
              </Button>
            </div>

            {/* Logistics */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="truck" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Envío en 48hs hábiles</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Despachamos por OCA o Andreani a todo el país.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="package" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Stock: {product.stock || 0} unidades</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Reposición prevista cada 2 semanas.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Icon name="instagram" size={18} color="var(--vesto-champagne)" style={{ marginTop: 2 }}/>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Material listo para Instagram</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-muted)' }}>Descargá fotos y descripción optimizada en un click.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

window.Product = Product;
