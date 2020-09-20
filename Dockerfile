FROM node:12
EXPOSE 80

ADD app /app

CMD ["node", "/app/src/index.js"]
