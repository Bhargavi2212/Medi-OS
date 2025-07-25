import AppDataSource from '../config/ormconfig';

async function runMigration() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('✅ Database connected successfully');
    
    console.log('🔄 Running migrations...');
    await AppDataSource.runMigrations();
    
    console.log('✅ Migrations completed successfully');
    
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 