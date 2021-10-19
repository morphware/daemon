# This is an Ubuntu image
FROM node:16.9

RUN apt-get update && apt-get install -y \
      python3-venv \
      python3-pip \
      && rm -rf /var/lib/apt/lists/* && apt-get clean

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
CMD [ "node", "express.js" ]
