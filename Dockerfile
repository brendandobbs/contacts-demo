FROM node:8

# Create app directory
WORKDIR /usr/src/cloudnext18

# Bundle app source
COPY . .

RUN npm install
# If you are building your code for production

EXPOSE 8080
CMD [ "npm", "start" ]