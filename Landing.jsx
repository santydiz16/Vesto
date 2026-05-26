/* eslint-disable */

function Landing({ onNav, products }) {
  const [audience, setAudience] = useState('emprendedora');
  const w = useWindowWidth();
  const isMobile = w < 700;
  const isTablet = w >= 700 && w < 1000;

  const featured = (products || PRODUCTS).slice(0, 4);

  const TESTIMONIALS = [
    {
      name: 'Valentina G.',
      city: 'Córdoba · 8 meses en VESTO',
      avatar: '#C9A96E',
      stars: 5,
      text: 'Empecé con $30.000 y en dos meses ya tenía más de 80 clientas. La academia me cambió la forma de mostrar las prendas en Instagram. Hoy vendo más de $400K por mes.',
    },
    {
      name: 'Florencia M.',
      city: 'Buenos Aires · 1 año en VESTO',
      avatar: '#5C7A5F',
      stars: 5,
      text: 'Lo que más me gustó fue no tener que guardar mercadería. VESTO despacha por mí y yo me dedico a vender. El catálogo siempre está actualizado y los precios son reales.',
    },
    {
      name: 'Rocío P.',
      city: 'Rosario · 5 meses en VESTO',
      avatar: '#1A1A2E',
      stars: 5,
      text: 'Tengo mi local hace 4 años y nunca había tenido un proveedor tan prolijo. Los pedidos llegan en tiempo y forma, y la calidad es consistente. Mis clientas me preguntan de dónde saco la ropa.',
    },
  ];

  return (
    <main>
      {/* ── HERO ── */}
      <section style={{ padding: isMobile ? '40px var(--container-gutter) 56px' : '64px var(--container-gutter) 96px' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr', gap: isMobile ? 36 : 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'rgba(201,169,110,0.18)', border: '1px solid var(--vesto-champagne)', borderRadius: 999, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--vesto-champagne)', flexShrink: 0 }}></span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vesto-champagne)' }}>+2000 prendas activas</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 56 : 88, lineHeight: 0.98, letterSpacing: '-0.035em', marginBottom: 24 }}>
              Vestí<br/>tu negocio.
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 19, lineHeight: 1.5, color: 'var(--fg-muted)', maxWidth: 460, marginBottom: 36 }}>
              Vendé ropa sin stock ni riesgo, o reponé tu local con precios mayoristas reales.
              Catálogo, pedidos y academia de ventas en una sola plataforma.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="primary" size={isMobile ? 'md' : 'lg'} iconAfter="arrowRight" onClick={() => onNav('catalog')}>Ver catálogo</Button>
              <Button variant="ghost" size={isMobile ? 'md' : 'lg'} onClick={() => onNav('calculator')}>Calculá tu ganancia</Button>
            </div>
            <div style={{ marginTop: 28, display: 'flex', gap: isMobile ? 14 : 24, fontSize: 13, color: 'var(--fg-muted)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Sin mínimo</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Envío 48hs</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="check" size={14} color="var(--vesto-verde-exito)"/> Dropshipping</span>
            </div>
          </div>

          {/* Hero image — hidden on mobile */}
          {!isMobile && (
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
          )}
        </div>
      </section>

      {/* ── AUDIENCE SWITCHER ── */}
      <section style={{ padding: '0 var(--container-gutter)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '24px 20px' : 40, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', gap: isMobile ? 0 : 32, alignItems: 'start' }}>
          <button onClick={() => setAudience('emprendedora')}
            style={{ background: audience === 'emprendedora' ? 'rgba(26,26,46,0.04)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: isMobile ? '20px 0' : 16, borderRadius: 8, opacity: audience === 'emprendedora' ? 1 : 0.45, transition: 'opacity 220ms, background 220ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--vesto-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vesto-noche)', flexShrink: 0 }}><Icon name="trending" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 26 : 32, lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>Soy emprendedora</h3>
            </div>
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 400 }}>
              Vendé desde Instagram, WhatsApp o tu sitio. Nosotros despachamos al cliente final. Vos te quedás con la diferencia.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Dropshipping incluido</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Academia de ventas online</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-champagne)"/> Pedí desde 1 unidad</li>
            </ul>
          </button>

          {isMobile
            ? <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}/>
            : <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }}/>
          }

          <button onClick={() => setAudience('comercio')}
            style={{ background: audience === 'comercio' ? 'rgba(26,26,46,0.04)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', padding: isMobile ? '20px 0' : 16, borderRadius: 8, opacity: audience === 'comercio' ? 1 : 0.45, transition: 'opacity 220ms, background 220ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--vesto-noche)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vesto-marfil)', flexShrink: 0 }}><Icon name="package" /></div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 26 : 32, lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>Tengo un local</h3>
            </div>
            <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 400 }}>
              Reponé sin volverte loca con proveedores intermitentes. Precios fijos por trimestre, stock real, despacho coordinado.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Precio mayorista escalonado</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Cuenta corriente a 30 días</li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Icon name="check" size={16} color="var(--vesto-noche)"/> Catálogo PDF para imprimir</li>
            </ul>
          </button>
        </div>
      </section>

      {/* ── FEATURED GRID ── */}
      <section style={{ padding: `${isMobile ? 56 : 96}px var(--container-gutter) 32px` }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexDirection: isMobile ? 'column' : 'row', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Lo último que entró</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 32 : 48, letterSpacing: '-0.025em' }}>Novedades de la semana.</h2>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav('catalog'); }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, borderBottom: 'none', whiteSpace: 'nowrap' }}>
              Ver todo el catálogo <Icon name="arrowRight" size={16}/>
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 20 }}>
            {featured.map(p => <ProductCard key={p.id} product={p} onClick={() => onNav('product', p.id)} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: `${isMobile ? 48 : 80}px var(--container-gutter)` }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 32 : 48 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>Lo que dicen nuestras revendedoras</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 32 : 44, letterSpacing: '-0.025em' }}>Ellas ya están vendiendo.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 16 : 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? 24 : 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="var(--vesto-champagne)" stroke="var(--vesto-champagne)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88L2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--fg)', fontStyle: 'italic', margin: 0, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR CTA ── */}
      <section style={{ padding: `0 var(--container-gutter) ${isMobile ? 48 : 64}px` }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: isMobile ? '24px 20px' : '40px 48px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? 20 : 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 8, background: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="trending" size={28} color="var(--vesto-verde-exito)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>Herramienta gratuita</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 22 : 28, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 }}>Calculadora de ganancias.</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-muted)' }}>Encontrá tu precio ideal y proyectá cuánto ganás por mes antes de hacer el pedido.</p>
            </div>
          </div>
          <Button variant="primary" iconAfter="arrowRight" onClick={() => onNav('calculator')} style={{ flexShrink: 0 }}>Probar ahora</Button>
        </div>
      </section>

      {/* ── DARK ACADEMY CTA ── */}
      <section style={{ padding: `0 var(--container-gutter) ${isMobile ? 48 : 64}px` }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', background: 'var(--vesto-noche)', borderRadius: 16, padding: isMobile ? '48px 24px' : '80px 64px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px)' }}></div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '7fr 5fr', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 16 }}>Academia VESTO</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 40 : 64, lineHeight: 1, color: 'var(--vesto-marfil)', letterSpacing: '-0.03em', marginBottom: 20 }}>
                Aprendé a vender ropa por Instagram.
              </h2>
              <p style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.55, color: 'var(--fg-inverse-muted)', maxWidth: 540 }}>
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
