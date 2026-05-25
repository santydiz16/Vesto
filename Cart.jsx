/* eslint-disable */

function Cart({ onNav, cart, onRemove }) {
  const subtotal = cart.reduce((acc, i) => acc + i.priceMay * i.qty, 0);
  const pvp      = cart.reduce((acc, i) => acc + i.pricePvp * i.qty, 0);
  const ganancia = pvp - subtotal;
  const envio    = subtotal > 50000 ? 0 : 2800;

  if (cart.length === 0) {
    return (
      <main style={{ padding: '120px var(--container-gutter)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <Icon name="bag" size={48} color="var(--fg-subtle)" style={{ display: 'block', margin: '0 auto 24px' }}/>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 56, letterSpacing: '-0.025em', marginBottom: 16 }}>Tu pedido está vacío.</h1>
          <p style={{ fontSize: 18, color: 'var(--fg-muted)', marginBottom: 32 }}>Elegí prendas del catálogo y armá tu primer pedido. Sin mínimo.</p>
          <Button variant="primary" size="lg" iconAfter="arrowRight" onClick={() => onNav('catalog')}>Ir al catálogo</Button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '40px var(--container-gutter) 64px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 56, letterSpacing: '-0.025em', marginBottom: 32 }}>Tu pedido.</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: 40, alignItems: 'flex-start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 16, alignItems: 'center' }}>
                <div style={{ aspectRatio: '4/5', background: item.bg, borderRadius: 6 }}></div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 8 }}>Talle {item.size} · cantidad {item.qty}</div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>${(item.priceMay * item.qty).toLocaleString('es-AR')}</span>
                    <span style={{ fontSize: 12, color: 'var(--vesto-verde-exito)', fontWeight: 600 }}>Ganás ${((item.pricePvp - item.priceMay) * item.qty).toLocaleString('es-AR')}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(idx)} aria-label="Quitar" style={{ background: 'transparent', border: 'none', width: 36, height: 36, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-muted)' }}>
                  <Icon name="x" size={18}/>
                </button>
              </div>
            ))}

            <button onClick={() => onNav('catalog')} style={{ background: 'transparent', border: '1px dashed var(--border-strong)', borderRadius: 12, padding: 20, fontSize: 14, color: 'var(--fg-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="plus" size={16}/> Sumar más prendas
            </button>
          </div>

          {/* Summary */}
          <aside style={{ position: 'sticky', top: 'calc(var(--header-h) + 24px)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, marginBottom: 20, letterSpacing: '0.02em' }}>Resumen</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <Row label={`Subtotal (${cart.length} prendas)`} value={`$${subtotal.toLocaleString('es-AR')}`} />
              <Row label="Envío" value={envio === 0 ? <span style={{ color: 'var(--vesto-verde-exito)' }}>Gratis</span> : `$${envio.toLocaleString('es-AR')}`} />
              {envio > 0 && <div style={{ fontSize: 12, color: 'var(--fg-muted)', fontStyle: 'italic' }}>Te faltan ${(50000 - subtotal).toLocaleString('es-AR')} para envío gratis.</div>}
            </div>

            <Row label={<span style={{ fontWeight: 600 }}>Total a pagar</span>} value={<span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontStyle: 'italic' }}>${(subtotal + envio).toLocaleString('es-AR')}</span>} />

            <div style={{ marginTop: 20, padding: 16, background: 'rgba(22, 163, 74, 0.08)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vesto-verde-exito)' }}>Ganancia estimada</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, color: 'var(--vesto-verde-exito)' }}>${ganancia.toLocaleString('es-AR')}</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Si vendés todo al PVP sugerido.</div>
            </div>

            <Button variant="primary" size="lg" iconAfter="arrowRight" style={{ width: '100%', marginTop: 20 }}>Confirmar pedido</Button>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', textAlign: 'center', marginTop: 12 }}>Pagás con MercadoPago o transferencia.</div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 14 }}>
      <span style={{ color: 'var(--fg-muted)' }}>{label}</span>
      <span style={{ color: 'var(--fg)' }}>{value}</span>
    </div>
  );
}

window.Cart = Cart;
