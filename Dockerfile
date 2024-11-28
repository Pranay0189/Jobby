FROM node

WORKDIR /myapp

ADD . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

