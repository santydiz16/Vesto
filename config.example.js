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
// La seguridad de escritura se garantiza con Row Level Security + VESTO_ADMIN_PASS.
// VESTO_ADMIN_PASS es la contraseña de acceso al panel /admin — cambiala.

window.VESTO_ADMIN_PASS        = 'CAMBIAR_POR_CONTRASEÑA_SEGURA';
window.VESTO_SUPABASE_URL      = 'https://XXXXXXXXXXXX.supabase.co';
window.VESTO_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
