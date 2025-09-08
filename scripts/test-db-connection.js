// Simple script to test database connection and schema
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

async function testConnection() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    const client = postgres(connectionString);
    const db = drizzle(client);

    // Test basic connection
    console.log('Testing database connection...');
    const result = await client`SELECT NOW() as current_time`;
    console.log('✅ Database connection successful:', result[0].current_time);

    // Test if tables exist
    console.log('\nChecking if tables exist...');
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('profiles', 'simple_habits', 'impressiveness_habits', 'habit_entries')
      ORDER BY table_name
    `;
    
    console.log('Found tables:', tables.map(t => t.table_name));
    
    if (tables.length === 4) {
      console.log('✅ All required tables exist');
    } else {
      console.log('❌ Missing tables. Expected 4, found', tables.length);
      console.log('You may need to run: npm run db:generate && npm run db:push');
    }

    await client.end();
    console.log('\n✅ Database test completed successfully');
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
