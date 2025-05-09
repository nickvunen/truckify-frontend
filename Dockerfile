# Use official Node.js LTS image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first for better Docker cache usage
COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY . .

# Install dependencies
RUN yarn install --frozen-lockfile

# Build the React app for production
RUN yarn build

# Use a lightweight web server to serve the build (e.g., serve)
RUN yarn global add serve

# Expose the port that "serve" will run on
EXPOSE 3000

# Start the app using "serve"
CMD ["serve", "-s", "build", "-l", "3000"]
