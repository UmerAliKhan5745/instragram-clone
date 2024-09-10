# Step 1: Specify the base image with Node.js version 20.17.0
FROM node:20.17.0

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install all dependencies (including dev dependencies)
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Build the TypeScript code (if needed)
RUN npm run build

# Step 7: Expose port 4000
EXPOSE 4000

# Step 8: Start the app using nodemon for development
CMD ["npx", "nodemon", "dist/index.js"]
