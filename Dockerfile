# Use the LTS version of Node.
FROM node:lts
#Creation of the folder in the container.
WORKDIR /app
#Copy the ./package.json and ./package-lock.json to the current directory.
COPY  ./package.json ./package-lock.json ./
# Run the npm install
RUN npm install
#Copy the rest of the files.
COPY . .
# Expose port 3000.
EXPOSE 3000
# Start the application.
CMD ["npm","start"]