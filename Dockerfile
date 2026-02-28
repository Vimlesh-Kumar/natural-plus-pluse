# Use a builder image with Node.js and C++ tooling
FROM node:18-bullseye-slim AS build

# Install C++ compiler (clang++) and make
RUN apt-get update && apt-get install -y \
    clang \
    make

WORKDIR /app

# Copy the source code
COPY . .

# Build the Natural++ C++ Virtual Machine
RUN make

# Install dependencies for the web server
WORKDIR /app/web
RUN npm install

# Stage 2: Minimal Runtime Image
FROM node:18-bullseye-slim

WORKDIR /app

# Install simple C++ runtime deps, if any (usually libc/libstdc++ are present)
# Copy the compiled VM and Server from Builder
COPY --from=build /app/bin /app/web/bin
COPY --from=build /app/web /app/web

EXPOSE 3000

ENV PORT=3000

WORKDIR /app/web
CMD ["node", "index.js"]
