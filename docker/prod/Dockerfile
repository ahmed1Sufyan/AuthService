FROM node:20-alpine AS builder

WORKDIR /app

COPY  package*.json ./

RUN npm ci 

COPY . .

RUN npm run build


FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts
# --omit=dev == ENV NODE_ENV=production

COPY --from=builder /app/dist ./
# isme hum specific folder se data copy kr rhe h
# jo upr build kia h file usme /app/dist k ander jakr ./ location yani current route me copy krdo

EXPOSE 5500

CMD ["node","src/server.js"]