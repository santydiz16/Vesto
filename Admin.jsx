/* eslint-disable */

const ADMIN_PASS = 'vesto2026';

const BG_PRESETS = [
  { label: 'Crema',         value: 'linear-gradient(180deg,#E8DFD0 0%,#D9CBB3 100%)' },
  { label: 'Noche',         value: 'linear-gradient(180deg,#3D3D5C 0%,#1A1A2E 100%)' },
  { label: 'Terracota',     value: 'linear-gradient(180deg,#D89372 0%,#C1531A 100%)' },
  { label: 'Marfil',        value: 'linear-gradient(180deg,#F5F0E8 0%,#E5DCC9 100%)' },
  { label: 'Noche profundo',value: 'linear-gradient(180deg,#3D3D5C 0%,#111 100%)' },
  { label: 'Café',          value: 'linear-gradient(180deg,#F2E8D9 0%,#8B5E3C 100%)' },
  { label: 'Champagne',     value: 'linear-gradient(180deg,#C9A96E 0%,#8B5E3C 100%)' },
  { label: 'Salvia',        value: 'linear-gradient(180deg,#5C7A5F 0%,#3D3D5C 100%)' },
  { label: 'Arena',         value: 'linear-gradient(180deg,#D4C4A8 0%,#B8956A 100%)' },
  { label: 'Rosa nude',     value: 'linear-gradient(180deg,#E8C9B8 0%,#C4906E 100%)' },
  { label: 'Mostaza',       value: 'linear-gradient(180deg,#E8D07A 0%,#C4963E 100%)' },
  { label: 'Mint',          value: 'linear-gradient(180deg,#A8D5C2 0%,#5C7A5F 100%)' },
];

const ALL_SIZES = ['XS','S','M','L','XL','XXL','36','38','40','42','44','46'];
const BADGE_VARIANTS_LIST = ['accent','coral','ghost','success'];

const EMPTY_PRODUCT = () => ({
  id: '', name: '', category: 'buzos',
  sizes: ['S','M','L'],
  priceMay: '', pricePvp: '',
  bg: BG_PRESETS[0].value,
  image: '',
  badge: '', badgeVariant: 'accent',
  stock: '',
});

function Admin({ onNav, products, onProductsChange }) {
  const [authed, setAuthed]             = useState(false);
  const [passInput, setPassInput]       = useState('');
  const [passError, setPassError]       = useState(false);
  const [search, setSearch]             = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  const [toast, setToast]               = useState(null);
  const fileRef                         = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogin = () => {
    if (passInput === ADMIN_PASS) {
      setAuthed(true);
    } else {
      setPassError(true);
      setTimeout(() => setPassError(false), 1000);
    }
  };

  /* ── PASSWORD GATE ── */
  if (!authed) {
    return (
      <main style={{ padding: '120px var(--container-gutter)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          <div style={{ width: 56, height: 56, borderRadius: 10, background: 'rgba(26,26,46,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Icon name="settings" size={28} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 40, letterSpacing: '-0.025em', textAlign: 'center', marginBottom: 8 }}>Panel admin.</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-muted)', textAlign: 'center', marginBottom: 32, lineHeight: 1.5 }}>
            Gestioná los productos del catálogo sin tocar código. Ingresá tu contraseña para continuar.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="vesto-input"
              type="password"
              placeholder="Contraseña"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                height: 52, fontSize: 16, textAlign: 'center',
                border: passError ? '1.5px solid var(--vesto-coral)' : undefined,
                transition: 'border-color 180ms',
                animation: passError ? 'shake 0.4s ease' : 'none',
              }}
            />
            {passError && (
              <div style={{ fontSize: 13, color: 'var(--vesto-coral)', textAlign: 'center', fontWeight: 500 }}>
                Contraseña incorrecta.
              </div>
            )}
            <Button variant="primary" size="lg" onClick={handleLogin}>Ingresar</Button>
          </div>
        </div>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }`}</style>
      </main>
    );
  }

  /* ── FILTER ── */
  const filtered = (products || []).filter(p => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  /* ── ACTIONS ── */
  const handleDelete = (id) => {
    onProductsChange((products || []).filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast('Producto eliminado.');
  };

  const handleSave = (product) => {
    const isNew = !product.id || product.id === '';
    const saved = isNew ? { ...product, id: 'p' + Date.now() } : product;
    const updated = isNew
      ? [...(products || []), saved]
      : (products || []).map(p => p.id === saved.id ? saved : p);
    onProductsChange(updated);
    setEditingProduct(null);
    showToast(isNew ? 'Producto creado correctamente.' : 'Cambios guardados.');
  };

  const handleExport = () => {
    const json = JSON.stringify(products, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'vesto-productos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exportación lista. Revisá tu carpeta de descargas.');
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data) && data.length > 0) {
          onProductsChange(data);
          showToast(`${data.length} productos importados.`);
        } else {
          showToast('Archivo inválido: debe ser un array JSON con al menos un producto.', 'error');
        }
      } catch(err) {
        showToast('Error al leer el archivo. Verificá que sea un JSON válido.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (!window.confirm('¿Restaurar los productos de demo? Se borrarán todos tus cambios.')) return;
    onProductsChange(resetProducts());
    showToast('Catálogo restaurado a la versión demo.');
  };

  /* ── RENDER ── */
  return (
    <main style={{ padding: '40px var(--container-gutter) 80px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Panel admin</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 48, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Gestión de productos.</h1>
            <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8 }}>Agregá, editá o eliminá productos del catálogo. Los cambios se guardan automáticamente.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 8 }}>
            <button onClick={handleExport} className="vesto-btn vesto-btn--ghost vesto-btn--sm">
              <Icon name="download" size={15}/> Exportar JSON
            </button>
            <button onClick={() => fileRef.current && fileRef.current.click()} className="vesto-btn vesto-btn--ghost vesto-btn--sm">
              <Icon name="upload" size={15}/> Importar JSON
            </button>
            <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport}/>
            <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingProduct(EMPTY_PRODUCT())}>
              Nuevo producto
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '16px 20px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }}>
          <div><span style={{ color: 'var(--fg-muted)' }}>Total productos: </span><strong>{(products || []).length}</strong></div>
          <div style={{ width: 1, background: 'var(--border)' }}></div>
          <div><span style={{ color: 'var(--fg-muted)' }}>Stock crítico (&lt;10): </span><strong style={{ color: 'var(--vesto-coral)' }}>{(products || []).filter(p => (p.stock || 0) < 10).length}</strong></div>
          <div style={{ width: 1, background: 'var(--border)' }}></div>
          <div>
            <span style={{ color: 'var(--fg-muted)' }}>Margen promedio: </span>
            <strong style={{ color: 'var(--vesto-verde-exito)' }}>
              {(products || []).length > 0
                ? Math.round((products || []).reduce((acc, p) => acc + (p.pricePvp > 0 ? ((p.pricePvp - p.priceMay) / p.pricePvp) * 100 : 0), 0) / (products || []).length)
                : 0}%
            </strong>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleReset} style={{ background: 'transparent', border: 'none', fontSize: 12, color: 'var(--fg-subtle)', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'var(--font-body)' }}>
              Restaurar demo
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <Input
            icon="search"
            placeholder="Buscar por nombre o categoría…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: 360 }}
          />
          <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}</span>
        </div>

        {/* Product table */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', background: 'rgba(26,26,46,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', width: 56 }}>Color</th>
                <th style={{ padding: '12px 16px' }}>Producto</th>
                <th style={{ padding: '12px 16px' }}>Categoría</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>P. Mayorista</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>PVP</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Margen</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock</th>
                <th style={{ padding: '12px 16px', width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const margen = p.pricePvp > 0 ? Math.round(((p.pricePvp - p.priceMay) / p.pricePvp) * 100) : 0;
                const isLast = i === filtered.length - 1;
                return (
                  <tr key={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: 36, height: 46, background: p.bg, borderRadius: 4 }}></div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginBottom: 4 }}>{(p.sizes || []).join(' · ')}</div>
                      {p.badge && <Badge variant={p.badgeVariant || 'ghost'}>{p.badge}</Badge>}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--fg-muted)', textTransform: 'capitalize' }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: 14 }}>${(p.priceMay || 0).toLocaleString('es-AR')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, color: 'var(--fg-muted)' }}>${(p.pricePvp || 0).toLocaleString('es-AR')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 2,
                        color:      margen >= 40 ? 'var(--vesto-verde-exito)' : margen >= 25 ? '#92651a' : 'var(--vesto-coral)',
                        background: margen >= 40 ? 'rgba(22,163,74,0.1)' : margen >= 25 ? 'rgba(201,169,110,0.15)' : 'rgba(224,122,95,0.1)',
                      }}>{margen}%</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: (p.stock || 0) < 10 ? 'var(--vesto-coral)' : 'var(--fg)', fontWeight: (p.stock || 0) < 10 ? 600 : 400 }}>
                      {p.stock || 0}
                      {(p.stock || 0) < 10 && <span style={{ display: 'block', fontSize: 9, fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--vesto-coral)', marginTop: 2 }}>crítico</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => setEditingProduct({ ...p })}
                          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--fg)' }}>
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          style={{ background: 'transparent', border: '1px solid rgba(224,122,95,0.4)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--vesto-coral)' }}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 14 }}>
                    No se encontraron productos.{' '}
                    {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--vesto-champagne)', fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: 14 }}>Limpiar búsqueda</button>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <AdminOverlay onClose={() => setDeleteConfirm(null)}>
          <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 36, maxWidth: 400, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(224,122,95,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Icon name="x" size={24} color="var(--vesto-coral)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 28, marginBottom: 10 }}>¿Eliminar producto?</h3>
            <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginBottom: 28, lineHeight: 1.5 }}>
              "{(products || []).find(p => p.id === deleteConfirm)?.name}" será eliminado del catálogo. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{ flex: 1, height: 44, background: 'var(--vesto-coral)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Eliminar
              </button>
            </div>
          </div>
        </AdminOverlay>
      )}

      {/* Edit/Create form modal */}
      {editingProduct && (
        <AdminOverlay onClose={() => setEditingProduct(null)}>
          <ProductForm
            product={editingProduct}
            onSave={handleSave}
            onCancel={() => setEditingProduct(null)}
          />
        </AdminOverlay>
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 200,
          background: toast.type === 'error' ? 'var(--vesto-coral)' : 'var(--vesto-noche)',
          color: 'var(--vesto-marfil)', padding: '14px 20px', borderRadius: 8,
          fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-body)',
          boxShadow: '0 8px 24px rgba(26,26,46,0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'fadeInUp 220ms ease',
        }}>
          <Icon name={toast.type === 'error' ? 'x' : 'check'} size={16} color="rgba(245,240,232,0.8)"/>
          {toast.msg}
        </div>
      )}
      <style>{`@keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </main>
  );
}

/* ── Overlay wrapper ── */
function AdminOverlay({ children, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.65)', backdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 620, maxHeight: '92vh', overflowY: 'auto', borderRadius: 16 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Product form ── */
function ProductForm({ product: initial, onSave, onCancel }) {
  const [form, setForm] = useState({ ...initial });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const toggleSize = (size) => {
    const current = form.sizes || [];
    update('sizes', current.includes(size) ? current.filter(s => s !== size) : [...current, size]);
  };

  const handleSubmit = () => {
    if (!form.name.trim())            { alert('El nombre es obligatorio.'); return; }
    if (!form.priceMay || isNaN(Number(form.priceMay)) || Number(form.priceMay) <= 0) {
      alert('Ingresá un precio mayorista válido (número mayor a 0).'); return;
    }
    onSave({
      ...form,
      priceMay: Number(form.priceMay),
      pricePvp: Number(form.pricePvp) || 0,
      stock:    Number(form.stock)    || 0,
    });
  };

  const isNew = !initial.id || initial.id === '';
  const ganUnit = (Number(form.pricePvp) || 0) - (Number(form.priceMay) || 0);
  const margen  = (Number(form.pricePvp) > 0) ? Math.round((ganUnit / Number(form.pricePvp)) * 100) : 0;

  return (
    <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 32 }}>
      {/* Modal header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, letterSpacing: '-0.02em' }}>
          {isNew ? 'Nuevo producto.' : 'Editar producto.'}
        </h2>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
          <Icon name="x" size={20}/>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Nombre */}
        <FormField label="Nombre del producto *">
          <input className="vesto-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Ej: Buzo oversize crema" style={{ width: '100%', boxSizing: 'border-box' }}/>
        </FormField>

        {/* Categoría */}
        <FormField label="Categoría *">
          <select className="vesto-input" value={form.category} onChange={e => update('category', e.target.value)} style={{ width: '100%', appearance: 'none', boxSizing: 'border-box' }}>
            {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </FormField>

        {/* Precios */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Precio mayorista *">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--fg-subtle)', pointerEvents: 'none' }}>$</span>
              <input className="vesto-input" type="number" min="0" value={form.priceMay} onChange={e => update('priceMay', e.target.value)} placeholder="8900" style={{ paddingLeft: 24, width: '100%', boxSizing: 'border-box' }}/>
            </div>
          </FormField>
          <FormField label="PVP sugerido">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--fg-subtle)', pointerEvents: 'none' }}>$</span>
              <input className="vesto-input" type="number" min="0" value={form.pricePvp} onChange={e => update('pricePvp', e.target.value)} placeholder="14900" style={{ paddingLeft: 24, width: '100%', boxSizing: 'border-box' }}/>
            </div>
          </FormField>
        </div>

        {/* Margen live preview */}
        {form.priceMay && form.pricePvp && Number(form.pricePvp) > 0 && (
          <div style={{ padding: '10px 16px', background: ganUnit >= 0 ? 'rgba(22,163,74,0.08)' : 'rgba(224,122,95,0.1)', borderRadius: 8, fontSize: 13, fontWeight: 600, display: 'flex', gap: 20, color: ganUnit >= 0 ? 'var(--vesto-verde-exito)' : 'var(--vesto-coral)' }}>
            <span>Margen: {margen}%</span>
            <span>Ganás: ${Math.abs(ganUnit).toLocaleString('es-AR')} {ganUnit < 0 ? '(pérdida)' : 'por unidad'}</span>
          </div>
        )}

        {/* Stock */}
        <FormField label="Stock actual">
          <input className="vesto-input" type="number" min="0" value={form.stock} onChange={e => update('stock', e.target.value)} placeholder="Ej: 42" style={{ width: '100%', boxSizing: 'border-box' }}/>
        </FormField>

        {/* Talles */}
        <FormField label="Talles disponibles">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ALL_SIZES.map(s => {
              const sel = (form.sizes || []).includes(s);
              return (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  style={{ minWidth: 44, height: 36, border: `1px solid ${sel ? 'var(--vesto-noche)' : 'var(--border)'}`, borderRadius: 4, fontSize: 13, fontWeight: sel ? 600 : 400, cursor: 'pointer', background: sel ? 'var(--vesto-noche)' : 'transparent', color: sel ? 'var(--vesto-marfil)' : 'var(--fg)', fontFamily: 'var(--font-body)', padding: '0 10px', transition: 'all 140ms' }}>
                  {s}
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Imagen */}
        <FormField label="URL de imagen (opcional)">
          <input
            className="vesto-input"
            value={form.image || ''}
            onChange={e => update('image', e.target.value)}
            placeholder="https://i.imgur.com/… o cualquier URL pública"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          {form.image && (
            <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <img
                src={form.image} alt="preview"
                style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
                onError={e => { e.target.style.opacity = '0.3'; }}
              />
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5, paddingTop: 4 }}>
                <strong style={{ color: 'var(--vesto-verde-exito)' }}>✓ Imagen cargada.</strong><br/>
                Si la URL es válida y pública, se mostrará en el catálogo.<br/>
                El gradiente se usa como fondo de respaldo.
              </div>
            </div>
          )}
          {!form.image && (
            <div style={{ marginTop: 6, fontSize: 12, color: 'var(--fg-subtle)', lineHeight: 1.5 }}>
              Subí tu foto a <strong>imgbb.com</strong>, <strong>Cloudinary</strong> o Google Drive (link directo) y pegá la URL acá.
            </div>
          )}
        </FormField>

        {/* Color de fondo */}
        <FormField label="Color de fondo (gradiente de respaldo)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {BG_PRESETS.map(bg => (
              <button
                key={bg.value} type="button" title={bg.label}
                onClick={() => update('bg', bg.value)}
                style={{ width: 36, height: 36, borderRadius: 6, background: bg.value, border: form.bg === bg.value ? '2.5px solid var(--vesto-noche)' : '2px solid rgba(26,26,46,0.15)', cursor: 'pointer', boxSizing: 'border-box', transition: 'border-color 140ms' }}
              />
            ))}
          </div>
          <input className="vesto-input" value={form.bg} onChange={e => update('bg', e.target.value)} placeholder="linear-gradient(…) o color hexadecimal" style={{ width: '100%', fontSize: 12, boxSizing: 'border-box' }}/>
        </FormField>

        {/* Badge */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <FormField label="Badge (opcional)">
            <input className="vesto-input" value={form.badge || ''} onChange={e => update('badge', e.target.value)} placeholder="Ej: Novedad, -20%, Top vendido" style={{ width: '100%', boxSizing: 'border-box' }}/>
          </FormField>
          <FormField label="Estilo badge">
            <select className="vesto-input" value={form.badgeVariant || 'accent'} onChange={e => update('badgeVariant', e.target.value)} style={{ width: '100%', appearance: 'none', boxSizing: 'border-box' }}>
              {BADGE_VARIANTS_LIST.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </FormField>
        </div>

        {/* Live preview */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 14 }}>Vista previa del card</div>
          <div style={{ width: 180 }}>
            <ProductCard
              product={{
                ...form,
                name:     form.name || 'Nombre del producto',
                sizes:    form.sizes || [],
                priceMay: Number(form.priceMay) || 0,
                pricePvp: Number(form.pricePvp) || 0,
                stock:    Number(form.stock)    || 0,
              }}
              onClick={() => {}}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <Button variant="ghost" style={{ flex: 1 }} onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" style={{ flex: 1 }} iconAfter="check" onClick={handleSubmit}>
          {isNew ? 'Crear producto' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}

/* ── FormField helper ── */
function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--fg-muted)' }}>{label}</label>
      {children}
    </div>
  );
}

window.Admin = Admin;
