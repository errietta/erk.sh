module.exports = {
    apps: [{
      name: 'url-shortener',
      script: 'server/index.js',
      instances: 0,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
      }
    }]
  }
