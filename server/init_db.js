const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDB() {
  try {
    // Connect without database first to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    const sqlScript = fs.readFileSync(path.join(__dirname, 'database_schema.sql'), 'utf-8');
    
    console.log('Executing database schema script...');
    await connection.query(sqlScript);
    
    console.log('Database and tables created/seeded successfully!');
    await connection.end();
  } catch (err) {
    console.error('Error executing script:', err);
    process.exit(1);
  }
}

initializeDB();
