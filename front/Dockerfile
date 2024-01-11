# Sources : 
# - https://nodejs.org/fr/docs/guides/nodejs-docker-webapp
# - https://www.arunyadav.in/codehacks/blogs/post/19/create-an-angular-app-and-deploy-using-in-nginx-and-docker

FROM node:19.5.0-alpine3.17 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Utilisation d'une image légère NGINX pour servir l'application Angular construite
FROM nginx:1.19-alpine
RUN rm -rf /usr/share/nginx/html/*
# Copiage les fichiers de l'application Angular construite depuis l'étape précédente dans le répertoire de travail de NGINX
COPY --from=builder /usr/src/app/dist/delivery_system_front_end /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/nginx.conf
# Commande pour démarrer NGINX lorsque le conteneur démarre
CMD ["nginx", "-g", "daemon off;"]
