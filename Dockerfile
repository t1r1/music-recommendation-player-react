FROM node:25-bookworm-slim AS builder

RUN mkdir /app
WORKDIR /app

ADD package.json /app/
RUN npm install

ADD app /app/app
ADD context /app/context/
ADD public /app/public/
ADD eslint.config.mjs /app/
ADD next-env.d.ts /app/
ADD next.config.ts /app/
ADD postcss.config.mjs /app/
ADD tailwind.config.ts /app/
ADD tsconfig.json /app/
ADD vitest.config.ts /app/
ADD vitest.setup.ts /app/
RUN npm run build

CMD [ "npm", "run", "start" ]