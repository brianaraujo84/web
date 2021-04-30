FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install --no-optional
RUN npm run lint
RUN npm run coverage

RUN npm run clean
RUN npm run build:prod

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]
