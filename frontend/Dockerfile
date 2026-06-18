FROM node:20-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:3000
ARG VITE_LOGO_DEV_TOKEN=
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_LOGO_DEV_TOKEN=$VITE_LOGO_DEV_TOKEN

COPY package*.json ./
RUN npm install

COPY . .

RUN echo "[build] VITE_API_URL=$VITE_API_URL" \
 && echo "[build] VITE_LOGO_DEV_TOKEN length=$(printf %s \"$VITE_LOGO_DEV_TOKEN\" | wc -c)" \
 && npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
