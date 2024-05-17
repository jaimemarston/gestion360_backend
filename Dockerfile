FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install --force
COPY . ./
EXPOSE 4000
CMD [ "npm", "run", "dev"]
