#Stage-1 Build the application

FROM node:16 as build 

WORKDIR /myapp

COPY package*.json /.

RUN npm install

ADD . .


#Stage-2 Run the Application
FROM node:16-slim AS runtime

WORKDIR /myapp

COPY --from=build /myapp /myapp

EXPOSE 3000 

CMD [ "npm", "start"]
