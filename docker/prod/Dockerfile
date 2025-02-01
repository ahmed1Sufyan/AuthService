FROM node:22-alpine AS builder

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
# ignore thid party scripts
# ism hum--omit=dev == ENV NODE_ENV=production yeh bhi de sakte same work krega
# production me dev dependencies install nhi krega

COPY --from=builder /app/dist ./
# isme hum specific folder se data copy kr rhe h
# jo upr build kia h file usme /app/dist k ander jakr ./ location yani current route me copy krdo

EXPOSE 5500

CMD ["node","src/server.js"]

# docker run -e POSTGRES_USERNAME=postgres -e POSTGRES_PASSWORD=Smiu123 -p 5432:5432 postgres
