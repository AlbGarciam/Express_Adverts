FROM node:8
# RUN
RUN npm install pm2 -g
# Create app directory
WORKDIR /usr/src/node/Express_Adverts
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "fillDatabase"]
CMD [ "pm2-runtime", "./bin/cluster.js" ]