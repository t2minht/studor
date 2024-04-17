const { TextEncoder, TextDecoder } = require("util");

Object.assign(global, { TextDecoder, TextEncoder });

require('whatwg-fetch');

process.env.SENDGRID_API_KEY = 'SG.mockapikey1234567890';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://fasdfdsa.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mockapikey1234567890'