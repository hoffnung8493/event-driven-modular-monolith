module.exports = {
  apps: [
    {
      name: 'app',
      script: './build/index.js',
      // DONT DECREASE the instances count. Once increased, it cannot be decreased with the current architecture
      instances: 3,
      exec_mode: 'cluster_mode',
      log_date_format: 'YYYY-MM-DD HH:mm',
    },
  ],
}
