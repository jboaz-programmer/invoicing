# Step 1: Build Angular app
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --configuration=production

# Step 2: Serve Angular app with Nginx
FROM nginx:alpine

# Copy Angular build output (browser folder) to Nginx html folder
COPY --from=build /app/dist/accounting_ng/browser /usr/share/nginx/html

# Use custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

