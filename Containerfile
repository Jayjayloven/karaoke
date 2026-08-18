# 1. Start with a lightweight Node.js base image
FROM docker.io/library/node:20-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only your package files first (optimizes caching)
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your source code (your /core and /modules folders)
COPY . .

# 6. Expose the port your Express app runs on
EXPOSE 3000

# 7. Start the application
CMD ["npm", "start"]