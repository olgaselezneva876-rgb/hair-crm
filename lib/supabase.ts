import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wmwstneacusrzsrnxnku.supabase.co';
const supabaseAnonKey = 'sb_publishable_RjMsmyz4QZqMfjGqghsZWw_4pUebV1V';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);