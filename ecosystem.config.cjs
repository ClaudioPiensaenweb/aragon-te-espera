module.exports = {
  apps: [{
    name: 'aragon-directus',
    script: 'npx',
    args: 'directus start',
    cwd: '/var/www/vhosts/aragonteespera.com/directus',
    env_file: '.env',
    max_restarts: 5,
    restart_delay: 5000
  }]
}
