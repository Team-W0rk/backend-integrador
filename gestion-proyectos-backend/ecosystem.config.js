module.exports = {
  apps: [
    {
      name: 'gestion-proyectos-backend',
      script: 'dist/main.js',
      watch: false,
      max_memory_restart: '500M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DB_HOST: 'localhost',
        DB_PORT: 5432,
        DB_USER: 'postgres',
        DB_PASS: '1234',
        DB_NAME: 'gestion_proyectos',
        JWT_SECRET: 'clave_super_segura_123',
        SEED_SECRET: 'clave_super_segura_123',
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
    },
  ],
};
