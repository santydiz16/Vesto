/* eslint-disable */
// VESTO data — seed + localStorage persistence.

const PRODUCTS_SEED = [
  { id: 'p1',  name: 'Buzo oversize crema',           category: 'buzos',    sizes: ['S','M','L','XL'],          priceMay: 8900,  pricePvp: 14900, bg: 'linear-gradient(180deg,#E8DFD0 0%,#D9CBB3 100%)', badge: 'Novedad', badgeVariant: 'accent', stock: 42 },
  { id: 'p2',  name: 'Jean wide leg tiro alto',       category: 'jeans',    sizes: ['36','38','40','42','44'],  priceMay: 12400, pricePvp: 19900, bg: 'linear-gradient(180deg,#3D3D5C 0%,#1A1A2E 100%)', badge: '-30%', badgeVariant: 'coral', stock: 28 },
  { id: 'p3',  name: 'Vestido lino terracota',        category: 'vestidos', sizes: ['S','M','L'],               priceMay: 11200, pricePvp: 17900, bg: 'linear-gradient(180deg,#D89372 0%,#C1531A 100%)', stock: 16 },
  { id: 'p4',  name: 'Remera básica algodón',         category: 'remeras',  sizes: ['XS','S','M','L','XL'],     priceMay: 4200,  pricePvp: 6900,  bg: 'linear-gradient(180deg,#F5F0E8 0%,#E5DCC9 100%)', stock: 120 },
  { id: 'p5',  name: 'Pantalón sastrero negro',       category: 'pantalones', sizes: ['36','38','40','42'],     priceMay: 13500, pricePvp: 21900, bg: 'linear-gradient(180deg,#3D3D5C 0%,#111 100%)', stock: 22 },
  { id: 'p6',  name: 'Camisa oversize rayada',        category: 'camisas',  sizes: ['S','M','L'],               priceMay: 7800,  pricePvp: 12500, bg: 'linear-gradient(180deg,#F2E8D9 0%,#8B5E3C 100%)', badge: 'Top vendido', badgeVariant: 'ghost', stock: 8 },
  { id: 'p7',  name: 'Saco lana boucle',              category: 'sacos',    sizes: ['S','M','L'],               priceMay: 18900, pricePvp: 28900, bg: 'linear-gradient(180deg,#C9A96E 0%,#8B5E3C 100%)', badge: 'Pre-venta', badgeVariant: 'ghost', stock: 12 },
  { id: 'p8',  name: 'Pollera midi plisada',          category: 'polleras', sizes: ['S','M','L'],               priceMay: 9600,  pricePvp: 15500, bg: 'linear-gradient(180deg,#5C7A5F 0%,#3D3D5C 100%)', stock: 18 },
];

const CATEGORIES = [
  { id: 'todos',      label: 'Todos', count: 2147 },
  { id: 'buzos',      label: 'Buzos & sweaters', count: 184 },
  { id: 'jeans',      label: 'Jeans', count: 92 },
  { id: 'vestidos',   label: 'Vestidos', count: 156 },
  { id: 'remeras',    label: 'Remeras', count: 312 },
  { id: 'camisas',    label: 'Camisas', count: 87 },
  { id: 'pantalones', label: 'Pantalones', count: 128 },
  { id: 'polleras',   label: 'Polleras', count: 64 },
  { id: 'sacos',      label: 'Sacos & abrigos', count: 73 },
];

const PRODUCTS_KEY    = 'vesto_products_v1';
const CATEGORIES_KEY  = 'vesto_categories_v1';
const ATTRIBUTES_KEY  = 'vesto_attributes_v1';

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

function getCategories() {
  try {
    const s = localStorage.getItem(CATEGORIES_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p) && p.length) return p; }
  } catch(e) {}
  return [...CATEGORIES_SEED];
}
function saveCategories(list) {
  try { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(list)); } catch(e) {}
}

function getAttributes() {
  try {
    const s = localStorage.getItem(ATTRIBUTES_KEY);
    if (s) { const p = JSON.parse(s); if (Array.isArray(p)) return p; }
  } catch(e) {}
  return [];
}
function saveAttributes(list) {
  try { localStorage.setItem(ATTRIBUTES_KEY, JSON.stringify(list)); } catch(e) {}
}

function getProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  return [...PRODUCTS_SEED];
}

function saveProducts(list) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  } catch(e) {
    console.error('VESTO: error saving products', e);
  }
}

function resetProducts() {
  try { localStorage.removeItem(PRODUCTS_KEY); } catch(e) {}
  return [...PRODUCTS_SEED];
}

// Legacy global — used by Dashboard (mock). Updated by App via products state.
const PRODUCTS = getProducts();

window.PRODUCTS        = PRODUCTS;
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
