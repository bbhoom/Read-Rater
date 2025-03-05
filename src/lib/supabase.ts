import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfqvhqwngtdshsuwgpng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmcXZocXduZ3Rkc2hzdXdncG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNjg3OTQsImV4cCI6MjA1Njc0NDc5NH0.LrFZJSwy38Tz_JwGvZWRiaZp-7_pEIgrn6oLN9sZhGQ';

export const supabase = createClient(supabaseUrl, supabaseKey);