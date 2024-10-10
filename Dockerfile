
FROM node:18


WORKDIR /app


COPY package*.json ./

# Install dependencies
RUN npm install 

COPY . .

#port 
EXPOSE 3000

#run cmd
CMD [ "npm", "start" ]
