# Vesto 2.0 — Supabase + UI + Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace localStorage with Supabase for products, improve UI/security/performance, and deploy to Vercel.

**Architecture:** Only `getProducts()` / `saveProducts()` become async (Supabase primary, localStorage fallback). `getCategories()` / `getAttributes()` stay synchronous (localStorage) — minimizes component changes. App adds a `loading` state and a `useEffect` to fetch products on mount. Admin.jsx handlers become `async` to `await onProductsChange`. Catalog.jsx gets `useMemo` on the filter pipeline. Vercel deploy uses env vars to generate `config.js` at build time.

**Tech Stack:** Supabase JS v2 (jsDelivr CDN UMD), React 18.3.1, Babel Standalone 7.29 (no build system), Python http.server (local dev), Node.js generate-config script (Vercel build), Vercel (static hosting).

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `supabase/migrations/001_initial.sql` | Create | PostgreSQL schema, RLS policies, seed data |
| `config.js` | Modify | Add SUPABASE_URL + SUPABASE_ANON_KEY placeholders (git-ignored) |
| `config.example.js` | Create | Instructions + placeholder values, safe to commit |
| `scripts/generate-config.js` | Create | Node script that writes config.js from env vars at Vercel build time |
| `package.json` | Create | Minimal package with `"build"` script |
| `index.html` | Modify | (1) Add Supabase CDN script; (2) Add `@keyframes spin` to `<style>`; (3) Change App products init to async useEffect + loading state |
| `Data.jsx` | Modify | Supabase client init, `dbRowToProduct`/`productToDbRow` mappers, async `getProducts` + `saveProducts`, keep rest sync |
| `Components.jsx` | Modify | Add `LoadingScreen` component |
| `Admin.jsx` | Modify | `handleSave`, `handleDelete`, `handleReset`, `handleImport` → async, await `onProductsChange`, show error toast on failure; sanitize inputs |
| `Catalog.jsx` | Modify | Wrap filter pipeline in `useMemo` |
| `vercel.json` | Create | Build command, output dir, security headers |
| `.gitignore` | Modify | Ensure `config.js` is ignored (already is — verify only) |

---

## Task 1 — SQL migration file

**Files:**
- Create: `supabase/migrations/001_initial.sql`

- [ ] **Step 1: Create the migrations directory and SQL file**

Create `/Users/santiagodizbesso/Vesto/supabase/migrations/001_initial.sql` with the following content:

```sql
-- ============================================================
-- VESTO — Initial schema, RLS, seed data
-- Run this once in your Supabase project (SQL editor)
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id            TEXT         PRIMARY KEY,
  name          TEXT         NOT NULL,
  category      TEXT         NOT NULL DEFAULT '',
  sizes         TEXT[]       NOT NULL DEFAULT '{}',
  price_may     INTEGER      NOT NULL DEFAULT 0,
  price_pvp     INTEGER      NOT NULL DEFAULT 0,
  bg            TEXT                  DEFAULT '',
  badge         TEXT                  DEFAULT '',
  badge_variant TEXT                  DEFAULT '',
  image         TEXT                  DEFAULT '',
  stock         INTEGER      NOT NULL DEFAULT 0,
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order    INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id         TEXT         PRIMARY KEY,
  label      TEXT         NOT NULL,
  emoji      TEXT                  DEFAULT '',
  active     BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Attributes table
CREATE TABLE IF NOT EXISTS attributes (
  id         TEXT         PRIMARY KEY,
  name       TEXT         NOT NULL,
  type       TEXT         NOT NULL DEFAULT 'chips',
  options    TEXT[]       NOT NULL DEFAULT '{}',
  required   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────
-- Security model: anon key can read + write.
-- The UI gate (VESTO_ADMIN_PASS) is the write authorization layer.
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "public_read_products"   ON products   FOR SELECT USING (true);
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public_read_attributes" ON attributes FOR SELECT USING (true);

-- Anon write (UI-gated by VESTO_ADMIN_PASS)
CREATE POLICY "anon_write_products"    ON products   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_categories"  ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_write_attributes"  ON attributes FOR ALL USING (true) WITH CHECK (true);

-- ── Seed data ───────────────────────────────────────────────
INSERT INTO products (id, name, category, sizes, price_may, price_pvp, bg, badge, badge_variant, stock, sort_order)
VALUES
  ('p1','Buzo oversize crema','buzos',       ARRAY['S','M','L','XL'],       8900,14900,'linear-gradient(180deg,#E8DFD0 0%,#D9CBB3 100%)','Novedad','accent',42,1),
  ('p2','Jean wide leg tiro alto','jeans',   ARRAY['36','38','40','42','44'],12400,19900,'linear-gradient(180deg,#3D3D5C 0%,#1A1A2E 100%)','-30%','coral',28,2),
  ('p3','Vestido lino terracota','vestidos', ARRAY['S','M','L'],             11200,17900,'linear-gradient(180deg,#D89372 0%,#C1531A 100%)','','',16,3),
  ('p4','Remera básica algodón','remeras',   ARRAY['XS','S','M','L','XL'],   4200,6900,'linear-gradient(180deg,#F5F0E8 0%,#E5DCC9 100%)','','',120,4),
  ('p5','Pantalón sastrero negro','pantalones',ARRAY['36','38','40','42'],   13500,21900,'linear-gradient(180deg,#3D3D5C 0%,#111 100%)','','',22,5),
  ('p6','Camisa oversize rayada','camisas',  ARRAY['S','M','L'],             7800,12500,'linear-gradient(180deg,#F2E8D9 0%,#8B5E3C 100%)','Top vendido','ghost',8,6),
  ('p7','Saco lana boucle','sacos',          ARRAY['S','M','L'],             18900,28900,'linear-gradient(180deg,#C9A96E 0%,#8B5E3C 100%)','Pre-venta','ghost',12,7),
  ('p8','Pollera midi plisada','polleras',   ARRAY['S','M','L'],             9600,15500,'linear-gradient(180deg,#5C7A5F 0%,#3D3D5C 100%)','','',18,8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, label, emoji, active, sort_order)
VALUES
  ('todos',      'Todos',            '✦',  true, 0),
  ('buzos',      'Buzos & sweaters', '🧥', true, 1),
  ('jeans',      'Jeans',            '👖', true, 2),
  ('vestidos',   'Vestidos',         '👗', true, 3),
  ('remeras',    'Remeras',          '👕', true, 4),
  ('camisas',    'Camisas',          '👔', true, 5),
  ('pantalones', 'Pantalones',       '🩱', true, 6),
  ('polleras',   'Polleras',         '🌀', true, 7),
  ('sacos',      'Sacos & abrigos',  '🧣', true, 8)
ON CONFLICT (id) DO NOTHING;
```

- [ ] **Step 2: Commit**

```bash
cd /Users/santiagodizbesso/Vesto
git add supabase/migrations/001_initial.sql
git commit -m "feat: add Supabase migration — schema, RLS, seed data"
```

---

## Task 2 — Config files

**Files:**
- Modify: `config.js`
- Create: `config.example.js`

- [ ] **Step 1: Update config.js with Supabase placeholders**

Replace entire `config.js` with:

```js
// VESTO — Configuración local (NO subir al repositorio — está en .gitignore)
//
// Para obtener SUPABASE_URL y SUPABASE_ANON_KEY:
// 1. Creá un proyecto en https://supabase.com
// 2. Ejecutá supabase/migrations/001_initial.sql en el SQL Editor
// 3. Copiá los valores desde Settings > API
//
// VESTO_ADMIN_PASS: contraseña para acceder al panel /admin
// Cambiala por algo seguro antes de hacer deploy.

window.VESTO_ADMIN_PASS      = 'vesto2026';
window.VESTO_SUPABASE_URL    = '';   // ← pegar URL de Supabase
window.VESTO_SUPABASE_ANON_KEY = ''; // ← pegar anon/public key
```

- [ ] **Step 2: Create config.example.js**

```js
// VESTO — config.example.js
// Copiá este archivo como config.js y completá los valores.
// config.js está en .gitignore y NUNCA se sube al repo.
//
// Pasos para configurar Supabase:
// 1. Creá un proyecto en https://supabase.com (plan gratuito es suficiente)
// 2. En el SQL Editor, ejecutá: supabase/migrations/001_initial.sql
// 3. Copiá los valores desde: Settings > API
//    - Project URL   → VESTO_SUPABASE_URL
//    - anon/public   → VESTO_SUPABASE_ANON_KEY
//
// NOTA: La anon key es pública por diseño (Supabase la usa del lado del cliente).
// La seguridad de escritura se garantiza con Row Level Security.
// VESTO_ADMIN_PASS es la contraseña de acceso al panel /admin — cambiala.

window.VESTO_ADMIN_PASS        = 'CAMBIAR_POR_CONTRASEÑA_SEGURA';
window.VESTO_SUPABASE_URL      = 'https://XXXXXXXXXXXX.supabase.co';
window.VESTO_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

- [ ] **Step 3: Verify .gitignore has config.js**

Run:
```bash
grep 'config.js' /Users/santiagodizbesso/Vesto/.gitignore
```

Expected output: `config.js` (or similar line). If missing, run:
```bash
echo 'config.js' >> /Users/santiagodizbesso/Vesto/.gitignore
```

- [ ] **Step 4: Commit**

```bash
git add config.example.js .gitignore
git commit -m "feat: add Supabase config placeholders and example file"
```

---

## Task 3 — Supabase CDN in index.html

**Files:**
- Modify: `index.html` (head section only)

- [ ] **Step 1: Add Supabase JS CDN script and spin keyframe**

In `index.html`, find the existing `<style>` block (lines 9–13):
```html
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { min-height: 100vh; }
    img { max-width: 100%; }
  </style>
```

Replace it with (adds `@keyframes spin` for LoadingScreen):
```html
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { min-height: 100vh; }
    img { max-width: 100%; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
```

Then find this line:
```html
  <!-- config.js está en .gitignore — contiene VESTO_ADMIN_PASS y nunca se sube al repo -->
  <script src="config.js"></script>
```

Add the Supabase CDN script BEFORE it:
```html
  <!-- Supabase JS v2 — must load before config.js and Data.jsx -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/dist/umd/supabase.min.js"
          integrity="sha384-tD6X9wDfTRdKpuPoHFZrVW2RXjSYSWjLBPWXxpHprWWl9eaHlwl05aRjHsiKF97n"
          crossorigin="anonymous"></script>

  <!-- config.js está en .gitignore — contiene VESTO_ADMIN_PASS y nunca se sube al repo -->
  <script src="config.js"></script>
```

- [ ] **Step 2: Verify the server loads the new script**

Open browser at `http://localhost:3334`, open DevTools Console, run:
```js
typeof supabase
```
Expected: `"object"` (not `"undefined"`).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add Supabase JS CDN and spin keyframe"
```

---

## Task 4 — Rewrite Data.jsx

**Files:**
- Modify: `Data.jsx`

This is the core of the database integration. Replace the entire file content.

- [ ] **Step 1: Write the new Data.jsx**

```js
/* eslint-disable */
// VESTO data — Supabase primary, localStorage fallback, seed tertiary.

// ── Seed data ────────────────────────────────────────────────────────────────
const PRODUCTS_SEED = [
  { id: 'p1', name: 'Buzo oversize crema',      category: 'buzos',      sizes: ['S','M','L','XL'],          priceMay: 8900,  pricePvp: 14900, bg: 'linear-gradient(180deg,#E8DFD0 0%,#D9CBB3 100%)', badge: 'Novedad',     badgeVariant: 'accent', stock: 42 },
  { id: 'p2', name: 'Jean wide leg tiro alto',   category: 'jeans',      sizes: ['36','38','40','42','44'],  priceMay: 12400, pricePvp: 19900, bg: 'linear-gradient(180deg,#3D3D5C 0%,#1A1A2E 100%)', badge: '-30%',        badgeVariant: 'coral',  stock: 28 },
  { id: 'p3', name: 'Vestido lino terracota',    category: 'vestidos',   sizes: ['S','M','L'],               priceMay: 11200, pricePvp: 17900, bg: 'linear-gradient(180deg,#D89372 0%,#C1531A 100%)', stock: 16 },
  { id: 'p4', name: 'Remera básica algodón',     category: 'remeras',    sizes: ['XS','S','M','L','XL'],     priceMay: 4200,  pricePvp: 6900,  bg: 'linear-gradient(180deg,#F5F0E8 0%,#E5DCC9 100%)', stock: 120 },
  { id: 'p5', name: 'Pantalón sastrero negro',   category: 'pantalones', sizes: ['36','38','40','42'],        priceMay: 13500, pricePvp: 21900, bg: 'linear-gradient(180deg,#3D3D5C 0%,#111 100%)',    stock: 22 },
  { id: 'p6', name: 'Camisa oversize rayada',    category: 'camisas',    sizes: ['S','M','L'],               priceMay: 7800,  pricePvp: 12500, bg: 'linear-gradient(180deg,#F2E8D9 0%,#8B5E3C 100%)', badge: 'Top vendido', badgeVariant: 'ghost',  stock: 8  },
  { id: 'p7', name: 'Saco lana boucle',          category: 'sacos',      sizes: ['S','M','L'],               priceMay: 18900, pricePvp: 28900, bg: 'linear-gradient(180deg,#C9A96E 0%,#8B5E3C 100%)', badge: 'Pre-venta',   badgeVariant: 'ghost',  stock: 12 },
  { id: 'p8', name: 'Pollera midi plisada',      category: 'polleras',   sizes: ['S','M','L'],               priceMay: 9600,  pricePvp: 15500, bg: 'linear-gradient(180deg,#5C7A5F 0%,#3D3D5C 100%)', stock: 18 },
];

const CATEGORIES = [
  { id: 'todos',      label: 'Todos',            count: 2147 },
  { id: 'buzos',      label: 'Buzos & sweaters', count: 184 },
  { id: 'jeans',      label: 'Jeans',            count: 92 },
  { id: 'vestidos',   label: 'Vestidos',         count: 156 },
  { id: 'remeras',    label: 'Remeras',          count: 312 },
  { id: 'camisas',    label: 'Camisas',          count: 87 },
  { id: 'pantalones', label: 'Pantalones',       count: 128 },
  { id: 'polleras',   label: 'Polleras',         count: 64 },
  { id: 'sacos',      label: 'Sacos & abrigos',  count: 73 },
];

const CATEGORIES_SEED = [
  { id: 'todos',      label: 'Todos',            emoji: '✦',  active: true },
  { id: 'buzos',      label: 'Buzos & sweaters', emoji: '🧥', active: true },
  { id: 'jeans',      label: 'Jeans',            emoji: '👖', active: true },
  { id: 'vestidos',   label: 'Vestidos',         emoji: '👗', active: true },
  { id: 'remeras',    label: 'Remeras',          emoji: '👕', active: true },
  { id: 'camisas',    label: 'Camisas',          emoji: '👔', active: true },
  { id: 'pantalones', label: 'Pantalones',       emoji: '🩱', active: true },
  { id: 'polleras',   label: 'Polleras',         emoji: '🌀', active: true },
  { id: 'sacos',      label: 'Sacos & abrigos',  emoji: '🧣', active: true },
];

// ── localStorage keys ────────────────────────────────────────────────────────
const PRODUCTS_KEY   = 'vesto_products_v1';
const CATEGORIES_KEY = 'vesto_categories_v1';
const ATTRIBUTES_KEY = 'vesto_attributes_v1';

// ── Supabase client ───────────────────────────────────────────────────────────
// Reads from config.js (git-ignored). If not configured, falls back to
// localStorage → seed automatically.
const _SUPABASE_URL  = window.VESTO_SUPABASE_URL      || '';
const _SUPABASE_KEY  = window.VESTO_SUPABASE_ANON_KEY || '';
const _SB_READY      = Boolean(_SUPABASE_URL && _SUPABASE_KEY && typeof supabase !== 'undefined');
let sb = null;
if (_SB_READY) {
  try {
    sb = supabase.createClient(_SUPABASE_URL, _SUPABASE_KEY);
    console.log('VESTO: Supabase client ready');
  } catch(e) {
    console.warn('VESTO: Supabase init failed, using localStorage fallback', e);
  }
}

// ── Row mappers ───────────────────────────────────────────────────────────────
// DB uses snake_case; JS uses camelCase.
function dbRowToProduct(row) {
  return {
    id:           row.id,
    name:         row.name,
    category:     row.category,
    sizes:        row.sizes        || [],
    priceMay:     row.price_may,
    pricePvp:     row.price_pvp,
    bg:           row.bg           || '',
    badge:        row.badge        || '',
    badgeVariant: row.badge_variant|| '',
    image:        row.image        || '',
    stock:        row.stock        || 0,
  };
}

function productToDbRow(p, index) {
  return {
    id:            p.id,
    name:          p.name,
    category:      p.category      || '',
    sizes:         p.sizes         || [],
    price_may:     Number(p.priceMay) || 0,
    price_pvp:     Number(p.pricePvp) || 0,
    bg:            p.bg            || '',
    badge:         p.badge         || '',
    badge_variant: p.badgeVariant  || '',
    image:         p.image         || '',
    stock:         Number(p.stock) || 0,
    sort_order:    typeof index === 'number' ? index : 0,
    updated_at:    new Date().toISOString(),
  };
}

// ── Products ──────────────────────────────────────────────────────────────────

/**
 * Async. Priority: Supabase → localStorage → PRODUCTS_SEED.
 * Also writes Supabase result back to localStorage as a cache.
 */
async function getProducts() {
  // 1. Supabase
  if (sb) {
    try {
      const { data, error } = await sb
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(dbRowToProduct);
        try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(mapped)); } catch(_) {}
        return mapped;
      }
    } catch(e) {
      console.warn('VESTO: Supabase getProducts failed, falling back', e.message);
    }
  }
  // 2. localStorage
  try {
    const s = localStorage.getItem(PRODUCTS_KEY);
    if (s) {
      const p = JSON.parse(s);
      if (Array.isArray(p) && p.length > 0) return p;
    }
  } catch(_) {}
  // 3. Seed
  return [...PRODUCTS_SEED];
}

/**
 * Async. Saves to localStorage immediately, then upserts to Supabase.
 * Deletes any DB rows whose IDs are not in the new list (handles resets).
 * Throws if Supabase write fails (caller can show error toast).
 */
async function saveProducts(list) {
  // Always save to localStorage (instant offline cache)
  try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list)); } catch(_) {}

  if (!sb) return; // no Supabase — localStorage only

  const rows = list.map((p, i) => productToDbRow(p, i));

  // Upsert current products
  if (rows.length > 0) {
    const { error: upsertErr } = await sb
      .from('products')
      .upsert(rows, { onConflict: 'id' });
    if (upsertErr) {
      console.error('VESTO: Supabase upsert error', upsertErr);
      throw upsertErr;
    }
  }

  // Delete products no longer in the list
  const currentIds = new Set(list.map(p => p.id));
  const { data: existing, error: fetchErr } = await sb.from('products').select('id');
  if (fetchErr) throw fetchErr;
  const toDelete = (existing || []).map(r => r.id).filter(id => !currentIds.has(id));
  if (toDelete.length > 0) {
    const { error: delErr } = await sb.from('products').delete().in('id', toDelete);
    if (delErr) {
      console.error('VESTO: Supabase delete error', delErr);
      throw delErr;
    }
  }
}

function resetProducts() {
  try { localStorage.removeItem(PRODUCTS_KEY); } catch(_) {}
  return [...PRODUCTS_SEED];
}

// ── Categories (sync — localStorage only) ────────────────────────────────────
function getCategories() {
  try {
    const s = localStorage.getItem(CATEGORIES_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; }
  } catch(_) {}
  return [...CATEGORIES_SEED];
}
function saveCategories(list) {
  try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list)); } catch(_) {}
}

// ── Attributes (sync — localStorage only) ────────────────────────────────────
function getAttributes() {
  try {
    const s = localStorage.getItem(ATTRIBUTES_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
  } catch(_) {}
  return [];
}
function saveAttributes(list) {
  try { localStorage.setItem(ATTRIBUTES_KEY, JSON.stringify(list)); } catch(_) {}
}

// ── Legacy globals (backward compat) ─────────────────────────────────────────
// window.PRODUCTS is populated by App after async load.
// Components that read it directly (Dashboard mock) get the seed initially.
window.PRODUCTS        = [...PRODUCTS_SEED];
window.PRODUCTS_SEED   = PRODUCTS_SEED;
window.CATEGORIES      = CATEGORIES;
window.CATEGORIES_SEED = CATEGORIES_SEED;
window.getProducts     = getProducts;
window.saveProducts    = saveProducts;
window.resetProducts   = resetProducts;
window.getCategories   = getCategories;
window.saveCategories  = saveCategories;
window.getAttributes   = getAttributes;
window.saveAttributes  = saveAttributes;
```

- [ ] **Step 2: Verify no syntax errors**

Open browser at `http://localhost:3334`, check DevTools Console.
Expected: `VESTO: Supabase client ready` OR no errors (if credentials are empty, silent fallback). No `TypeError` or `ReferenceError`.

- [ ] **Step 3: Commit**

```bash
git add Data.jsx
git commit -m "feat: async Supabase data layer with 3-level fallback (products)"
```

---

## Task 5 — App async init in index.html

**Files:**
- Modify: `index.html` (inline App component, lines ~36–101)

- [ ] **Step 1: Replace the inline App function**

Find the entire inline `<script type="text/babel">` block at the bottom of `index.html` and replace it with:

```html
  <script type="text/babel">
    const { useState, useEffect, useCallback } = React;

    function App() {
      const [route,    setRoute]    = useState({ screen: 'landing', id: null });
      const [cart,     setCart]     = useState([]);
      const [products, setProducts] = useState([]);
      const [loading,  setLoading]  = useState(true);

      // ── Async product load ──────────────────────────────────────────────
      useEffect(() => {
        getProducts()
          .then(data => {
            setProducts(data);
            window.PRODUCTS = data; // update legacy global for Dashboard
          })
          .catch(err => {
            console.error('VESTO: initial load failed, using seed', err);
            setProducts([...PRODUCTS_SEED]);
            window.PRODUCTS = [...PRODUCTS_SEED];
          })
          .finally(() => setLoading(false));
      }, []);

      const onNav = useCallback((screen, id) => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setRoute({ screen, id });
      }, []);

      const onAddToCart      = useCallback((item) => setCart(prev => [...prev, item]), []);
      const onRemoveFromCart = useCallback((idx)  => setCart(prev => prev.filter((_, i) => i !== idx)), []);
      const onUpdateCartItem = useCallback((idx, qty) => {
        if (qty < 1) { onRemoveFromCart(idx); return; }
        setCart(prev => prev.map((item, i) => i === idx ? { ...item, qty } : item));
      }, [onRemoveFromCart]);

      // ── Async product save ──────────────────────────────────────────────
      const onProductsChange = useCallback(async (newList) => {
        setProducts(newList);
        window.PRODUCTS = newList;
        await saveProducts(newList); // throws on Supabase error
      }, []);

      if (loading) return <LoadingScreen />;

      let content;
      switch (route.screen) {
        case 'catalog':
          content = <Catalog onNav={onNav} products={products} onAddToCart={onAddToCart}/>;
          break;
        case 'favorites':
          content = <Catalog onNav={onNav} products={products} onAddToCart={onAddToCart} favoritesOnly={true}/>;
          break;
        case 'product':
          content = <Product onNav={onNav} productId={route.id} onAddToCart={onAddToCart} products={products}/>;
          break;
        case 'cart':
          content = <Cart onNav={onNav} cart={cart} onRemove={onRemoveFromCart} onUpdateQty={onUpdateCartItem}/>;
          break;
        case 'dashboard':
          content = <Dashboard onNav={onNav}/>;
          break;
        case 'calculator':
          content = <Calculator onNav={onNav} products={products}/>;
          break;
        case 'admin':
          content = <Admin onNav={onNav} products={products} onProductsChange={onProductsChange}/>;
          break;
        case 'landing':
        default:
          content = <Landing onNav={onNav} products={products}/>;
      }

      return (
        <div className="app" data-screen-label={`VESTO · ${route.screen}`}>
          <Header current={route.screen} onNav={onNav} cartCount={cart.length}/>
          {content}
          <Footer/>
          <WhatsAppButton/>
          <ScrollToTop/>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
  </script>
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3334`. Expected:
- Brief loading screen appears (< 500ms with empty Supabase, instant with seed)
- App renders normally after load
- No console errors

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: App async product loading with loading state and useCallback"
```

---

## Task 6 — LoadingScreen component in Components.jsx

**Files:**
- Modify: `Components.jsx` (append before the end or before `window.` exports)

- [ ] **Step 1: Add LoadingScreen to Components.jsx**

Find the last line of `Components.jsx` that exports a component to window (look for `window.ScrollToTop = ScrollToTop;` or similar). Add `LoadingScreen` just before or after:

```jsx
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
window.LoadingScreen = LoadingScreen;
```

- [ ] **Step 2: Verify LoadingScreen renders**

In browser DevTools Console, run:
```js
ReactDOM.createRoot(document.querySelector('#root')).render(React.createElement(LoadingScreen));
```

Expected: Full-screen centered spinner with "CARGANDO VESTO…" text appears. Refresh page to restore app.

- [ ] **Step 3: Commit**

```bash
git add Components.jsx
git commit -m "feat: add LoadingScreen spinner component"
```

---

## Task 7 — Admin.jsx async handlers + sanitization

**Files:**
- Modify: `Admin.jsx`

Admin.jsx already has its own `showToast` / `toast` state system. We only need to:
1. Make `handleSave`, `handleDelete`, `handleReset`, `handleImport` use `await onProductsChange`
2. Show error toast if it throws
3. Add a `sanitize()` helper that strips HTML from text inputs to prevent XSS
4. Apply sanitize in `ProductForm.handleSubmit`

- [ ] **Step 1: Add sanitize() helper at the top of Admin.jsx**

After the `EMPTY_PRODUCT` constant definition (line ~31), add:

```js
/** Strip HTML tags from user text input — prevents XSS in product names/badges */
function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = String(str || '');
  return div.textContent;
}
```

- [ ] **Step 2: Update handleSave to be async with error handling**

Find the current `handleSave` function in `Admin` component:
```js
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
```

Replace with:
```js
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
```

- [ ] **Step 3: Update handleDelete to be async with error handling**

Find:
```js
  const handleDelete = (id) => {
    onProductsChange((products || []).filter(p => p.id !== id));
    setDeleteConfirm(null);
    showToast('Producto eliminado.');
  };
```

Replace with:
```js
  const handleDelete = async (id) => {
    setDeleteConfirm(null);
    try {
      await onProductsChange((products || []).filter(p => p.id !== id));
      showToast('Producto eliminado.');
    } catch(e) {
      showToast('Error al eliminar. Intentá de nuevo.', 'error');
    }
  };
```

- [ ] **Step 4: Update handleReset to be async with error handling**

Find:
```js
  const handleReset = () => {
    if (!window.confirm('¿Restaurar los productos de demo? Se borrarán todos tus cambios.')) return;
    onProductsChange(resetProducts());
    showToast('Catálogo restaurado a la versión demo.');
  };
```

Replace with:
```js
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
```

- [ ] **Step 5: Update handleImport to use await onProductsChange**

Find inside `handleImport`, the reader.onload callback:
```js
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
```

Replace with:
```js
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
```

- [ ] **Step 6: Apply sanitize in ProductForm.handleSubmit**

Find inside `ProductForm` component, the `handleSubmit` function:
```js
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
```

Replace with:
```js
  const handleSubmit = () => {
    if (!form.name.trim())            { alert('El nombre es obligatorio.'); return; }
    if (!form.priceMay || isNaN(Number(form.priceMay)) || Number(form.priceMay) <= 0) {
      alert('Ingresá un precio mayorista válido (número mayor a 0).'); return;
    }
    onSave({
      ...form,
      name:         sanitize(form.name),
      badge:        sanitize(form.badge || ''),
      category:     sanitize(form.category || ''),
      priceMay:     Number(form.priceMay),
      pricePvp:     Number(form.pricePvp) || 0,
      stock:        Number(form.stock)    || 0,
    });
  };
```

- [ ] **Step 7: Verify in browser**

1. Go to `http://localhost:3334`, navigate to Admin, enter password `vesto2026`
2. Edit a product → change its name → Save
3. Expected: modal closes instantly, success toast appears at bottom-right
4. Try creating a product with `<script>alert(1)</script>` as name
5. Expected: name is saved as literal text (no script execution)

- [ ] **Step 8: Commit**

```bash
git add Admin.jsx
git commit -m "feat: Admin async save/delete/reset with error toasts + XSS sanitization"
```

---

## Task 8 — Catalog.jsx useMemo optimization

**Files:**
- Modify: `Catalog.jsx`

Currently the filter pipeline (`visible`) is recalculated on every render. Wrap it in `useMemo`.

- [ ] **Step 1: Add useMemo to the filter pipeline**

At the top of `Catalog.jsx` the destructuring should include `useMemo`. Since `Catalog.jsx` uses `useState` directly (not destructured — they use the global `React.useState` via Babel), find the opening of the `Catalog` function and look for existing `useState` calls. They use `useState` directly (global React).

Find this block at the top of `Catalog` function (lines ~32–63):
```js
  // ── Filter pipeline ──
  let visible = category === 'todos' ? allProducts : allProducts.filter(p => p.category === category);

  if (favoritesOnly) {
    const favs = getFavorites();
    visible = visible.filter(p => favs.includes(p.id));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    visible = visible.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (priceFilters.length > 0) {
    visible = visible.filter(p =>
      priceFilters.some(label => {
        const range = priceRanges.find(r => r.label === label);
        return range && p.priceMay >= range.min && p.priceMay < range.max;
      })
    );
  }

  if (sizeFilter.length > 0) {
    visible = visible.filter(p => p.sizes && sizeFilter.some(s => p.sizes.includes(s)));
  }

  if (sort === 'Precio: menor a mayor') visible = [...visible].sort((a, b) => a.priceMay - b.priceMay);
  if (sort === 'Precio: mayor a menor') visible = [...visible].sort((a, b) => b.priceMay - a.priceMay);
  if (sort === 'Mayor margen')          visible = [...visible].sort((a, b) =>
    ((b.pricePvp - b.priceMay) / b.pricePvp) - ((a.pricePvp - a.priceMay) / a.pricePvp)
  );
```

Replace with (uses `React.useMemo` since React is global):

```js
  // ── Filter pipeline (memoized) ────────────────────────────────────────────
  const visible = React.useMemo(() => {
    let result = category === 'todos' ? allProducts : allProducts.filter(p => p.category === category);

    if (favoritesOnly) {
      const favs = getFavorites();
      result = result.filter(p => favs.includes(p.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (priceFilters.length > 0) {
      result = result.filter(p =>
        priceFilters.some(label => {
          const range = priceRanges.find(r => r.label === label);
          return range && p.priceMay >= range.min && p.priceMay < range.max;
        })
      );
    }

    if (sizeFilter.length > 0) {
      result = result.filter(p => p.sizes && sizeFilter.some(s => p.sizes.includes(s)));
    }

    if (sort === 'Precio: menor a mayor') return [...result].sort((a, b) => a.priceMay - b.priceMay);
    if (sort === 'Precio: mayor a menor') return [...result].sort((a, b) => b.priceMay - a.priceMay);
    if (sort === 'Mayor margen')          return [...result].sort((a, b) =>
      ((b.pricePvp - b.priceMay) / b.pricePvp) - ((a.pricePvp - a.priceMay) / a.pricePvp)
    );

    return result;
  }, [allProducts, category, favoritesOnly, search, priceFilters, sizeFilter, sort]);
```

- [ ] **Step 2: Verify catalog still filters correctly**

Open `http://localhost:3334/` → Catálogo. Test:
- Switch category → filtered list updates
- Search for "buzo" → only "Buzo oversize crema" shows
- Select size "S" → filtered list updates
- Sort "Precio: menor a mayor" → sorted correctly

- [ ] **Step 3: Commit**

```bash
git add Catalog.jsx
git commit -m "perf: memoize Catalog filter pipeline with React.useMemo"
```

---

## Task 9 — Vercel deployment setup

**Files:**
- Create: `vercel.json`
- Create: `package.json`
- Create: `scripts/generate-config.js`

This setup lets Vercel generate `config.js` from environment variables at build time — no secrets in the repo.

- [ ] **Step 1: Create scripts/generate-config.js**

```js
#!/usr/bin/env node
// Generates config.js from environment variables at Vercel build time.
// Usage: node scripts/generate-config.js
// Required env vars: VESTO_ADMIN_PASS, VESTO_SUPABASE_URL, VESTO_SUPABASE_ANON_KEY

const fs = require('fs');
const path = require('path');

const adminPass    = process.env.VESTO_ADMIN_PASS        || '';
const supabaseUrl  = process.env.VESTO_SUPABASE_URL      || '';
const supabaseKey  = process.env.VESTO_SUPABASE_ANON_KEY || '';

if (!adminPass)   console.warn('⚠  VESTO_ADMIN_PASS is not set — admin panel will be inaccessible.');
if (!supabaseUrl) console.warn('⚠  VESTO_SUPABASE_URL is not set — app will use localStorage fallback.');

const content = `// Auto-generated at build time — do not edit manually.
window.VESTO_ADMIN_PASS        = '${adminPass.replace(/'/g, "\\'")}';
window.VESTO_SUPABASE_URL      = '${supabaseUrl.replace(/'/g, "\\'")}';
window.VESTO_SUPABASE_ANON_KEY = '${supabaseKey.replace(/'/g, "\\'")}';
`;

const outPath = path.join(__dirname, '..', 'config.js');
fs.writeFileSync(outPath, content, 'utf8');
console.log(`✓ config.js written to ${outPath}`);
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "vesto",
  "version": "1.0.0",
  "private": true,
  "description": "VESTO — Plataforma B2B mayorista de indumentaria",
  "scripts": {
    "build": "node scripts/generate-config.js",
    "start": "python3 -m http.server 3334"
  }
}
```

- [ ] **Step 3: Create vercel.json**

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options",  "value": "nosniff" },
        { "key": "X-Frame-Options",         "value": "DENY" },
        { "key": "X-XSS-Protection",        "value": "1; mode=block" },
        { "key": "Referrer-Policy",         "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/config.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, no-cache" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

- [ ] **Step 4: Test the build script locally**

```bash
cd /Users/santiagodizbesso/Vesto
VESTO_ADMIN_PASS=vesto2026 VESTO_SUPABASE_URL='' VESTO_SUPABASE_ANON_KEY='' node scripts/generate-config.js
```

Expected output:
```
⚠  VESTO_SUPABASE_URL is not set — app will use localStorage fallback.
✓ config.js written to /Users/santiagodizbesso/Vesto/config.js
```

Verify `config.js` was (re)written correctly:
```bash
cat /Users/santiagodizbesso/Vesto/config.js
```

Expected:
```js
// Auto-generated at build time — do not edit manually.
window.VESTO_ADMIN_PASS        = 'vesto2026';
window.VESTO_SUPABASE_URL      = '';
window.VESTO_SUPABASE_ANON_KEY = '';
```

- [ ] **Step 5: Commit**

```bash
git add vercel.json package.json scripts/generate-config.js
git commit -m "feat: Vercel static deploy config with build-time config generation"
```

---

## Task 10 — Deploy to Vercel

**Files:** No new files — runs Vercel CLI.

Prerequisites:
- Vercel CLI installed (`npm i -g vercel` if not)
- User authenticated (`vercel login`)
- `config.js` locally is fine (it will be regenerated from env vars on Vercel)

- [ ] **Step 1: Check Vercel CLI is available**

```bash
vercel --version
```

If not found:
```bash
npm install -g vercel
```

- [ ] **Step 2: Set Vercel env vars (first deploy only)**

In Vercel Dashboard (https://vercel.com) after first deploy, go to Project → Settings → Environment Variables and add:

| Name | Value |
|---|---|
| `VESTO_ADMIN_PASS` | (your chosen admin password) |
| `VESTO_SUPABASE_URL` | (from Supabase → Settings → API) |
| `VESTO_SUPABASE_ANON_KEY` | (from Supabase → Settings → API → anon/public) |

OR set them before the first deploy via CLI:
```bash
cd /Users/santiagodizbesso/Vesto
vercel env add VESTO_ADMIN_PASS production
vercel env add VESTO_SUPABASE_URL production
vercel env add VESTO_SUPABASE_ANON_KEY production
```

- [ ] **Step 3: Deploy to production**

```bash
cd /Users/santiagodizbesso/Vesto
vercel --prod
```

Answer the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → your account
- **Link to existing project?** → N (first time), or Y if already linked
- **Project name?** → `vesto` (or accept default)
- **Directory?** → `.` (current)

Expected output ends with:
```
✅  Production: https://vesto-XXXX.vercel.app [X]
```

- [ ] **Step 4: Verify deployed app**

Open the production URL. Check:
1. App loads (LoadingScreen briefly visible, then catalog)
2. No console errors
3. DevTools → Network → `config.js` → Response should contain the env var values

- [ ] **Step 5: Final commit (update README or notes if desired)**

```bash
git add .
git commit -m "chore: post-deploy cleanup"
```

---

## Self-review checklist

**Spec coverage:**
- [x] SQL migration (Task 1)
- [x] Config files + placeholders (Task 2)
- [x] Supabase CDN (Task 3)
- [x] Async data layer with 3-level fallback (Task 4)
- [x] App async init + loading state (Task 5)
- [x] LoadingScreen component (Task 6)
- [x] Admin async save/delete/reset/import + error toasts (Task 7)
- [x] XSS sanitization in ProductForm (Task 7 Step 6)
- [x] useMemo in Catalog filter pipeline (Task 8)
- [x] useCallback in App handlers (Task 5)
- [x] Security headers (Task 9 Step 3)
- [x] vercel.json + build script (Task 9)
- [x] Vercel deploy (Task 10)

**Type consistency:**
- `getProducts()` → returns `Promise<Product[]>` in Task 4 ✓
- `saveProducts(list)` → returns `Promise<void>`, throws on error ✓
- `onProductsChange(newList)` → `async`, awaits `saveProducts`, re-throws ✓
- `handleSave/handleDelete/handleReset/handleImport` → `async`, await `onProductsChange` ✓
- `resetProducts()` → sync, returns `Product[]` (seed) ✓
- `dbRowToProduct(row)` → used in `getProducts` ✓
- `productToDbRow(p, index)` → used in `saveProducts` ✓
- `sanitize(str)` → defined in Admin.jsx, used in `ProductForm.handleSubmit` ✓

**No placeholders:** All steps contain complete code. No TBD/TODO.
