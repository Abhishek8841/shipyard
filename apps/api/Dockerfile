FROM node:22

WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./


COPY ./apps/api ./apps/api
COPY ./packages ./packages

RUN npm install 

WORKDIR /app/packages/database

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

WORKDIR /app/packages/redis
RUN npm run build

WORKDIR /app/packages/shared
RUN npm run build

WORKDIR /app/packages/metrics
RUN npm run build

WORKDIR /app/apps/api
RUN npm run build



CMD ["node", "dist/index.js"]
