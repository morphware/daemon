# This is a Debian 10 (buster) image
FROM node:16.16.0

RUN echo "deb http://deb.pascalroeleven.nl/python3.8 buster-backports main" >> /etc/apt/sources.list
RUN wget https://pascalroeleven.nl/deb-pascalroeleven.gpg && \
    apt-key add deb-pascalroeleven.gpg && \
    apt-get update && apt-get install -y \
      python3.8 \
      python3.8-venv \
      python3.8-dev \
      python3-pip \
    && (cd /usr/bin && ln -sf python3.8 python3) && \
    rm -rf /var/lib/apt/lists/* && apt-get clean

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# This requires build_docker.sh to have copied the requirements.txt file from
# ../resources/share/python/requirements.txt
RUN /usr/bin/python3 /usr/bin/pip3 install -r requirements.txt

EXPOSE 3001

# Use ENTRYPOINT instead of CMD because we want to allow the invoker to
# specify arguments on the "docker run" command. Override this by setting
# --entrypoint.
ENTRYPOINT [ "node", "express.js" ]

# This doesn't work... :(
# How should we pass the parameters to conf/index.js?
#CMD [ "--help" ]
