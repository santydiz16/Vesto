/* eslint-disable */
// VESTO shared components — responsive, production-ready.

const { useState, useMemo, useRef, useEffect } = React;

/* ── Responsive hook ── */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

/* ── Favorites helpers ── */
const getFavorites = () => {
  try { return JSON.parse(localStorage.getItem('vesto_favorites') || '[]'); } catch(e) { return []; }
};
const saveFavorites = (list) => {
  try {
    localStorage.setItem('vesto_favorites', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('vesto-fav-change'));
  } catch(e) {}
};
const toggleFavorite = (id) => {
  const list = getFavorites();
  const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
  saveFavorites(next);
  return next;
};

// ===== ICONS =====
const ICONS = {
  search:     'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM21 21l-4.3-4.3',
  cart:       'M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6 M9 21a1 1 0 1 0 .01 0 M20 21a1 1 0 1 0 .01 0',
  user:       'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0.01 0',
  bag:        'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  arrowLeft:  'M19 12H5 M12 19l-7-7 7-7',
  arrowUp:    'M12 19V5 M5 12l7-7 7 7',
  check:      'M20 6 9 17l-5-5',
  heart:      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  filter:     'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  grid:       'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  list:       'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  package:    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7l8.7 5 8.7-5 M12 22V12',
  trending:   'M22 6 13.5 14.5 8.5 9.5 2 16 M16 6h6v6',
  truck:      'M1 3h15v13H1z M16 8h4l3 3v5h-7 M5.5 21a2.5 2.5 0 1 0 0.01 0 M18.5 21a2.5 2.5 0 1 0 0.01 0',
  star:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88L2 9.27l6.91-1.01L12 2z',
  menu:       'M3 6h18 M3 12h18 M3 18h18',
  x:          'M18 6 6 18 M6 6l12 12',
  plus:       'M12 5v14 M5 12h14',
  minus:      'M5 12h14',
  share:      'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  instagram:  'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M12 8a4 4 0 1 0 0.01 0 M17.5 6.5a0.5 0.5 0 1 0 0.01 0',
  whatsapp:   'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
  calculator: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M8 10h8 M8 14h4 M8 6h8',
  settings:   'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
  download:   'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  upload:     'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  moon:       'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun:        'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  eye:        'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
};

function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.75, style }) {
  const d = ICONS[name];
  if (!d) return null;
  const paths = d.split(/ M /).map((p, i) => (i === 0 ? p : 'M ' + p));
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// ===== BUTTON =====
function Button({ children, variant = 'primary', size = 'md', icon, iconAfter, onClick, style, type, disabled }) {
  const cls = `vesto-btn vesto-btn--${variant}${size !== 'md' ? ' vesto-btn--' + size : ''}`;
  return (
    <button className={cls} onClick={onClick} type={type || 'button'} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === 'sm' ? 16 : 18} />}
    </button>
  );
}

// ===== BADGE =====
function Badge({ children, variant = 'ghost', style }) {
  return <span className={`vesto-badge vesto-badge--${variant}`} style={style}>{children}</span>;
}

// ===== INPUT =====
function Input({ placeholder, value, onChange, icon, type = 'text', style }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      {icon && (
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-subtle)', pointerEvents: 'none' }}>
          <Icon name={icon} size={16} />
        </span>
      )}
      <input type={type} className="vesto-input" placeholder={placeholder} value={value || ''} onChange={onChange}
        style={icon ? { paddingLeft: 42 } : null} />
    </div>
  );
}

// ===== HEART BUTTON (reusable) =====
function HeartBtn({ id, size = 36, style }) {
  const [fav, setFav] = useState(() => getFavorites().includes(id));
  useEffect(() => {
    const sync = () => setFav(getFavorites().includes(id));
    window.addEventListener('vesto-fav-change', sync);
    return () => window.removeEventListener('vesto-fav-change', sync);
  }, [id]);
  return (
    <button
      onClick={e => { e.stopPropagation(); const next = toggleFavorite(id); setFav(next.includes(id)); }}
      style={{ width: size, height: size, borderRadius: '50%', background: fav ? 'var(--vesto-coral)' : 'rgba(245,240,232,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'all 200ms', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', ...style }}
      aria-label={fav ? 'Quitar de favoritos' : 'Guardar'}
    >
      <svg width={size * 0.44} height={size * 0.44} viewBox="0 0 24 24" fill={fav ? '#fff' : 'none'} stroke={fav ? '#fff' : 'var(--vesto-noche)'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  );
}

// ===== PRODUCT CARD =====
function ProductCard({ product, onClick }) {
  const { id, name, sizes, priceMay, pricePvp, bg, image, badge, badgeVariant, stock } = product;
  const ganUnit = (pricePvp || 0) - (priceMay || 0);
  const margen  = pricePvp > 0 ? Math.round((ganUnit / pricePvp) * 100) : 0;
  const lowStock = (stock || 0) > 0 && (stock || 0) <= 8;

  return (
    <div className="vesto-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={onClick}>
      <div style={{ aspectRatio: '4/5', background: bg, position: 'relative' }}>
        {image && <img src={image} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { e.target.style.display = 'none'; }} />}
        {badge && <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge variant={badgeVariant || 'accent'}>{badge}</Badge></div>}
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <HeartBtn id={id} size={34} />
        </div>
        {margen > 0 && (
          <div style={{ position: 'absolute', bottom: lowStock ? 40 : 12, left: 12, background: 'rgba(22,163,74,0.88)', borderRadius: 2, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>+{margen}%</span>
          </div>
        )}
        {lowStock && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(224,122,95,0.92)', borderRadius: 2, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>¡Últimas {stock}!</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--fg)', marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 10, letterSpacing: '0.04em' }}>{(sizes || []).join(' · ')}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600 }}>${(priceMay || 0).toLocaleString('es-AR')}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>PVP ${(pricePvp || 0).toLocaleString('es-AR')}</div>
        </div>
        {ganUnit > 0 && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: 'var(--vesto-verde-exito)' }}>Ganás ${ganUnit.toLocaleString('es-AR')}/u</div>}
      </div>
    </div>
  );
}

// ===== PRODUCT LIST ROW =====
function ProductListRow({ product, onClick }) {
  const { id, name, sizes, priceMay, pricePvp, bg, image, badge, badgeVariant, stock, category } = product;
  const ganUnit = (pricePvp || 0) - (priceMay || 0);
  const margen  = pricePvp > 0 ? Math.round((ganUnit / pricePvp) * 100) : 0;
  const lowStock = (stock || 0) > 0 && (stock || 0) <= 8;

  return (
    <div onClick={onClick}
      style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto auto', gap: 16, alignItems: 'center', padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', transition: 'box-shadow 200ms', marginBottom: 8 }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ width: 64, height: 80, background: bg, borderRadius: 6, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {image && <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }}/>}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 4, textTransform: 'capitalize' }}>{category}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{(sizes || []).join(' · ')}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
          {badge && <Badge variant={badgeVariant || 'ghost'}>{badge}</Badge>}
          {lowStock && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--vesto-coral)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>¡Últimas {stock}!</span>}
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 90 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>${(priceMay || 0).toLocaleString('es-AR')}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>PVP ${(pricePvp || 0).toLocaleString('es-AR')}</div>
      </div>
      <div style={{ textAlign: 'center', minWidth: 72 }}>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 3, color: margen >= 40 ? 'var(--vesto-verde-exito)' : margen >= 25 ? '#92651a' : 'var(--vesto-coral)', background: margen >= 40 ? 'rgba(22,163,74,0.1)' : margen >= 25 ? 'rgba(201,169,110,0.15)' : 'rgba(224,122,95,0.1)' }}>+{margen}%</span>
        {ganUnit > 0 && <div style={{ fontSize: 10, color: 'var(--vesto-verde-exito)', fontWeight: 600, marginTop: 2 }}>+${ganUnit.toLocaleString('es-AR')}/u</div>}
      </div>
      <HeartBtn id={id} size={32} style={{ background: 'rgba(26,26,46,0.05)', backdropFilter: 'none' }} />
    </div>
  );
}

// ===== QUICK VIEW MODAL =====
function QuickViewModal({ product, onClose, onNav, onAddToCart }) {
  const w = useWindowWidth();
  const isMobile = w < 640;
  const [size, setSize] = useState(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!product) return null;
  const ganUnit = (product.pricePvp || 0) - (product.priceMay || 0);
  const margen  = product.pricePvp > 0 ? Math.round((ganUnit / product.pricePvp) * 100) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.7)', backdropFilter: 'blur(6px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg)', borderRadius: 16, maxWidth: 680, width: '100%', maxHeight: '92vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr', boxShadow: '0 24px 64px rgba(26,26,46,0.35)' }}>
        {/* Image */}
        {!isMobile && (
          <div style={{ background: product.bg, borderRadius: '16px 0 0 16px', position: 'relative', overflow: 'hidden', minHeight: 320 }}>
            {product.image && <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display='none'; }}/>}
            {product.badge && <div style={{ position: 'absolute', top: 16, left: 16 }}><Badge variant={product.badgeVariant}>{product.badge}</Badge></div>}
            {margen > 0 && <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(22,163,74,0.9)', borderRadius: 4, padding: '4px 10px' }}><span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>+{margen}%</span></div>}
          </div>
        )}
        {/* Info */}
        <div style={{ padding: isMobile ? 24 : 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'capitalize', color: 'var(--fg-muted)' }}>{product.category}</div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="x" size={18}/></button>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 26 : 30, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>{product.name}</h2>
          <div style={{ display: 'flex', gap: 20, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>Mayorista</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, lineHeight: 1 }}>${(product.priceMay || 0).toLocaleString('es-AR')}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>PVP</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--fg-muted)' }}>${(product.pricePvp || 0).toLocaleString('es-AR')}</div>
            </div>
            {ganUnit > 0 && (
              <div style={{ marginLeft: 'auto', textAlign: 'right', alignSelf: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)', marginBottom: 2 }}>Ganás</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--vesto-verde-exito)' }}>${ganUnit.toLocaleString('es-AR')}</div>
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Talle</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {(product.sizes || []).map(s => (
                <button key={s} onClick={() => setSize(s)} style={{ minWidth: 42, height: 36, border: `1px solid ${size===s?'var(--vesto-noche)':'var(--border-strong)'}`, borderRadius: 4, fontSize: 13, fontWeight: size===s?600:400, cursor: 'pointer', background: size===s?'var(--vesto-noche)':'transparent', color: size===s?'var(--vesto-marfil)':'var(--fg)', fontFamily: 'var(--font-body)', padding: '0 10px' }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 13, color: (product.stock||0)<10?'var(--vesto-coral)':'var(--fg-muted)' }}>
            Stock: <strong>{product.stock||0} unidades</strong>
            {(product.stock||0)<=8&&(product.stock||0)>0&&<span style={{ marginLeft: 8, fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>¡Últimas!</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            <Button variant="primary" size="lg" iconAfter="arrowRight" style={{ width: '100%' }} onClick={() => { onAddToCart && onAddToCart({ ...product, size: size||(product.sizes||[])[0], qty: 1 }); onClose(); }}>
              Agregar al pedido
            </Button>
            <button onClick={() => { onClose(); onNav('product', product.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--fg-muted)', fontFamily: 'var(--font-body)', textDecoration: 'underline' }}>
              Ver ficha completa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== HEADER =====
function Header({ current, onNav, cartCount = 0 }) {
  const w = useWindowWidth();
  const isMobile = w < 900;

  const links = [
    { id: 'landing',    label: 'Inicio' },
    { id: 'catalog',    label: 'Catálogo' },
    { id: 'calculator', label: 'Calculadora' },
    { id: 'dashboard',  label: 'Mi panel' },
  ];

  // Dark mode
  const [dark, setDark] = useState(() => { try { return localStorage.getItem('vesto_dark')==='1'; } catch(e){ return false; } });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
    try { localStorage.setItem('vesto_dark', dark?'1':'0'); } catch(e){}
  }, [dark]);

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Favorites count
  const [favCount, setFavCount] = useState(() => getFavorites().length);
  useEffect(() => {
    const sync = () => setFavCount(getFavorites().length);
    window.addEventListener('vesto-fav-change', sync);
    return () => window.removeEventListener('vesto-fav-change', sync);
  }, []);

  // Search overlay
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const searchRef = useRef(null);

  const searchResults = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (q.length < 2) return [];
    return getProducts().filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)).slice(0, 7);
  }, [searchQ]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchQ('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [searchOpen]);

  const iconBtn = (onClick, children, title, active) => (
    <button onClick={onClick} title={title} style={{ background: active?'rgba(26,26,46,0.08)':'transparent', border: 'none', width: 40, height: 40, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', position: 'relative', flexShrink: 0 }}>
      {children}
    </button>
  );

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(var(--bg-rgb,245,240,232),0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderBottom: '1px solid var(--border)', height: 'var(--header-h)' }}>
        <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-gutter)', height: '100%', display: 'flex', alignItems: 'center', gap: isMobile?12:32 }}>
          {/* Logo */}
          <a href="#" onClick={e=>{e.preventDefault();onNav('landing');setMenuOpen(false);}} style={{ display:'flex', alignItems:'center', gap: 8, borderBottom:'none', flexShrink: 0 }}>
            <img src="./assets/logos/vesto-isotipo.svg" alt="" width="26" height="26" style={{ borderRadius: 4 }} onError={e=>{e.target.style.display='none';}}/>
            <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: isMobile?22:26, color:'var(--fg)', lineHeight:1, letterSpacing:'-0.02em' }}>vesto</span>
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display:'flex', gap:20, marginLeft:12 }}>
              {links.map(l=>(
                <a key={l.id} href="#" onClick={e=>{e.preventDefault();onNav(l.id);}}
                  style={{ fontFamily:'var(--font-body)', fontSize:14, fontWeight:500, color:current===l.id?'var(--fg)':'var(--fg-muted)', borderBottom:current===l.id?'2px solid var(--vesto-champagne)':'none', paddingBottom:4, transition:'color 220ms', whiteSpace:'nowrap' }}>
                  {l.label}
                </a>
              ))}
            </nav>
          )}

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:2 }}>
            {/* Search */}
            {iconBtn(()=>setSearchOpen(true), <Icon name="search" size={18}/>, 'Buscar')}
            {/* Favorites */}
            {iconBtn(()=>onNav('favorites'),
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favCount>0?'var(--vesto-coral)':'none'} stroke={favCount>0?'var(--vesto-coral)':'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {favCount>0&&<span style={{ position:'absolute', top:5, right:5, background:'var(--vesto-coral)', color:'#fff', borderRadius:'50%', width:14, height:14, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{favCount}</span>}
              </>,
              'Mis favoritos'
            )}
            {/* Dark mode - hide on mobile to save space */}
            {!isMobile && iconBtn(()=>setDark(d=>!d), <Icon name={dark?'sun':'moon'} size={18}/>, dark?'Modo claro':'Modo oscuro')}
            {/* Admin */}
            {!isMobile && iconBtn(()=>onNav('admin'), <Icon name="settings" size={18}/>, 'Admin', current==='admin')}
            {/* Cart */}
            {iconBtn(()=>onNav('cart'),
              <>{<Icon name="bag" size={18}/>}{cartCount>0&&<span style={{ position:'absolute', top:6, right:6, background:'var(--vesto-champagne)', color:'var(--vesto-noche)', borderRadius:'50%', width:16, height:16, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>}</>,
              'Mi pedido'
            )}
            {/* Mobile hamburger */}
            {isMobile && iconBtn(()=>setMenuOpen(m=>!m), menuOpen?<Icon name="x" size={20}/>:<Icon name="menu" size={20}/>, 'Menú')}
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {isMobile && menuOpen && (
        <div style={{ position:'fixed', inset:0, top:'var(--header-h)', zIndex:45, background:'var(--bg)', display:'flex', flexDirection:'column', padding:'24px var(--container-gutter)', gap:8, overflowY:'auto' }}>
          {links.map(l=>(
            <button key={l.id} onClick={()=>{onNav(l.id);setMenuOpen(false);}} style={{ background:current===l.id?'rgba(26,26,46,0.06)':'transparent', border:'none', borderRadius:8, padding:'14px 16px', fontSize:18, fontWeight:600, color:current===l.id?'var(--fg)':'var(--fg-muted)', fontFamily:'var(--font-body)', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              {l.label}
              {current===l.id&&<Icon name="arrowRight" size={18} color="var(--vesto-champagne)"/>}
            </button>
          ))}
          <div style={{ height:1, background:'var(--border)', margin:'8px 0'}}/>
          <button onClick={()=>{onNav('admin');setMenuOpen(false);}} style={{ background:'transparent', border:'none', borderRadius:8, padding:'14px 16px', fontSize:16, fontWeight:500, color:'var(--fg-muted)', fontFamily:'var(--font-body)', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <Icon name="settings" size={18}/> Panel admin
          </button>
          <button onClick={()=>setDark(d=>!d)} style={{ background:'transparent', border:'none', borderRadius:8, padding:'14px 16px', fontSize:16, fontWeight:500, color:'var(--fg-muted)', fontFamily:'var(--font-body)', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
            <Icon name={dark?'sun':'moon'} size={18}/> {dark?'Modo claro':'Modo oscuro'}
          </button>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,15,26,0.75)', backdropFilter:'blur(8px)', zIndex:300, display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 16px 0' }} onClick={()=>setSearchOpen(false)}>
          <div style={{ background:'var(--bg)', borderRadius:16, width:'100%', maxWidth:620, overflow:'hidden', boxShadow:'0 24px 64px rgba(26,26,46,0.4)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
              <Icon name="search" size={20} color="var(--fg-muted)"/>
              <input ref={searchRef} value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Buscar prendas, categorías…"
                style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:17, fontFamily:'var(--font-body)', color:'var(--fg)', caretColor:'var(--vesto-champagne)' }}
                onKeyDown={e=>e.key==='Escape'&&setSearchOpen(false)}/>
              <button onClick={()=>setSearchOpen(false)} style={{ background:'rgba(26,26,46,0.07)', border:'none', cursor:'pointer', fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-body)', padding:'4px 8px', borderRadius:4 }}>ESC</button>
            </div>
            {searchQ.length>=2 ? (
              <div style={{ maxHeight:400, overflowY:'auto' }}>
                {searchResults.length>0 ? searchResults.map(p=>{
                  const ganUnit=(p.pricePvp||0)-(p.priceMay||0);
                  return (
                    <button key={p.id} onClick={()=>{setSearchOpen(false);onNav('product',p.id);}}
                      style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'12px 20px', border:'none', borderBottom:'1px solid var(--border)', background:'transparent', cursor:'pointer', textAlign:'left' }}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(26,26,46,0.04)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                      <div style={{ width:40, height:50, background:p.bg, borderRadius:4, flexShrink:0, position:'relative', overflow:'hidden' }}>
                        {p.image&&<img src={p.image} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} onError={e=>{e.target.style.display='none';}}/>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:500, color:'var(--fg)', marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'var(--fg-muted)', textTransform:'capitalize' }}>{p.category} · ${(p.priceMay||0).toLocaleString('es-AR')}</div>
                      </div>
                      {ganUnit>0&&<div style={{ fontSize:12, fontWeight:700, color:'var(--vesto-verde-exito)', whiteSpace:'nowrap' }}>+${ganUnit.toLocaleString('es-AR')}</div>}
                    </button>
                  );
                }) : <div style={{ padding:'32px 20px', textAlign:'center', color:'var(--fg-muted)', fontSize:14 }}>No encontramos "{searchQ}".</div>}
              </div>
            ) : (
              <div style={{ padding:'20px 20px 24px' }}>
                <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--fg-muted)', marginBottom:12 }}>Categorías populares</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {['Buzos','Jeans','Vestidos','Remeras','Sacos','Camisas','Pantalones'].map(c=>(
                    <button key={c} onClick={()=>setSearchQ(c.toLowerCase())} style={{ background:'rgba(26,26,46,0.06)', border:'1px solid var(--border)', borderRadius:6, padding:'6px 14px', fontSize:13, fontWeight:500, cursor:'pointer', fontFamily:'var(--font-body)', color:'var(--fg)' }}>{c}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ===== WHATSAPP FLOATING BUTTON =====
function WhatsAppButton({ message = '¡Hola! Quiero más info sobre el catálogo VESTO.' }) {
  const phone = window.VESTO_WHATSAPP || '';
  const [show, setShow] = useState(false);

  useEffect(() => {
    const h = () => setShow(window.scrollY > 250);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  if (!phone) return null; // hidden until VESTO_WHATSAPP is configured

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 99,
        width: 52, height: 52, borderRadius: '50%',
        background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.5)', textDecoration: 'none',
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 280ms, transform 280ms',
        pointerEvents: show ? 'auto' : 'none',
      }}
      title="Consultar por WhatsApp"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/>
      </svg>
    </a>
  );
}

// ===== SCROLL TO TOP =====
function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
      style={{ position:'fixed', bottom:90, right:28, zIndex:99, width:44, height:44, borderRadius:'50%', background:'var(--vesto-noche)', color:'var(--vesto-marfil)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(26,26,46,0.3)', opacity:show?1:0, transform:show?'scale(1)':'scale(0.8)', transition:'opacity 280ms, transform 280ms', pointerEvents:show?'auto':'none' }}
      title="Volver arriba">
      <Icon name="arrowUp" size={18} color="var(--vesto-marfil)"/>
    </button>
  );
}

// ===== FOOTER =====
function Footer() {
  const w = useWindowWidth();
  const isMobile = w < 900;
  return (
    <footer style={{ background:'var(--vesto-noche)', color:'var(--vesto-marfil)', marginTop:'var(--space-9)', padding:`64px var(--container-gutter) 32px` }}>
      <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', display:'grid', gridTemplateColumns:isMobile?'1fr 1fr':'2fr 1fr 1fr 1fr 1fr', gap:isMobile?32:48, paddingBottom:48, borderBottom:'1px solid var(--border-inverse)' }}>
        <div style={{ gridColumn:isMobile?'span 2':'auto' }}>
          <div style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:26, color:'var(--vesto-champagne)', marginBottom:8, letterSpacing:'-0.02em' }}>Vestí tu negocio.</div>
          <div style={{ fontSize:14, color:'var(--fg-inverse-muted)', lineHeight:1.6, maxWidth:320 }}>Plataforma B2B mayorista de indumentaria. +2000 prendas, dropshipping y academia de ventas.</div>
        </div>
        {[
          { h:'Producto',  items:['Catálogo','Novedades','Outlet','Dropshipping'] },
          { h:'Aprender',  items:['Academia','Casos de éxito','Blog','Tutoriales'] },
          { h:'Empresa',   items:['Quiénes somos','Términos','Privacidad','Empleo'] },
          { h:'Contacto',  items:['WhatsApp','Instagram','TikTok','hola@vesto.com.ar'] },
        ].map(col=>(
          <div key={col.h}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--vesto-champagne)', marginBottom:12 }}>{col.h}</div>
            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:9 }}>
              {col.items.map(i=><li key={i} style={{ fontSize:13, color:'var(--fg-inverse-muted)' }}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth:'var(--container-max)', margin:'0 auto', paddingTop:24, display:'flex', flexDirection:isMobile?'column':'row', gap:isMobile?8:0, justifyContent:'space-between', fontSize:12, color:'var(--fg-inverse-muted)' }}>
        <div>© 2026 VESTO. Hecho en Argentina.</div>
        <div>CUIT 30-71234567-8 · Buenos Aires</div>
      </div>
    </footer>
  );
}

/* ── LoadingScreen ── */
function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      zIndex: 9999,
    }}>
      <div style={{
        width: 44,
        height: 44,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--vesto-champagne)',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }}/>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--fg-muted)',
      }}>
        Cargando VESTO…
      </span>
    </div>
  );
}

Object.assign(window, {
  Icon, Button, Badge, Input,
  HeartBtn, ProductCard, ProductListRow, QuickViewModal,
  Header, Footer, WhatsAppButton, ScrollToTop, LoadingScreen,
  useWindowWidth, getFavorites, saveFavorites, toggleFavorite,
});
