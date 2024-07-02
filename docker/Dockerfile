# Use an official Node.js runtime as a parent image
FROM node:20.15.0-alpine

# Set the working directory.
WORKDIR /app

# Copy the package.json file.
COPY package.json .

# Install application dependencies.
RUN npm install

# Copy the rest of the application files.
COPY . .

# Expose the port.
EXPOSE 3000

# Run the application.
CMD [ "npm", "start"]
