FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_GRAPHQL_URL
ARG VITE_WS_URL

ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]