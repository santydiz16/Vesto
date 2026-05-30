#!/usr/bin/env node
// Generates config.js from environment variables at Vercel build time.
// Usage: node scripts/generate-config.js
// Env vars: VESTO_ADMIN_PASS, VESTO_SUPABASE_URL, VESTO_SUPABASE_ANON_KEY, VESTO_WHATSAPP

const fs   = require('fs');
const path = require('path');

const adminPass    = process.env.VESTO_ADMIN_PASS        || '';
const supabaseUrl  = process.env.VESTO_SUPABASE_URL      || '';
const supabaseKey  = process.env.VESTO_SUPABASE_ANON_KEY || '';
const whatsapp     = process.env.VESTO_WHATSAPP          || '';

if (!adminPass)   console.warn('⚠  VESTO_ADMIN_PASS is not set — admin panel will be inaccessible.');
if (!supabaseUrl) console.warn('⚠  VESTO_SUPABASE_URL is not set — app will use localStorage fallback.');
if (!whatsapp)    console.warn('⚠  VESTO_WHATSAPP is not set — checkout button will be disabled.');

// Escape single quotes to prevent injection
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const content = `// Auto-generated at build time by scripts/generate-config.js — do not edit manually.
window.VESTO_ADMIN_PASS        = '${esc(adminPass)}';
window.VESTO_SUPABASE_URL      = '${esc(supabaseUrl)}';
window.VESTO_SUPABASE_ANON_KEY = '${esc(supabaseKey)}';
window.VESTO_WHATSAPP          = '${esc(whatsapp)}';
`;

const outPath = path.join(__dirname, '..', 'config.js');
fs.writeFileSync(outPath, content, 'utf8');
console.log(`✓ config.js written to ${outPath}`);
