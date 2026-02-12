# ステージ1: ビルド環境
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ステージ2: 本番環境 (Nginx)
FROM nginx:alpine
# Cloud Runはポート8080を期待するので、Nginxの設定を書き換える
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf
# ビルド成果物をNginxの公開ディレクトリにコピー
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
