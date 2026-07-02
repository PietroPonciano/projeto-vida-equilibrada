const {
    Pool
} = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || process.env.DJANGO_DATABASE_URL;

if (!DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
}

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false,
});

//  log de conexão
pool.on('connect', () => {
    console.log('PostgreSQL conectado');
});

//  log de erro
pool.on('error', (err) => {
    console.error('❌ Erro no pool PostgreSQL:', err);
});

module.exports = pool;