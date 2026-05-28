/* eslint-disable */

function Calculator({ onNav, products }) {
  const [costo, setCosto]   = useState('');
  const [pvp, setPvp]       = useState('');
  const [qty, setQty]       = useState(30);
  const [presetId, setPresetId] = useState('');

  const allProducts = products || getProducts();
  const w       = useWindowWidth();
  const isMobile = w < 900;

  // Parse Argentine number format (dots as thousands separator)
  const parseNum = (str) => {
    if (!str) return 0;
    return parseFloat(String(str).replace(/\./g, '').replace(',', '.')) || 0;
  };

  const costoNum    = parseNum(costo);
  const pvpNum      = parseNum(pvp);
  const ganUnit     = pvpNum - costoNum;
  const margenPct   = pvpNum > 0 ? Math.round((ganUnit / pvpNum) * 100) : 0;
  const ganMes      = ganUnit * qty;
  const hasBoth     = costoNum > 0 && pvpNum > 0;

  const fmtARS = (n) => Math.round(n).toLocaleString('es-AR');

  const margenColor =
    margenPct >= 40 ? 'var(--vesto-verde-exito)' :
    margenPct >= 25 ? 'var(--vesto-champagne)'   :
    'var(--vesto-coral)';

  const margenLabel =
    margenPct >= 40 ? '✓ Muy buen margen' :
    margenPct >= 25 ? '↑ Margen aceptable' :
    margenPct > 0  ? '↓ Margen bajo — ajustá el precio' :
    pvpNum > 0 && pvpNum <= costoNum ? '⚠ Estás vendiendo a pérdida' : '';

  const loadProduct = (id) => {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    setCosto(String(p.priceMay));
    setPvp(String(p.pricePvp));
    setPresetId(id);
  };

  // Price comparison table — what happens at different PVP multipliers
  const priceTable = useMemo(() => {
    if (!costoNum) return [];
    return [1.10, 1.25, 1.40, 1.55, 1.70, 1.90, 2.20, 2.60].map(mult => {
      const p    = Math.round(costoNum * mult / 100) * 100;
      const g    = p - costoNum;
      const m    = p > 0 ? Math.round((g / p) * 100) : 0;
      return { pvp: p, ganUnit: g, margen: m, ganMes: g * qty };
    });
  }, [costoNum, qty]);

  const scenarios = [
    { label: 'Conservador', qty: Math.max(1, Math.round(qty * 0.5)), note: '50% de tu meta' },
    { label: 'Tu meta',     qty: qty,                                 note: `${qty} u/mes`, highlight: true },
    { label: 'Optimista',   qty: Math.round(qty * 2),                 note: 'el doble de tu meta' },
  ];

  const selectStyle = {
    height: 44, width: '100%', padding: '0 36px 0 14px', fontSize: 14,
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%231A1A2E%22 stroke-width=%221.75%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <main style={{ padding: '40px var(--container-gutter) 80px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: isMobile ? 20 : 0, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Herramienta gratuita</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 40 : 56, letterSpacing: '-0.025em', lineHeight: 1.05, marginBottom: 12 }}>Calculadora de ganancias.</h1>
            <p style={{ fontSize: 16, color: 'var(--fg-muted)', maxWidth: 520, lineHeight: 1.55 }}>
              Encontrá el precio ideal y proyectá cuánto ganás antes de hacer el pedido. Podés cargar cualquier prenda del catálogo o ingresar tus propios números.
            </p>
          </div>
          <Button variant="ghost" icon="bag" onClick={() => onNav('catalog')}>Ver catálogo</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr', gap: 40, alignItems: 'start' }}>

          {/* ── LEFT: INPUTS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Load from catalog */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>Cargar desde catálogo</div>
              <select className="vesto-input" value={presetId} onChange={e => loadProduct(e.target.value)} style={selectStyle}>
                <option value="">Elegir prenda del catálogo…</option>
                {allProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — ${p.priceMay.toLocaleString('es-AR')}</option>
                ))}
              </select>
            </div>

            {/* Prices */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 20 }}>Precios</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Precio de costo (mayorista)</span>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--fg-subtle)', fontSize: 15, pointerEvents: 'none' }}>$</span>
                    <input
                      className="vesto-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="8.900"
                      value={costo}
                      onChange={e => { setCosto(e.target.value); setPresetId(''); }}
                      style={{ paddingLeft: 28, width: '100%', fontSize: 20, height: 56, fontWeight: 600, fontFamily: 'var(--font-display)', fontStyle: 'italic', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Precio de venta al público (PVP)</span>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--fg-subtle)', fontSize: 15, pointerEvents: 'none' }}>$</span>
                    <input
                      className="vesto-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="14.900"
                      value={pvp}
                      onChange={e => { setPvp(e.target.value); setPresetId(''); }}
                      style={{ paddingLeft: 28, width: '100%', fontSize: 20, height: 56, fontWeight: 600, fontFamily: 'var(--font-display)', fontStyle: 'italic', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity slider */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Unidades esperadas / mes</div>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, color: 'var(--fg)' }}>{qty}</span>
              </div>
              <input
                type="range" min="1" max="200" step="1" value={qty}
                onChange={e => setQty(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--vesto-noche)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-subtle)', marginTop: 8 }}>
                <span>1</span><span>50</span><span>100</span><span>150</span><span>200</span>
              </div>
              {/* Quick set buttons */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                {[5, 15, 30, 50, 100].map(n => (
                  <button key={n} onClick={() => setQty(n)}
                    style={{ flex: 1, height: 32, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', borderRadius: 4, cursor: 'pointer', background: qty === n ? 'var(--vesto-noche)' : 'transparent', color: qty === n ? 'var(--vesto-marfil)' : 'var(--fg)', border: `1px solid ${qty === n ? 'var(--vesto-noche)' : 'var(--border)'}`, transition: 'all 160ms' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: OUTPUTS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {hasBoth ? (
              <>
                {/* Main result card */}
                <div style={{ background: 'var(--vesto-noche)', borderRadius: 16, padding: '32px 36px', color: 'var(--vesto-marfil)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'repeating-linear-gradient(0deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(245,240,232,0.5) 0 1px, transparent 1px 12px)' }}></div>
                  <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 24 }}>
                    {/* Margen */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 10 }}>Margen</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 64, lineHeight: 1, color: margenPct >= 30 ? '#4ade80' : margenPct >= 15 ? 'var(--vesto-champagne)' : '#f87171' }}>{margenPct}%</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.55)', marginTop: 8, lineHeight: 1.4 }}>{margenLabel}</div>
                    </div>
                    {/* Gan/u */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 10 }}>Ganás por unidad</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, color: ganUnit > 0 ? 'var(--vesto-marfil)' : '#f87171' }}>${fmtARS(ganUnit)}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.55)', marginTop: 8 }}>costo ${fmtARS(costoNum)}</div>
                    </div>
                    {/* Mensual */}
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 10 }}>Ganancia mensual</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, color: ganMes > 0 ? '#4ade80' : '#f87171' }}>${fmtARS(ganMes)}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,240,232,0.55)', marginTop: 8 }}>con {qty} u/mes</div>
                    </div>
                  </div>
                </div>

                {/* Scenarios */}
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 20 }}>Escenarios de ganancia mensual</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                    {scenarios.map(s => (
                      <div key={s.label} style={{ padding: 20, borderRadius: 8, textAlign: 'center', background: s.highlight ? 'rgba(26,26,46,0.06)' : 'transparent', border: `1px solid ${s.highlight ? 'var(--vesto-noche)' : 'var(--border)'}` }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.highlight ? 'var(--vesto-noche)' : 'var(--fg-muted)', marginBottom: 10 }}>{s.label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1, color: ganUnit > 0 ? 'var(--fg)' : 'var(--vesto-coral)', marginBottom: 6 }}>${fmtARS(ganUnit * s.qty)}</div>
                        <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{s.qty} u/mes</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 56, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(201,169,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Icon name="trending" size={32} color="var(--vesto-champagne)" />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, marginBottom: 10 }}>Tu ganancia aparece acá.</h3>
                <p style={{ fontSize: 15, color: 'var(--fg-muted)', lineHeight: 1.55 }}>
                  Ingresá el precio de costo y el PVP en el panel izquierdo, o cargá una prenda del catálogo para empezar.
                </p>
              </div>
            )}

            {/* Price comparison table — shown if costo is set */}
            {costoNum > 0 && (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>¿A qué precio conviene vender?</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>Hacé clic para usar ese PVP</div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
                      <th style={{ padding: '6px 0 10px', borderBottom: '1px solid var(--border)' }}>PVP</th>
                      <th style={{ padding: '6px 0 10px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>Margen</th>
                      <th style={{ padding: '6px 0 10px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Gan./u</th>
                      <th style={{ padding: '6px 0 10px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Mensual ({qty}u)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceTable.map((row, i) => {
                      const isActive = hasBoth && Math.abs(pvpNum - row.pvp) < costoNum * 0.08;
                      return (
                        <tr
                          key={i}
                          onClick={() => { setPvp(String(row.pvp)); setPresetId(''); }}
                          style={{ background: isActive ? 'rgba(26,26,46,0.05)' : 'transparent', cursor: 'pointer', transition: 'background 120ms' }}
                          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(26,26,46,0.03)'; }}
                          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontWeight: isActive ? 700 : 400 }}>
                            ${fmtARS(row.pvp)}
                            {isActive && <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'var(--vesto-noche)', color: 'var(--vesto-marfil)', padding: '2px 6px', borderRadius: 2 }}>actual</span>}
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700,
                              color:      row.margen >= 40 ? 'var(--vesto-verde-exito)' : row.margen >= 25 ? '#92651a' : 'var(--vesto-coral)',
                              background: row.margen >= 40 ? 'rgba(22,163,74,0.1)' : row.margen >= 25 ? 'rgba(201,169,110,0.18)' : 'rgba(224,122,95,0.12)',
                              padding: '2px 8px', borderRadius: 2,
                            }}>{row.margen}%</span>
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', textAlign: 'right', color: row.ganUnit >= 0 ? 'var(--fg)' : 'var(--vesto-coral)' }}>
                            ${fmtARS(row.ganUnit)}
                          </td>
                          <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 600, color: row.ganMes >= 0 ? 'var(--fg)' : 'var(--vesto-coral)' }}>
                            ${fmtARS(row.ganMes)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

window.Calculator = Calculator;
