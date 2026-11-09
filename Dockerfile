FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
COPY deploy/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=6000

EXPOSE 6000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
