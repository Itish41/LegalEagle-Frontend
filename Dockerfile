# Single Stage (No Build Needed for Dev Mode)
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the .env file (if needed)
COPY .env ./

# Copy the rest of the application files
COPY . .

# Expose port 5173 (Vite’s default dev server port)
EXPOSE 5173

# Command to run the Vite dev server
CMD ["npm", "run", "dev"]