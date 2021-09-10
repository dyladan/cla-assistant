FROM node:12-alpine

EXPOSE 5000

RUN addgroup -S cla-assistant
RUN adduser -S -D -G cla-assistant cla-assistant

RUN apk --no-cache add curl

COPY . /cla-assistant
WORKDIR /cla-assistant

RUN npm install && npm run build && npm prune --production

USER cla-assistant

CMD ["npm", "start"]
HEALTHCHECK CMD curl -sf http://localhost:5000/healthcheck || exit 1
