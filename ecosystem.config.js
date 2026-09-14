module.exports = {
  apps: [
    {
      name: "uniquesupermart-nextjs",
      cwd: "/var/www/nextapp/uniquesupermart_frontEnd",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOSTNAME: "0.0.0.0",
        PORT: 3000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "4G",
      restart_delay: 3000,
      min_uptime: "10s",
      max_restarts: 30,
      exp_backoff_restart_delay: 100,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};