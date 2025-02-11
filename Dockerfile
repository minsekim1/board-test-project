# Step 1: Use an official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN yarn

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the project (for Next.js, you can also use `next build`)
RUN yarn build

# Step 7: Expose the port that the app will run on (e.g., 3000 for React)
EXPOSE 3000

# Step 8: Run the app
CMD ["yarn", "start"]
