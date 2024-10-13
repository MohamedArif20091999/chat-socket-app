# Creating multi-stage build for production
FROM node:18-alpine as build

RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install -g node-gyp
RUN npm i --only=production

ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY --chown=node:node . .   

# Build the application
RUN npm run build

# Creating final production image
FROM node:18-alpine
RUN apk add --no-cache vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules

WORKDIR /opt/app
COPY --from=build /opt/app ./

ENV PATH=/opt/node_modules/.bin:$PATH

# Set correct ownership and permissions
RUN chown -R node:node /opt/app
USER node

# Expose the default port
EXPOSE 1337

# Start the application
CMD ["npm", "run", "start"]
