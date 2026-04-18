FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Exposer le port sur lequel l'application Next.js sera accessible
EXPOSE 4100

# Commande pour démarrer l'application
CMD ["npm", "run", "dev"]