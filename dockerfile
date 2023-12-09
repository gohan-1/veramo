FROM node:18.16.0-alpine as base

# Add package file
COPY package*.json ./
COPY yarn.lock ./


# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

COPY . .



# Start production image build
FROM node:18.16.0-alpine

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules




# Expose port 3000
EXPOSE 3002
