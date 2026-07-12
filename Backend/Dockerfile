FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

EXPOSE 4003

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx server.ts"]