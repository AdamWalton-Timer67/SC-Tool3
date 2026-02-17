FROM node:20-bookworm-slim AS app

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=optional

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
