FROM node:12.14.1-alpine as node-builder
LABEL maintainer="Marcelo Fuentes <marceloe.fuentes@gmail.com>"
WORKDIR /app
ENV NODE_ENV=production

COPY ./ui/package.json ./ui/yarn.lock ./
RUN yarn install --production
COPY ./ui .
RUN yarn build


# build the binary
FROM golang:1.14 as go-builder
WORKDIR /build

ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=0

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -a -installsuffix cgo -ldflags="-w -s" -o transmission

# copy results into new image
FROM scratch
COPY --from=go-builder /etc/passwd /etc/passwd
COPY --from=go-builder /build/transmission /transmission
COPY --from=go-builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=node-builder /app/build /public
CMD ["/transmission"]