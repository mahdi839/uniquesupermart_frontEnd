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
        PORT: 3000
      },
      autorestart: true,
      watch: false,
      max_memory_restart: "4G",           // headroom bump  ^`^t safety net, not the fix
      restart_delay: 3000,
      min_uptime: "30s",                  // process must stay up 30s to count as "started"
      max_restarts: 20,                   // allow more retries before PM2 gives up
      exp_backoff_restart_delay: 100,      // backs off delay between rapid crashes instead of hard-stopping
      error_file: "/home/deploy/.pm2/logs/uniquesupermart-nextjs-error.log",
      out_file: "/home/deploy/.pm2/logs/uniquesupermart-nextjs-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};