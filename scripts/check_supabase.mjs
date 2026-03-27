import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cuoycqwtzorjbzmyclqo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1b3ljcXd0em9yamJ6bXljbHFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTU1ODYsImV4cCI6MjA5MDEzMTU4Nn0.n-GV5NbHFh4Bzdp0ZIq7AKJDmXslNHgxpi1YR4IdSAk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRow() {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_email', 'testbot@example.com')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching from Supabase:', error);
  } else {
    console.log('--- SUPABASE SAVED ROW ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('--------------------------');
  }
}

checkRow();
