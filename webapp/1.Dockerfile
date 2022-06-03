FROM node:16 AS builder

ENV NEXT_PUBLIC_MY_POD_NAME ccc

WORKDIR /build
COPY . .
RUN yarn install
RUN yarn build

FROM node:16
WORKDIR /webapp
COPY --from=builder /build .

ENTRYPOINT ["yarn", "start"]

