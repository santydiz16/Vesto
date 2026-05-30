/* eslint-disable */

const ADMIN_PASS = window.VESTO_ADMIN_PASS || '';

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

/** Strip HTML tags from user text input — prevents XSS stored in product names/badges */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = String(str || '');
  return div.textContent;
}

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
  const [tab, setTab]                   = useState('productos');
  const [search, setSearch]             = useState('');
  const [editingProduct, setEditingProduct]   = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAttr, setEditingAttr]         = useState(null);
  const [deleteConfirm, setDeleteConfirm]     = useState(null);
  const [toast, setToast]               = useState(null);
  const [categories, setCategories]     = useState(() => getCategories());
  const [attributes, setAttributes]     = useState(() => getAttributes());
  const fileRef                         = useRef(null);

  const onCategoriesChange = (list) => { saveCategories(list); setCategories(list); };
  const onAttributesChange = (list) => { saveAttributes(list); setAttributes(list); };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Category handlers ── */
  const handleSaveCategory = (cat) => {
    const isNew = !cat.id;
    const genId = cat.label.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const saved = isNew ? { ...cat, id: genId + '_' + Date.now() } : cat;
    const updated = isNew
      ? [...categories, saved]
      : categories.map(c => c.id === saved.id ? saved : c);
    onCategoriesChange(updated);
    setEditingCategory(null);
    showToast(isNew ? 'Categoría creada.' : 'Categoría actualizada.');
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm('¿Eliminar esta categoría? Los productos que la usen quedarán sin categoría activa.')) return;
    onCategoriesChange(categories.filter(c => c.id !== id));
    showToast('Categoría eliminada.');
  };

  const handleToggleCategory = (id) => {
    if (id === 'todos') return;
    onCategoriesChange(categories.map(c => c.id === id ? { ...c, active: c.active === false } : c));
  };

  /* ── Attribute handlers ── */
  const handleSaveAttr = (attr) => {
    const isNew = !attr.id;
    const saved = isNew ? { ...attr, id: 'attr_' + Date.now() } : attr;
    const updated = isNew
      ? [...attributes, saved]
      : attributes.map(a => a.id === saved.id ? saved : a);
    onAttributesChange(updated);
    setEditingAttr(null);
    showToast(isNew ? 'Atributo creado.' : 'Atributo actualizado.');
  };

  const handleDeleteAttr = (id) => {
    if (!window.confirm('¿Eliminar este atributo?')) return;
    onAttributesChange(attributes.filter(a => a.id !== id));
    showToast('Atributo eliminado.');
  };

  const handleLogin = () => {
    // Block access if ADMIN_PASS is not configured (empty string matches empty input — security hole)
    if (!ADMIN_PASS) {
      setPassError(true);
      setTimeout(() => setPassError(false), 3000);
      return;
    }
    if (passInput && passInput === ADMIN_PASS) {
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
                {!ADMIN_PASS
                  ? 'Panel no configurado. Definí VESTO_ADMIN_PASS en las variables de entorno.'
                  : 'Contraseña incorrecta.'}
              </div>
            )}
            <Button variant="primary" size="lg" onClick={handleLogin}>Ingresar</Button>
          </div>
        </div>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }`}</style>
      </main>
    );
  }

  /* ── FILTER (products) ── */
  const filtered = (products || []).filter(p => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  /* ── PRODUCT ACTIONS ── */
  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    try {
      await onProductsChange((products || []).filter(p => p.id !== id));
      showToast('Producto eliminado.');
    } catch(e) {
      showToast('Error al eliminar. Intentá de nuevo.', 'error');
    }
  };

  const handleSave = async (product) => {
    const isNew = !product.id || product.id === '';
    const saved = isNew ? { ...product, id: 'p' + Date.now() } : product;
    const updated = isNew
      ? [...(products || []), saved]
      : (products || []).map(p => p.id === saved.id ? saved : p);
    setEditingProduct(null); // close modal immediately (optimistic)
    try {
      await onProductsChange(updated);
      showToast(isNew ? 'Producto creado correctamente.' : 'Cambios guardados.');
    } catch(e) {
      showToast('Error al guardar. Revisá tu conexión.', 'error');
    }
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
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data) && data.length > 0) {
          await onProductsChange(data);
          showToast(`${data.length} productos importados.`);
        } else {
          showToast('Archivo inválido: debe ser un array JSON con al menos un producto.', 'error');
        }
      } catch(err) {
        showToast('Error al procesar el archivo. Verificá que sea un JSON válido.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = async () => {
    if (!window.confirm('¿Restaurar los productos de demo? Se borrarán todos tus cambios.')) return;
    const seed = resetProducts(); // sync: clears localStorage, returns seed array
    try {
      await onProductsChange(seed);
      showToast('Catálogo restaurado a la versión demo.');
    } catch(e) {
      showToast('Error al restaurar. Intentá de nuevo.', 'error');
    }
  };

  /* ── RENDER ── */
  return (
    <main style={{ padding: '40px var(--container-gutter) 80px' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Panel admin</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 48, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Gestión del catálogo.</h1>
            <p style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8 }}>Productos, categorías y atributos. Los cambios se guardan automáticamente.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 8 }}>
            {tab === 'productos' && <>
              <button onClick={handleExport} className="vesto-btn vesto-btn--ghost vesto-btn--sm"><Icon name="download" size={15}/> Exportar</button>
              <button onClick={() => fileRef.current && fileRef.current.click()} className="vesto-btn vesto-btn--ghost vesto-btn--sm"><Icon name="upload" size={15}/> Importar</button>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport}/>
              <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingProduct(EMPTY_PRODUCT())}>Nuevo producto</Button>
            </>}
            {tab === 'categorias' && (
              <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingCategory({ id: '', label: '', emoji: '📦', active: true })}>
                Nueva categoría
              </Button>
            )}
            {tab === 'atributos' && (
              <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingAttr({ id: '', name: '', type: 'chips', options: [], required: false })}>
                Nuevo atributo
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {[
            { id: 'productos',  label: 'Productos',  emoji: '📦' },
            { id: 'categorias', label: 'Categorías', emoji: '🗂️' },
            { id: 'atributos',  label: 'Atributos',  emoji: '🏷️' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'transparent', border: 'none',
              borderBottom: tab === t.id ? '2px solid var(--vesto-noche)' : '2px solid transparent',
              padding: '8px 20px', fontSize: 14,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--fg)' : 'var(--fg-muted)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', marginBottom: -1,
              transition: 'all 140ms', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        {/* Stats strip — products only */}
        {tab === 'productos' && (
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
        )}

        {/* ── TAB: Productos ── */}
        {tab === 'productos' && (
          <>
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
                          <div style={{ width: 36, height: 46, background: p.bg, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                            {p.image && <img src={p.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }}/>}
                          </div>
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
          </>
        )}

        {/* ── TAB: Categorías ── */}
        {tab === 'categorias' && (
          <CategoryManager
            categories={categories}
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
            onToggle={handleToggleCategory}
          />
        )}

        {/* ── TAB: Atributos ── */}
        {tab === 'atributos' && (
          <AttributeManager
            attributes={attributes}
            onEdit={setEditingAttr}
            onDelete={handleDeleteAttr}
          />
        )}

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

      {/* Edit/Create product form modal */}
      {editingProduct && (
        <AdminOverlay onClose={() => setEditingProduct(null)}>
          <ProductForm
            product={editingProduct}
            categories={categories}
            attributes={attributes}
            onSave={handleSave}
            onCancel={() => setEditingProduct(null)}
          />
        </AdminOverlay>
      )}

      {/* Category form modal */}
      {editingCategory && (
        <AdminOverlay onClose={() => setEditingCategory(null)}>
          <CategoryForm
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => setEditingCategory(null)}
          />
        </AdminOverlay>
      )}

      {/* Attribute form modal */}
      {editingAttr && (
        <AdminOverlay onClose={() => setEditingAttr(null)}>
          <AttributeForm
            attribute={editingAttr}
            onSave={handleSaveAttr}
            onCancel={() => setEditingAttr(null)}
          />
        </AdminOverlay>
      )}

      {/* Toast */}
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
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
      `}</style>
    </main>
  );
}

/* ── Overlay wrapper ── */
function AdminOverlay({ children, onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.65)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflowY: 'auto' }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 620, maxHeight: '92vh', overflowY: 'auto', borderRadius: 16 }}>
        {children}
      </div>
    </div>
  );
}

/* ── Category Manager ── */
function CategoryManager({ categories, onEdit, onDelete, onToggle }) {
  return (
    <div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {categories.length === 0 ? (
          <div style={{ padding: '64px 16px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 14 }}>
            No hay categorías. Creá una nueva con el botón de arriba.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', background: 'rgba(26,26,46,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px', width: 56 }}>Emoji</th>
                <th style={{ padding: '12px 16px' }}>Nombre</th>
                <th style={{ padding: '12px 16px' }}>ID interno</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '12px 16px', width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i === categories.length - 1 ? 'none' : '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontSize: 22, lineHeight: 1 }}>{c.emoji}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 500, fontSize: 14 }}>{c.label}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{c.id}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => onToggle && c.id !== 'todos' && onToggle(c.id)}
                      style={{
                        background: c.active !== false ? 'rgba(22,163,74,0.1)' : 'rgba(224,122,95,0.1)',
                        border: 'none', borderRadius: 20, padding: '4px 14px', fontSize: 11, fontWeight: 600,
                        cursor: c.id === 'todos' ? 'default' : 'pointer',
                        color: c.active !== false ? 'var(--vesto-verde-exito)' : 'var(--vesto-coral)',
                        fontFamily: 'var(--font-body)',
                      }}>
                      {c.active !== false ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onEdit({ ...c })}
                        style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--fg)' }}>
                        Editar
                      </button>
                      {c.id !== 'todos' && (
                        <button
                          onClick={() => onDelete(c.id)}
                          style={{ background: 'transparent', border: '1px solid rgba(224,122,95,0.4)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--vesto-coral)' }}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 12, lineHeight: 1.6 }}>
        Las categorías <strong>activas</strong> aparecen en el catálogo. Podés desactivar una sin eliminarla. La categoría "Todos" es fija y no puede eliminarse.
      </p>
    </div>
  );
}

/* ── Category Form ── */
function CategoryForm({ category: initial, onSave, onCancel }) {
  const isNew = !initial || !initial.id;
  const [form, setForm] = useState({ emoji: '📦', label: '', active: true, ...(initial || {}) });
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const EMOJI_OPTS = ['👕','👔','👗','👖','🧥','🩱','🌀','🧣','🧤','👒','👟','👜','🎀','💍','🌸','✦','🏷️','📦','🌿','⭐'];

  const handleSubmit = () => {
    if (!form.label.trim()) { alert('El nombre es obligatorio.'); return; }
    onSave(form);
  };

  return (
    <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.02em' }}>
          {isNew ? 'Nueva categoría.' : 'Editar categoría.'}
        </h2>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
          <Icon name="x" size={20}/>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <FormField label="Nombre de la categoría *">
          <input
            className="vesto-input"
            value={form.label}
            onChange={e => update('label', e.target.value)}
            placeholder="Ej: Accesorios, Abrigos, Calzado…"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>

        <FormField label="Emoji representativo">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {EMOJI_OPTS.map(em => (
              <button
                key={em} type="button"
                onClick={() => update('emoji', em)}
                style={{
                  width: 42, height: 42, fontSize: 20, borderRadius: 8,
                  border: form.emoji === em ? '2px solid var(--vesto-noche)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  background: form.emoji === em ? 'rgba(26,26,46,0.08)' : 'transparent',
                  transition: 'all 120ms',
                }}>
                {em}
              </button>
            ))}
          </div>
          <input
            className="vesto-input"
            value={form.emoji}
            onChange={e => update('emoji', e.target.value)}
            placeholder="O escribí cualquier otro emoji"
            style={{ width: '100%', boxSizing: 'border-box', fontSize: 18 }}
          />
        </FormField>

        <FormField label="Estado">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={form.active !== false}
              onChange={e => update('active', e.target.checked)}
              style={{ accentColor: 'var(--vesto-noche)', width: 16, height: 16 }}
            />
            Categoría activa (visible en el catálogo)
          </label>
        </FormField>

        {/* Preview chip */}
        <div style={{ background: 'rgba(26,26,46,0.04)', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Vista previa</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 14px', fontSize: 14, fontFamily: 'var(--font-body)' }}>
            <span style={{ fontSize: 18 }}>{form.emoji || '📦'}</span>
            <span style={{ fontWeight: 500 }}>{form.label || 'Nombre de categoría'}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <Button variant="ghost" style={{ flex: 1 }} onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" style={{ flex: 1 }} iconAfter="check" onClick={handleSubmit}>
          {isNew ? 'Crear categoría' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}

/* ── Attribute Manager ── */
function AttributeManager({ attributes, onEdit, onDelete }) {
  const typeLabels = { chips: 'Chips', select: 'Selector', text: 'Texto libre', number: 'Número' };
  const typeColors = { chips: '#1A1A2E', select: '#3D3D5C', text: '#8B5E3C', number: '#5C7A5F' };

  return (
    <div>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {attributes.length === 0 ? (
          <div style={{ padding: '72px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏷️</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: 'var(--fg)' }}>Todavía no hay atributos</div>
            <div style={{ fontSize: 13, color: 'var(--fg-muted)', maxWidth: 320, margin: '0 auto', lineHeight: 1.6 }}>
              Creá atributos para definir características de tus productos: talle, color, material, origen y más.
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', background: 'rgba(26,26,46,0.03)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 16px' }}>Nombre</th>
                <th style={{ padding: '12px 16px' }}>Tipo</th>
                <th style={{ padding: '12px 16px' }}>Opciones</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Requerido</th>
                <th style={{ padding: '12px 16px', width: 160 }}></th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i === attributes.length - 1 ? 'none' : '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{a.name}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: typeColors[a.type] ? typeColors[a.type] + '18' : 'rgba(26,26,46,0.07)',
                      color: typeColors[a.type] || 'var(--fg)',
                      borderRadius: 4, padding: '3px 10px', fontSize: 12, fontWeight: 600,
                    }}>
                      {typeLabels[a.type] || a.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--fg-muted)', maxWidth: 280 }}>
                    {(a.options || []).length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(a.options || []).slice(0, 6).map(op => (
                          <span key={op} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 8px', fontSize: 11 }}>{op}</span>
                        ))}
                        {(a.options || []).length > 6 && (
                          <span style={{ fontSize: 11, color: 'var(--fg-subtle)', alignSelf: 'center' }}>+{(a.options || []).length - 6} más</span>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--fg-subtle)', fontStyle: 'italic' }}>Sin opciones</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    {a.required
                      ? <span style={{ fontSize: 13, color: 'var(--vesto-verde-exito)', fontWeight: 600 }}>Sí</span>
                      : <span style={{ fontSize: 13, color: 'var(--fg-subtle)' }}>No</span>}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => onEdit({ ...a, options: [...(a.options || [])] })}
                        style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--fg)' }}>
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(a.id)}
                        style={{ background: 'transparent', border: '1px solid rgba(224,122,95,0.4)', borderRadius: 4, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--vesto-coral)' }}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p style={{ fontSize: 12, color: 'var(--fg-subtle)', marginTop: 12, lineHeight: 1.7 }}>
        <strong>Chips</strong>: botones seleccionables, ideal para Talle y Color. &nbsp;
        <strong>Selector</strong>: dropdown de opciones. &nbsp;
        <strong>Texto libre</strong>: campo de escritura abierto. &nbsp;
        <strong>Número</strong>: solo admite valores numéricos.
      </p>
    </div>
  );
}

/* ── Attribute Form ── */
function AttributeForm({ attribute: initial, onSave, onCancel }) {
  const isNew = !initial || !initial.id;
  const [form, setForm] = useState({ name: '', type: 'chips', options: [], required: false, ...(initial || {}) });
  const [optInput, setOptInput] = useState('');
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addOption = () => {
    const val = optInput.trim();
    if (!val) return;
    const opts = form.options || [];
    if (opts.includes(val)) { setOptInput(''); return; }
    update('options', [...opts, val]);
    setOptInput('');
  };

  const removeOption = (opt) => update('options', (form.options || []).filter(o => o !== opt));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addOption(); }
    if (e.key === 'Backspace' && !optInput && (form.options || []).length > 0) {
      update('options', (form.options || []).slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) { alert('El nombre del atributo es obligatorio.'); return; }
    onSave(form);
  };

  const needsOptions = form.type === 'chips' || form.type === 'select';

  const QUICK_SETS = [
    { label: 'Talles ropa', opts: ['XS','S','M','L','XL','XXL'] },
    { label: 'Talles calzado', opts: ['36','37','38','39','40','41','42'] },
    { label: 'Colores básicos', opts: ['Negro','Blanco','Gris','Beige','Azul','Verde','Rojo'] },
    { label: 'Materiales', opts: ['Algodón','Lino','Jean','Lana','Sintético','Cuero'] },
  ];

  return (
    <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 32, letterSpacing: '-0.02em' }}>
          {isNew ? 'Nuevo atributo.' : 'Editar atributo.'}
        </h2>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
          <Icon name="x" size={20}/>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        <FormField label="Nombre del atributo *">
          <input
            className="vesto-input"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Ej: Talle, Color, Material, Origen…"
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
        </FormField>

        <FormField label="Tipo de campo">
          <select
            className="vesto-input"
            value={form.type}
            onChange={e => update('type', e.target.value)}
            style={{ width: '100%', appearance: 'none', boxSizing: 'border-box' }}>
            <option value="chips">Chips — botones seleccionables (recomendado para Talle, Color)</option>
            <option value="select">Selector — dropdown con opciones predefinidas</option>
            <option value="text">Texto libre — el usuario escribe el valor</option>
            <option value="number">Número — campo numérico (peso, medidas, etc.)</option>
          </select>
        </FormField>

        {needsOptions && (
          <FormField label="Opciones disponibles">
            {/* Quick-load sets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-muted)', alignSelf: 'center', marginRight: 4 }}>Cargar rápido:</span>
              {QUICK_SETS.map(qs => (
                <button
                  key={qs.label} type="button"
                  onClick={() => update('options', [...new Set([...(form.options || []), ...qs.opts])])}
                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 4, padding: '3px 10px', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)', color: 'var(--fg-muted)', fontWeight: 500 }}>
                  {qs.label}
                </button>
              ))}
            </div>

            {/* Chips display */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8,
              minHeight: 40, padding: '8px 10px',
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8,
            }}>
              {(form.options || []).map(op => (
                <div key={op} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--vesto-noche)', color: 'var(--vesto-marfil)', borderRadius: 4, padding: '4px 10px', fontSize: 13, fontWeight: 500 }}>
                  <span>{op}</span>
                  <button
                    type="button" onClick={() => removeOption(op)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(245,240,232,0.55)', fontSize: 15, lineHeight: 1, padding: '0 0 0 4px', display: 'flex', alignItems: 'center' }}>
                    ×
                  </button>
                </div>
              ))}
              {(form.options || []).length === 0 && (
                <span style={{ color: 'var(--fg-subtle)', fontSize: 13, alignSelf: 'center' }}>Las opciones aparecerán aquí…</span>
              )}
            </div>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="vesto-input"
                value={optInput}
                onChange={e => setOptInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribí y presioná Enter o coma para agregar"
                style={{ flex: 1, boxSizing: 'border-box' }}
              />
              <button
                type="button" onClick={addOption}
                style={{ background: 'var(--vesto-noche)', color: 'var(--vesto-marfil)', border: 'none', borderRadius: 6, padding: '0 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap', height: 44 }}>
                + Agregar
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-subtle)', marginTop: 4 }}>
              Backspace elimina la última opción. Podés agregar tantas como necesites.
            </div>
          </FormField>
        )}

        <FormField label="¿Obligatorio al cargar un producto?">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
            <input
              type="checkbox"
              checked={!!form.required}
              onChange={e => update('required', e.target.checked)}
              style={{ accentColor: 'var(--vesto-noche)', width: 16, height: 16 }}
            />
            Sí, requerir este campo al crear o editar productos
          </label>
        </FormField>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
        <Button variant="ghost" style={{ flex: 1 }} onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" style={{ flex: 1 }} iconAfter="check" onClick={handleSubmit}>
          {isNew ? 'Crear atributo' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  );
}

/* ── Product form ── */
function ProductForm({ product: initial, categories, attributes, onSave, onCancel }) {
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
      name:     sanitize(form.name),
      badge:    sanitize(form.badge    || ''),
      category: sanitize(form.category || ''),
      priceMay: Number(form.priceMay),
      pricePvp: Number(form.pricePvp) || 0,
      stock:    Number(form.stock)    || 0,
    });
  };

  const isNew    = !initial.id || initial.id === '';
  const ganUnit  = (Number(form.pricePvp) || 0) - (Number(form.priceMay) || 0);
  const margen   = (Number(form.pricePvp) > 0) ? Math.round((ganUnit / Number(form.pricePvp)) * 100) : 0;

  // Dynamic categories for dropdown — exclude 'todos'
  const catOptions = (categories || getCategories()).filter(c => c.id !== 'todos' && c.active !== false);

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

        {/* Categoría — usa categorías dinámicas */}
        <FormField label="Categoría *">
          <select className="vesto-input" value={form.category} onChange={e => update('category', e.target.value)} style={{ width: '100%', appearance: 'none', boxSizing: 'border-box' }}>
            {catOptions.map(c => (
              <option key={c.id} value={c.id}>{c.emoji ? c.emoji + ' ' : ''}{c.label}</option>
            ))}
            {catOptions.length === 0 && <option value="">Sin categorías activas</option>}
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

        {/* Atributos personalizados */}
        {(attributes || []).filter(a => a.type === 'chips' || a.type === 'select').length > 0 && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 16 }}>Atributos personalizados</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(attributes || []).map(attr => {
                const key = 'attr_' + attr.id;
                const val = form[key];
                if (attr.type === 'chips') {
                  const selected = Array.isArray(val) ? val : [];
                  const toggle = (opt) => {
                    update(key, selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt]);
                  };
                  return (
                    <FormField key={attr.id} label={attr.name + (attr.required ? ' *' : '')}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(attr.options || []).map(opt => {
                          const sel = selected.includes(opt);
                          return (
                            <button key={opt} type="button" onClick={() => toggle(opt)}
                              style={{ minWidth: 44, height: 36, border: `1px solid ${sel ? 'var(--vesto-noche)' : 'var(--border)'}`, borderRadius: 4, fontSize: 13, fontWeight: sel ? 600 : 400, cursor: 'pointer', background: sel ? 'var(--vesto-noche)' : 'transparent', color: sel ? 'var(--vesto-marfil)' : 'var(--fg)', fontFamily: 'var(--font-body)', padding: '0 12px', transition: 'all 140ms' }}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </FormField>
                  );
                }
                if (attr.type === 'select') {
                  return (
                    <FormField key={attr.id} label={attr.name + (attr.required ? ' *' : '')}>
                      <select className="vesto-input" value={val || ''} onChange={e => update(key, e.target.value)} style={{ width: '100%', appearance: 'none', boxSizing: 'border-box' }}>
                        <option value="">Seleccioná…</option>
                        {(attr.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </FormField>
                  );
                }
                if (attr.type === 'text') {
                  return (
                    <FormField key={attr.id} label={attr.name + (attr.required ? ' *' : '')}>
                      <input className="vesto-input" value={val || ''} onChange={e => update(key, e.target.value)} placeholder={`Ingresá ${attr.name.toLowerCase()}…`} style={{ width: '100%', boxSizing: 'border-box' }}/>
                    </FormField>
                  );
                }
                if (attr.type === 'number') {
                  return (
                    <FormField key={attr.id} label={attr.name + (attr.required ? ' *' : '')}>
                      <input className="vesto-input" type="number" value={val || ''} onChange={e => update(key, e.target.value)} placeholder="0" style={{ width: '100%', boxSizing: 'border-box' }}/>
                    </FormField>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {/* Imagen */}
        <FormField label="Foto del producto">
          <ImageUploader value={form.image || ''} onChange={val => update('image', val)} />
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

/* ── Image uploader with drag & drop ── */
function ImageUploader({ value, onChange }) {
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        // 1. Load and resize image on canvas (max 1000px, 85% JPEG quality)
        const img = new Image();
        await new Promise(resolve => { img.onload = resolve; img.src = ev.target.result; });

        const MAX = 1000;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);

        // 2. Try Supabase Storage upload (when client is configured)
        const sbClient = window.sb;
        if (sbClient) {
          try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
            const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
            const { data, error } = await sbClient.storage
              .from('product-images')
              .upload(fileName, blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
            if (!error) {
              const { data: { publicUrl } } = sbClient.storage
                .from('product-images')
                .getPublicUrl(data.path);
              onChange(publicUrl);
              return; // uploaded successfully — skip base64 fallback
            }
            console.warn('VESTO: Storage upload failed, falling back to base64', error);
          } catch(storageErr) {
            console.warn('VESTO: Storage error, falling back to base64', storageErr);
          }
        }

        // 3. Fallback: base64 (Supabase not configured, or upload failed)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onChange(dataUrl);
      } catch(e) {
        console.error('VESTO: processFile error', e);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const onDrop      = (e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); };
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);

  const dropZoneStyle = {
    border: `2px dashed ${dragging ? 'var(--vesto-champagne)' : 'var(--border-strong)'}`,
    borderRadius: 10,
    padding: value ? '12px 16px' : '32px 16px',
    textAlign: 'center',
    cursor: 'pointer',
    background: dragging ? 'rgba(201,169,110,0.07)' : 'var(--bg-card)',
    transition: 'all 180ms',
    userSelect: 'none',
  };

  return (
    <div>
      <div style={dropZoneStyle} onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave} onClick={() => !loading && inputRef.current?.click()}>
        {loading ? (
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', padding: '8px 0' }}>Procesando imagen…</div>
        ) : value ? (
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', textAlign: 'left' }}>
            <img
              src={value} alt="preview"
              style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--vesto-verde-exito)', marginBottom: 4 }}>✓ Foto cargada</div>
              <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
                Arrastrá otra imagen acá<br/>o hacé clic para cambiarla
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(201,169,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon name="upload" size={22} color="var(--vesto-champagne)" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Arrastrá tu foto acá</div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16 }}>
              JPG, PNG, WEBP · Se comprime y redimensiona automáticamente
            </div>
            <button
              type="button"
              style={{ background: 'var(--vesto-noche)', color: 'var(--vesto-marfil)', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <Icon name="upload" size={15} color="var(--vesto-marfil)" /> Elegir archivo
            </button>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { processFile(e.target.files[0]); e.target.value = ''; }} />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{ marginTop: 8, background: 'transparent', border: 'none', fontSize: 12, color: 'var(--vesto-coral)', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0, textDecoration: 'underline' }}
        >
          Quitar imagen
        </button>
      )}
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
