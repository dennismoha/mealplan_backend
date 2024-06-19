FROM node:22.0

WORKDIR /app

# installing pm2 globally
RUN npm install -g pm2

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["pm2-runtime", "app.js","-i", "4"]

