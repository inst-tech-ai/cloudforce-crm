# Dockerfile
# ステージ1: ビルド環境 (Node.js)
FROM node:22-alpine AS builder

WORKDIR /app

# パッケージインストール
COPY package*.json ./
RUN npm install --only=production

# アプリケーションコードをコピー
COPY . .

# ステージ2: 本番環境
FROM node:22-alpine

WORKDIR /app

# 必要なファイルだけをコピー
COPY --from=builder /app ./

# Cloud Run は 8080 を期待する
ENV PORT=8080

EXPOSE 8080

CMD [ "node", "server.js" ]
