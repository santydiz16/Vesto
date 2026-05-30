// VESTO — config.example.js
// Copiá este archivo como config.js y completá los valores.
// config.js está en .gitignore y NUNCA se sube al repo.
//
// Pasos para configurar Supabase:
// 1. Creá un proyecto en https://supabase.com (plan gratuito es suficiente)
// 2. En el SQL Editor, ejecutá: supabase/migrations/001_initial.sql
// 3. En el SQL Editor, ejecutá: supabase/migrations/002_storage.sql
// 4. Copiá los valores desde: Settings > API
//    - Project URL   → VESTO_SUPABASE_URL
//    - anon/public   → VESTO_SUPABASE_ANON_KEY
//
// VESTO_WHATSAPP: número de WhatsApp donde llegan los pedidos.
// Formato: código de país + código de área sin 0 + número sin 15
// Ejemplo Argentina Buenos Aires: 5491155443322
//   54 = Argentina, 911 = BA celular, 55443322 = número
//
// VESTO_ADMIN_PASS: contraseña del panel /admin — cambiala.

window.VESTO_ADMIN_PASS        = 'CAMBIAR_POR_CONTRASEÑA_SEGURA';
window.VESTO_SUPABASE_URL      = 'https://XXXXXXXXXXXX.supabase.co';
window.VESTO_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
window.VESTO_WHATSAPP          = '5491155443322';  // ejemplo — reemplazá con tu número
