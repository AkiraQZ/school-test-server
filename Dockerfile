FROM node:latest
WORKDIR /school-test-server
COPY package.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm","run", "dev"]