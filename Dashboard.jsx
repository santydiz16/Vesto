/* eslint-disable */

function Dashboard({ onNav }) {
  const w = useWindowWidth();
  const isMobile = w < 900;

  return (
    <main style={{ padding: '40px var(--container-gutter) 64px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Greeting */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: isMobile ? 20 : 0, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Mi panel · Mayo 2026</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: isMobile ? 40 : 56, letterSpacing: '-0.025em' }}>Hola, Sofía.</h1>
            <p style={{ fontSize: 17, color: 'var(--fg-muted)', marginTop: 8 }}>Este mes vendiste <strong style={{ color: 'var(--fg)' }}>42 prendas</strong>. Vas un 28% arriba de abril.</p>
          </div>
          <Button variant="accent" iconAfter="arrowRight">Compartir mi tienda</Button>
        </div>

        {/* KPI ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
          <Kpi label="Facturación" value="$487.200" delta="+28%" deltaPositive />
          <Kpi label="Ganancia neta" value="$214.800" delta="+34%" deltaPositive />
          <Kpi label="Pedidos" value="42" delta="+9" deltaPositive />
          <Kpi label="Ticket promedio" value="$11.600" delta="−4%" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '7fr 5fr', gap: 24 }}>
          {/* Chart card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600 }}>Ventas últimos 30 días</h3>
              <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--fg-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: 'var(--vesto-noche)', borderRadius: 2 }}></span>Facturación</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: 'var(--vesto-champagne)', borderRadius: 2 }}></span>Ganancia</span>
              </div>
            </div>
            <FakeChart />
          </div>

          {/* Top products */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Tus más vendidos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 12, alignItems: 'center' }}>
                  <div style={{ aspectRatio: '4/5', background: p.bg, borderRadius: 6 }}></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>{[14, 9, 7, 5][i]} unidades vendidas</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>${(p.priceMay * [14,9,7,5][i]).toLocaleString('es-AR')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 600 }}>Pedidos recientes</h3>
            <a href="#" style={{ fontSize: 13, borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--fg-muted)' }}>Ver todos <Icon name="arrowRight" size={14}/></a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>
                <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Pedido</th>
                <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Cliente final</th>
                <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Prendas</th>
                <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>Estado</th>
                <th style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: '#TR-1284', cliente: 'Camila R.', items: 3, estado: 'Enviado', total: 18900, st: 'success' },
                { id: '#TR-1283', cliente: 'Martina V.', items: 1, estado: 'Preparando', total: 8900,  st: 'accent' },
                { id: '#TR-1282', cliente: 'Lucía P.',   items: 5, estado: 'Entregado', total: 42600, st: 'success' },
                { id: '#TR-1281', cliente: 'Romina T.',  items: 2, estado: 'Pago pendiente', total: 14800, st: 'coral' },
              ].map(o => (
                <tr key={o.id}>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{o.id}</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>{o.cliente}</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', color: 'var(--fg-muted)' }}>{o.items}</td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}><Badge variant={o.st}>{o.estado}</Badge></td>
                  <td style={{ padding: '14px 0', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 600 }}>${o.total.toLocaleString('es-AR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Kpi({ label, value, delta, deltaPositive }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 12 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: deltaPositive ? 'var(--vesto-verde-exito)' : 'var(--vesto-coral)' }}>{delta}</div>
    </div>
  );
}

function FakeChart() {
  // Simple SVG bar chart
  const data = [42, 55, 38, 64, 71, 58, 78, 82, 68, 90, 76, 88, 95, 102, 88, 110, 96, 105];
  const max = Math.max(...data);
  return (
    <svg width="100%" height="180" viewBox={`0 0 ${data.length * 22} 180`} preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * 140;
        const g = h * 0.42;
        return (
          <g key={i} transform={`translate(${i * 22}, 0)`}>
            <rect x="3" y={170 - h} width="16" height={h} fill="#1A1A2E" rx="2"/>
            <rect x="3" y={170 - g} width="16" height={g} fill="#C9A96E" rx="2"/>
          </g>
        );
      })}
    </svg>
  );
}

window.Dashboard = Dashboard;
