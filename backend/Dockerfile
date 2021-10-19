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

# Use ENTRYPOINT instead of CMD because we want to allow the invoker to
# specify arguments on the "docker run" command. Override this by setting
# --entrypoint.
ENTRYPOINT [ "node", "express.js" ]

# This doesn't work... :(
# How should we pass the parameters to conf/index.js?
#CMD [ "--help" ]
