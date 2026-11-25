const { createClient } = require('@supabase/supabase-js');

// ============================================================
// CONFIGURAÇÃO DO SUPABASE
// ============================================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas.'
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;