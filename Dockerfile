# syntax=docker/dockerfile:1
##
# FashionHub Playwright Test Runner
# Base: official Playwright image (includes all browsers + system deps)
##
FROM mcr.microsoft.com/playwright:v1.51.0-noble

WORKDIR /app

# Copy dependency manifests first for layer-caching
COPY package*.json ./

# Install Node dependencies (no browser install needed — they're in the base image)
RUN npm ci --ignore-scripts

# Copy the rest of the project
COPY . .

# Expose environment variables (can be overridden at runtime)
ENV TEST_ENV=production
ENV BASE_URL=""

# Default: run the full test suite in headless mode
CMD ["npx", "playwright", "test", "--reporter=list"]
