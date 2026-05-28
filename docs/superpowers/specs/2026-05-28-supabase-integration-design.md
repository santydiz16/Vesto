# Vesto 2.0 — Supabase Integration Design

**Date:** 2026-05-28  
**Status:** Approved  
**Approach:** Async with loading state (Option A)

---

## Overview

Replace localStorage-based data layer with Supabase (PostgreSQL + REST) as the single source of truth. The app becomes multi-device capable, with changes made in Admin visible to all users instantly. A 3-level fallback (Supabase → localStorage → seed) ensures the app never breaks.

---

## Database Schema

### Table: `products`

```sql
CREATE TABLE products (
  id            TEXT         PRIMARY KEY,
  name          TEXT         NOT NULL,
  category      TEXT         NOT NULL,
  sizes         TEXT[]       NOT NULL DEFAULT '{}',
  price_may     INTEGER      NOT NULL,
  price_pvp     INTEGER      NOT NULL,
  bg            TEXT,
  badge         TEXT,
  badge_variant TEXT,
  stock         INTEGER      NOT NULL DEFAULT 0,
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  sort_order    INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

### Table: `categories`

```sql
CREATE TABLE categories (
  id         TEXT        PRIMARY KEY,
  label      TEXT        NOT NULL,
  emoji      TEXT,
  active     BOOLEAN     NOT NULL DEFAULT TRUE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Table: `attributes`

```sql
CREATE TABLE attributes (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  values     TEXT[]      NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## RLS Policies

For demo use: anon key can read and write. Admin password gate is at the UI layer.

```sql
ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
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
```

---

## Architecture Changes

### Files modified

| File | Change |
|------|--------|
| `index.html` | Add Supabase CDN script; change App init to async useEffect |
| `config.js` | Add SUPABASE_URL, SUPABASE_ANON_KEY (placeholders, git-ignored) |
| `config.example.js` | New file — setup instructions, never committed with real keys |
| `Data.jsx` | All functions async, Supabase client, 3-level fallback |
| `supabase/migrations/001_initial.sql` | Schema + seed + RLS |
| `vercel.json` | Static site config, CSP headers |

### Data flow

```
App mounts
  → loading = true, products = []
  → useEffect: await getProducts()
      → try: Supabase SELECT products ORDER BY sort_order
      → catch: try localStorage
      → catch: return PRODUCTS_SEED
  → setProducts(data), loading = false
  → render Catalog/etc with products

Admin saves product
  → await saveProducts(newList)
      → Supabase UPSERT (by id)
      → also write to localStorage (offline cache)
  → setProducts(newList) in App
```

---

## UI Improvements

- `<LoadingScreen>` component — spinner + Vesto logo while initial fetch
- Skeleton cards in Catalog during load
- Toast notification system (success/error) for Admin operations
- Global error boundary with "Reintentar" button
- Smooth CSS entry animations (opacity + translateY)

---

## Security Improvements

- HTML tag stripping on Admin text inputs (prevent XSS)
- Save button disabled while request in flight (prevent double-submit)
- CSP headers in vercel.json
- config.example.js with clear never-commit instructions

---

## Performance Improvements

- `useMemo` for product filtering in Catalog
- `useCallback` for App handlers (onProductsChange, etc.)
- Supabase as distributed cache — localStorage as offline fallback only

---

## Vercel Deployment

Static site, no build step. `vercel.json` configures:
- Output directory: `.` (root of /Vesto)
- CSP and cache headers
- No rewrites needed (single HTML file, client-side routing via React state)

Deploy command: `vercel --prod` from `/Users/santiagodizbesso/Vesto/`

---

## Fallback Behavior

| Supabase configured? | Supabase reachable? | Data source |
|---|---|---|
| Yes | Yes | Supabase ✓ |
| Yes | No | localStorage (stale) |
| No | — | localStorage → seed |

The app is always functional, even without internet or credentials.
