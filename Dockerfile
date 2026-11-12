FROM node:19.9.0-alpine

# Establece la Zona horaria
ENV TZ=America/Mexico_City
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

# Crea el usuario y el grupo "app"
RUN addgroup -S app && adduser -S app -G app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY --chown=app:app . .

EXPOSE 4001

USER app

CMD ["npm", "run", "dev"]