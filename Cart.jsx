/* eslint-disable */

const FREE_SHIPPING_MIN = 50000;

function Cart({ onNav, cart, onRemove, onUpdateQty }) {
  const subtotal = cart.reduce((acc, i) => acc + i.priceMay * i.qty, 0);
  const pvp      = cart.reduce((acc, i) => acc + i.pricePvp * i.qty, 0);
  const ganancia = pvp - subtotal;
  const envio    = subtotal >= FREE_SHIPPING_MIN ? 0 : 2800;
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_MIN) * 100));

  const w        = useWindowWidth();
  const isMobile = w < 900;

  if (cart.length === 0) {
    return (
      <main style={{ padding: '120px var(--container-gutter)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <Icon name="bag" size={48} color="var(--fg-subtle)" style={{ display: 'block', margin: '0 auto 24px' }}/>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 40 : 56, letterSpacing: '-0.025em', marginBottom: 16 }}>Tu pedido está vacío.</h1>
          <p style={{ fontSize: 18, color: 'var(--fg-muted)', marginBottom: 32 }}>Elegí prendas del catálogo y armá tu primer pedido. Sin mínimo.</p>
          <Button variant="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav('catalog')}>Ir al catálogo</Button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: `${isMobile ? 24 : 40}px var(--container-gutter) 64px` }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 40 : 56, letterSpacing: '-0.025em', marginBottom: 24 }}>Tu pedido.</h1>

        {/* ── Shipping progress bar ── */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: 13 }}>
            <span style={{ fontWeight: 600, color: envio === 0 ? 'var(--vesto-verde-exito)' : 'var(--fg)' }}>
              {envio === 0
                ? '🎉 ¡Tenés envío gratis!'
                : `Te faltan $${(FREE_SHIPPING_MIN - subtotal).toLocaleString('es-AR')} para envío gratis`}
            </span>
            <span style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Mínimo ${FREE_SHIPPING_MIN.toLocaleString('es-AR')}</span>
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: envio === 0 ? 'var(--vesto-verde-exito)' : 'var(--vesto-champagne)', borderRadius: 999, transition: 'width 400ms var(--ease)' }}/>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '7fr 5fr', gap: isMobile ? 24 : 40, alignItems: 'flex-start' }}>

          {/* ── Items list ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 12 : 16, display: 'grid', gridTemplateColumns: `${isMobile ? 72 : 88}px 1fr auto`, gap: isMobile ? 12 : 16, alignItems: 'center' }}>
                {/* Thumb */}
                <div style={{ aspectRatio: '4/5', background: item.bg, borderRadius: 6, position: 'relative', overflow: 'hidden' }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>}
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 10 }}>Talle {item.size}</div>

                  {/* Qty editor */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden', height: 32 }}>
                      <button
                        onClick={() => onUpdateQty(idx, item.qty - 1)}
                        style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}>
                        <Icon name="minus" size={14}/>
                      </button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--fg)' }}>{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(idx, item.qty + 1)}
                        style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}>
                        <Icon name="plus" size={14}/>
                      </button>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>${(item.priceMay * item.qty).toLocaleString('es-AR')}</span>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--vesto-verde-exito)' }}>
                    Ganás ${((item.pricePvp - item.priceMay) * item.qty).toLocaleString('es-AR')}
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => onRemove(idx)} aria-label="Quitar"
                  style={{ background: 'transparent', border: 'none', width: 32, height: 32, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)', alignSelf: 'flex-start' }}>
                  <Icon name="x" size={16}/>
                </button>
              </div>
            ))}

            <button onClick={() => onNav('catalog')}
              style={{ background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: 12, padding: 18, fontSize: 14, color: 'var(--fg-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="plus" size={16}/> Sumar más prendas
            </button>
          </div>

          {/* ── Summary aside ── */}
          <aside style={{ position: isMobile ? 'static' : 'sticky', top: 'calc(var(--header-h) + 24px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: isMobile ? 20 : 28 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, marginBottom: 20, letterSpacing: '0.02em' }}>Resumen</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <CartRow label={`Subtotal (${cart.reduce((acc, i) => acc + i.qty, 0)} unidades)`} value={`$${subtotal.toLocaleString('es-AR')}`} />
              <CartRow
                label="Envío"
                value={envio === 0
                  ? <span style={{ color: 'var(--vesto-verde-exito)', fontWeight: 600 }}>Gratis</span>
                  : `$${envio.toLocaleString('es-AR')}`}
              />
              {envio > 0 && (
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  Agregá ${(FREE_SHIPPING_MIN - subtotal).toLocaleString('es-AR')} más para envío gratis.
                </div>
              )}
            </div>

            <CartRow
              label={<span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 15 }}>Total a pagar</span>}
              value={<span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontStyle: 'italic' }}>${(subtotal + envio).toLocaleString('es-AR')}</span>}
            />

            <div style={{ marginTop: 20, padding: 16, background: 'rgba(22, 163, 74, 0.08)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)' }}>Ganancia estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 30, color: 'var(--vesto-verde-exito)' }}>${ganancia.toLocaleString('es-AR')}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Si vendés todo al PVP sugerido.</div>
            </div>

            <WhatsAppCheckoutButton cart={cart} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 14 }}>
      <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
      <span style={{ color: 'var(--fg)' }}>{value}</span>
    </div>
  );
}

function WhatsAppCheckoutButton({ cart }) {
  const phone = window.VESTO_WHATSAPP || '';

  const subtotal = cart.reduce((acc, i) => acc + i.priceMay * i.qty, 0);
  const envio    = subtotal >= FREE_SHIPPING_MIN ? 0 : 2800;
  const total    = subtotal + envio;

  const lines = cart
    .map(i => `• ${i.name} × ${i.qty} = $${(i.priceMay * i.qty).toLocaleString('es-AR')}`)
    .join('\n');

  const shippingLine = envio === 0
    ? '\n🚚 Envío: *Gratis*'
    : `\n🚚 Envío: $${envio.toLocaleString('es-AR')}`;

  const msg = `🛍️ *Nuevo pedido VESTO*\n\n${lines}${shippingLine}\n\n📦 *Total: $${total.toLocaleString('es-AR')}*`;
  const url = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}` : null;

  if (!url) {
    return (
      <div style={{ marginTop: 20 }}>
        <button
          disabled
          style={{
            width: '100%', padding: '14px 24px',
            background: 'var(--border)', color: 'var(--fg-muted)',
            border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)',
            cursor: 'not-allowed', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 10, boxSizing: 'border-box',
          }}>
          <Icon name="whatsapp" size={18} color="var(--fg-muted)"/>
          Confirmar pedido
        </button>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
          Número de WhatsApp no configurado aún.
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        width: '100%', marginTop: 20, padding: '14px 24px',
        background: '#25D366', color: '#fff', borderRadius: 8,
        fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)',
        textDecoration: 'none', boxSizing: 'border-box',
        transition: 'background 180ms',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#1ebe5d'}
      onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
    >
      <Icon name="whatsapp" size={20} color="#fff"/>
      Confirmar por WhatsApp
    </a>
  );
}

window.Cart = Cart;
