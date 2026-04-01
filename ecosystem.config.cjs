module.exports = {
  apps: [{
    name: 'aragon-directus',
    script: 'npx',
    args: 'directus start',
    cwd: '/var/www/vhosts/aragonteespera.com/directus',
    env: {
      PORT: 8055,
      PUBLIC_URL: 'https://cms.aragonteespera.com',
      DB_CLIENT: 'pg',
      DB_HOST: '127.0.0.1',
      DB_PORT: 5432,
      DB_DATABASE: 'aragon_directus',
      DB_USER: 'aragon_directus',
      DB_PASSWORD: '',
      STORAGE_LOCAL_ROOT: './uploads',
      SECRET: '',
      ADMIN_EMAIL: 'admin@piensaenweb.com',
      ADMIN_PASSWORD: '',
    }
  }]
}
