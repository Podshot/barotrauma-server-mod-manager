FROM node:lts-slim as frontend
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY ./frontend/ .
RUN npm run build

FROM node:lts-slim as backend

RUN mkdir -p /usr/site
WORKDIR /usr/site

COPY ./backend .
RUN npm ci
RUN npm install typescript -g
RUN tsc
RUN cp -r /usr/site/dist/. /usr/site
RUN rm -rf /usr/site/src /usr/site/dist

RUN rm -rf /usr/site/backend
COPY --from=frontend /app/dist/frontend/browser /usr/site/frontend

LABEL org.opencontainers.image.title=barotrauma-server-mod-manager
LABEL org.opencontainers.image.source=https://github.com/Podshot/barotrauma-server-mod-manager
LABEL org.opencontainers.image.authors=podshot@podshot.dev
LABEL org.opencontainers.image.licenses=AGPL-3.0-only 

CMD ["node", "server.js"]
#
