FROM node:latest
#working Dir 
WORKDIR /app

#copy package.json files
COPY package*.json ./


#Install Files
RUN npm install 

#Copy Source Files 
COPY . /app

EXPOSE 8000

CMD ["npm", "start"]



#docker build -t <nameofContainer> .
#docker run -it -p 3002:3000 <nameofContainer>