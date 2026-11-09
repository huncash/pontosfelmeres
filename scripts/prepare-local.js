const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

for (const file of [
  'deploy/docker-entrypoint.sh',
  'deploy/pontosfelmeres.service',
  'deploy/nginx-pontosfelmeres.conf',
  'Dockerfile',
]) {
  const full = path.resolve(file);
  fs.writeFileSync(full, fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n'));
}

if (!fs.existsSync('.env')) {
  const token = crypto.randomBytes(24).toString('base64url');
  const lines = [
    'SITE_NAME=Pontosfelmérés',
    'SITE_URL=http://127.0.0.1:6000',
    'PORT=6000',
    'NODE_ENV=development',
    'TRUST_PROXY=0',
    'DATA_FILE=./data/leads.sqlite',
    'CONTACT_EMAIL=info@pontosfelmeres.hu',
    'CONTACT_PHONE=+36 30 667 2510',
    'SMTP_HOST=',
    'SMTP_PORT=587',
    'SMTP_SECURE=false',
    'SMTP_SEND_CUSTOMER_COPY=true',
    `ADMIN_TOKEN=${token}`,
    'RETENTION_MONTHS=24',
    '',
  ];
  fs.writeFileSync('.env', lines.join('\n'), 'utf8');
  console.log('env-created');
} else {
  console.log('env-kept');
}
