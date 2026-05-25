/* eslint-disable */
// VESTO shared components — small, cosmetic React building blocks.

const { useState, useMemo, useRef, useEffect, useCallback } = React;

// ===== ICON =====
const ICONS = {
  search:     'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM21 21l-4.3-4.3',
  cart:       'M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6 M9 21 a1 1 0 1 0 .01 0 M20 21 a1 1 0 1 0 .01 0',
  user:       'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7 a4 4 0 1 0 0.01 0',
  bag:        'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0',
  arrowRight: 'M5 12h14 M12 5l7 7-7 7',
  arrowLeft:  'M19 12H5 M12 19l-7-7 7-7',
  check:      'M20 6 9 17l-5-5',
  heart:      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  filter:     'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  grid:       'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z',
  chevDown:   'm6 9 6 6 6-6',
  package:    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7l8.7 5 8.7-5 M12 22V12',
  trending:   'M22 6 13.5 14.5 8.5 9.5 2 16 M16 6h6v6',
  truck:      'M1 3h15v13H1z M16 8h4l3 3v5h-7 M5.5 21 a2.5 2.5 0 1 0 0.01 0 M18.5 21 a2.5 2.5 0 1 0 0.01 0',
  star:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88L2 9.27l6.91-1.01L12 2z',
  menu:       'M3 6h18 M3 12h18 M3 18h18',
  x:          'M18 6 6 18 M6 6l12 12',
  plus:       'M12 5v14 M5 12h14',
  minus:      'M5 12h14',
  share:      'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  instagram:  'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M12 8 a4 4 0 1 0 0.01 0 M17.5 6.5 a0.5 0.5 0 1 0 0.01 0',
  whatsapp:   'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
  calculator: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M8 10h8 M8 14h4 M8 6h8',
  settings:   'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
  download:   'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  upload:     'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
};

function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.75, style }) {
  const d = ICONS[name];
  if (!d) return null;
  const paths = d.split(/ M /).map((p, i) => (i === 0 ? p : 'M ' + p));
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
    >
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
      <input
        type={type}
        className="vesto-input"
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        style={icon ? { paddingLeft: 42 } : null}
      />
    </div>
  );
}

// ===== PRODUCT CARD =====
function ProductCard({ product, onClick }) {
  const { name, sizes, priceMay, pricePvp, bg, image, badge, badgeVariant } = product;
  const ganUnit = (pricePvp || 0) - (priceMay || 0);
  const margen  = pricePvp > 0 ? Math.round((ganUnit / pricePvp) * 100) : 0;

  return (
    <div className="vesto-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={onClick}>
      <div style={{ aspectRatio: '4/5', background: bg, position: 'relative' }}>
        {/* Real photo — shown on top of gradient fallback */}
        {image && (
          <img
            src={image} alt={name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        )}
        {badge && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <Badge variant={badgeVariant || 'accent'}>{badge}</Badge>
          </div>
        )}
        <button
          style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,240,232,0.85)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { e.stopPropagation(); }}
          aria-label="Guardar"
        >
          <Icon name="heart" size={16} />
        </button>
        {/* Profit chip */}
        {margen > 0 && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(22,163,74,0.88)', borderRadius: 2, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', letterSpacing: '0.03em' }}>+{margen}%</span>
          </div>
        )}
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--fg)', marginBottom: 4 }}>{name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--fg-muted)', marginBottom: 10, letterSpacing: '0.04em' }}>{(sizes || []).join(' · ')}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600 }}>${(priceMay || 0).toLocaleString('es-AR')}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--fg-subtle)' }}>PVP ${(pricePvp || 0).toLocaleString('es-AR')}</div>
        </div>
        {ganUnit > 0 && (
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: 'var(--vesto-verde-exito)' }}>
            Ganás ${ganUnit.toLocaleString('es-AR')} por unidad
          </div>
        )}
      </div>
    </div>
  );
}

// ===== HEADER =====
function Header({ current, onNav, cartCount = 0 }) {
  const links = [
    { id: 'landing',    label: 'Inicio' },
    { id: 'catalog',    label: 'Catálogo' },
    { id: 'how',        label: 'Cómo funciona' },
    { id: 'academy',    label: 'Academia' },
    { id: 'calculator', label: 'Calculadora' },
    { id: 'dashboard',  label: 'Mi panel' },
  ];
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(245,240,232,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      height: 'var(--header-h)',
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 var(--container-gutter)', height: '100%', display: 'flex', alignItems: 'center', gap: 32 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNav('landing'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, borderBottom: 'none' }}>
          <img src="../../assets/logos/vesto-isotipo.svg" alt="" width="28" height="28" style={{ borderRadius: 4 }} onError={e => { e.target.style.display='none'; }}/>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: 'var(--fg)', lineHeight: 1, letterSpacing: '-0.02em' }}>vesto</span>
        </a>
        <nav style={{ display: 'flex', gap: 20, marginLeft: 12 }}>
          {links.map(l => (
            <a key={l.id} href="#" onClick={(e) => { e.preventDefault(); onNav(l.id); }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                color: current === l.id ? 'var(--fg)' : 'var(--fg-muted)',
                borderBottom: current === l.id ? '2px solid var(--vesto-champagne)' : 'none',
                paddingBottom: 4, transition: 'color 220ms', whiteSpace: 'nowrap',
              }}>{l.label}</a>
          ))}
        </nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button style={{ background: 'transparent', border: 'none', width: 40, height: 40, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="search" size={18} /></button>
          <button style={{ background: 'transparent', border: 'none', width: 40, height: 40, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="user" size={18} /></button>
          {/* Admin button */}
          <button
            onClick={() => onNav('admin')}
            title="Panel admin"
            style={{ background: current === 'admin' ? 'rgba(26,26,46,0.08)' : 'transparent', border: 'none', width: 40, height: 40, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="settings" size={18} />
          </button>
          <button onClick={() => onNav('cart')} style={{ background: 'transparent', border: 'none', width: 40, height: 40, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Icon name="bag" size={18} />
            {cartCount > 0 && <span style={{ position: 'absolute', top: 6, right: 6, background: 'var(--vesto-champagne)', color: 'var(--vesto-noche)', borderRadius: '50%', width: 16, height: 16, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer style={{ background: 'var(--vesto-noche)', color: 'var(--vesto-marfil)', marginTop: 'var(--space-9)', padding: '64px var(--container-gutter) 32px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48, borderBottom: '1px solid var(--border-inverse)' }}>
        <div>
          <img src="../../assets/logos/vesto-symbol-mono-white.svg" width="40" height="40" alt="" style={{ marginBottom: 16 }} onError={e => { e.target.style.display='none'; }}/>
          <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, color: 'var(--vesto-champagne)', marginBottom: 8, letterSpacing: '-0.02em' }}>Vestí tu negocio.</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-inverse-muted)', lineHeight: 1.6, maxWidth: 340 }}>
            Plataforma B2B mayorista de indumentaria. Más de 2000 prendas, dropshipping incluido, academia de ventas para emprendedoras.
          </div>
        </div>
        {[
          { h: 'Producto',  items: ['Catálogo', 'Novedades', 'Outlet', 'Dropshipping'] },
          { h: 'Aprender',  items: ['Academia', 'Casos de éxito', 'Blog', 'Tutoriales'] },
          { h: 'Empresa',   items: ['Quiénes somos', 'Trabajá con nosotros', 'Términos', 'Privacidad'] },
          { h: 'Contacto',  items: ['WhatsApp', 'Instagram', 'TikTok', 'hola@vesto.com.ar'] },
        ].map(col => (
          <div key={col.h}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-champagne)', marginBottom: 14 }}>{col.h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.items.map(i => <li key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-inverse-muted)' }}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--fg-inverse-muted)' }}>
        <div>© 2026 VESTO. Hecho en Argentina.</div>
        <div>CUIT 30-71234567-8 · Buenos Aires</div>
      </div>
    </footer>
  );
}

// ===== Expose =====
Object.assign(window, { Icon, Button, Badge, Input, ProductCard, Header, Footer });
