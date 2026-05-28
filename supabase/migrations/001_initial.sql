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
