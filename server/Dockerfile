FROM nikolaik/python-nodejs:python3.7-nodejs13

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . ./

CMD [ "npm", "start" ]