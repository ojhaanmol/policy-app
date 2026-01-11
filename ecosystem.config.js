module.exports = {
  apps: [
    {
      name: "insuredime-api",
      script: "src/infrastructure/init.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_restarts: 10,

      max_memory_restart: "500M",

      env: {
        NODE_ENV: "development",
        PORT: 30001
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
