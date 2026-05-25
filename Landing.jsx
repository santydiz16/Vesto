/* eslint-disable */

function Landing({ onNav, products }) {
  const [audience, setAudience] = useState('emprendedora');
  const featured = (products || PRODUCTS).slice(0, 4);

  return (
    <main>
      {/* HERO */}
      <section style={{ padding: '64px var(--container-gutter) 96px' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(201,169,110,0.18)', border: '1px solid var(--vesto-champagne)', borderRadius: 999, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vesto-champagne)' }}></span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vesto-noche)' }}>+2000 prendas activas</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 88, lineHeight: 0.98, letterSpacing: '-0.035em', marginBottom: 24 }}>
              Vestí<br/>tu negocio.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--fg-muted)', maxWidth: 460, marginBottom: 36 }}>
              Vendé ropa sin stock ni riesgo, o reponé tu local con precios mayoristas reales.
              Catálogo, pedidos y academia de ventas en una sola plataforma.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav('catalog')}>Ver catálogo</Button>
              <Button variant="ghost" size="lg" onClick={() => onNav('calculator')}>Calculá tu ganancia</Button>
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 24, fontSize: 13, color: 'var(--fg-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Sin mínimo</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Envío 48hs</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Dropshipping</span>
            </div>
          </div>
          {/* HERO IMAGE — placeholder */}
          <div style={{ position: 'relative', aspectRatio: '7/8', borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(160deg, #D9CBB3 0%, #8B5E3C 60%, #1A1A2E 100%)' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.04) 0 1px, transparent 1px 14px), repeating-linear-gradient(90deg, rgba(245,240,232,0.04) 0 1px, transparent 1px 14px)' }}></div>
            <div style={{ position: 'absolute', top: 24, left: 24, color: 'var(--vesto-marfil)', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7 }}>Lookbook OI '26</div>
            <div style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 48, lineHeight: 1, color: 'var(--vesto-marfil)', marginBottom: 8, letterSpacing: '-0.02em' }}>Cápsula esencial.</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--vesto-marfil)', opacity: 0.7, maxWidth: 380, lineHeight: 1.5 }}>Una temporada de fibras nobles, cortes oversize, paleta tierra. Listos para tu vidriera o tu Instagram.</div>
              <div style={{ marginTop: 24 }}>
                <Button variant="accent" iconAfter="arrowRight" onClick={() => onNav('catalog')}>Explorar catálogo</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE SWITCHER */}
      <section style={{ padding: '0 var(--container-gutter)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'start' }}>
          <button onClick={() => setAudience('emprendedora')}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 16, borderRadius: 8, opacity: audience === 'emprendedora' ? 1 : 0.45, transition: 'opacity 220ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--vesto-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vesto-noche)' }}><Icon name="trending" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>Soy emprendedora</h3>
            </div>
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 400 }}>
              Vendé desde Instagram, WhatsApp o tu sitio. Nosotros despachamos al cliente final. Vos te quedás con la diferencia.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Dropshipping incluido</li>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Academia de ventas online</li>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Pedí desde 1 unidad</li>
            </ul>
          </button>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }}></div>
          <button onClick={() => setAudience('comercio')}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 16, borderRadius: 8, opacity: audience === 'comercio' ? 1 : 0.45, transition: 'opacity 220ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--vesto-noche)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vesto-marfil)' }}><Icon name="package" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, lineHeight: 1, letterSpacing: '-0.02em' }}>Tengo un local</h3>
            </div>
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 400 }}>
              Reponé sin volverte loca con proveedores intermitentes. Precios fijos por trimestre, stock real, despacho coordinado.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Precio mayorista escalonado</li>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Cuenta corriente a 30 días</li>
              <li style={{ display: 'flex', gap: 8 }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Catálogo PDF para imprimir</li>
            </ul>
          </button>
        </div>
      </section>

      {/* FEATURED GRID */}
      <section style={{ padding: '96px var(--container-gutter) 32px' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Lo último que entró</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '-0.025em' }}>Novedades de la semana.</h2>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav('catalog'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, borderBottom: 'none' }}>
              Ver todo el catálogo <Icon name="arrowRight" size={16}/>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onClick={() => onNav('product', p.id)} />)}
          </div>
        </div>
      </section>

      {/* CALCULATOR CTA */}
      <section style={{ padding: '0 var(--container-gutter) 64px' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 8, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="trending" size={28} color="var(--vesto-verde-exito)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>Herramienta gratuita</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>Calculadora de ganancias.</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Encontrá tu precio ideal y proyectá cuánto ganás por mes antes de hacer el pedido.</p>
            </div>
          </div>
          <Button variant="primary" iconAfter="arrowRight" onClick={() => onNav('calculator')}>Probar ahora</Button>
        </div>
      </section>

      {/* DARK CTA */}
      <section style={{ padding: '0 var(--container-gutter) 64px' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--vesto-noche)', borderRadius: 16, padding: '80px 64px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px)' }}></div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 16 }}>Academia VESTO</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 64, lineHeight: 1, color: 'var(--vesto-marfil)', letterSpacing: '-0.03em', marginBottom: 20 }}>
                Aprendé a vender ropa por Instagram.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--fg-inverse-muted)', maxWidth: 540 }}>
                12 clases en video con fotógrafas, copywriters y revendedoras que facturan +$3M al mes. Gratis cuando te registrás como emprendedora.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              <Button variant="accent" size="lg" iconAfter="arrowRight">Sumarme gratis</Button>
              <Button variant="ghost" size="lg" style={{ color: 'var(--vesto-marfil)', borderColor: 'var(--border-inverse)' }}>Ver programa</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

window.Landing = Landing;
