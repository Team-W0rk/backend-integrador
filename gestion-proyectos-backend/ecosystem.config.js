module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
  ],
};