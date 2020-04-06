# Transmission Client

![](https://img.shields.io/codecov/c/github/mfuentesg/transmission-client/master)
![](https://img.shields.io/github/languages/top/mfuentesg/transmission-client)
![](https://github.com/mfuentesg/transmission-client/workflows/Go/badge.svg?branch=master)
![](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)

This is a modern and fresh transmission client written in typescript, golang and socket.io as communication layer.

## Motivation

### Just a context

I have a raspberry with [balenaOS](https://www.balena.io/os/) installed in it.
I started playing with it, installing some services like [Plex](https://www.plex.tv/) and [Samba](https://www.samba.org/)
to transfer files from my computer to the hard drive connected to the rpi.

I started downloading torrents from internet in my computer and then i would upload those files to my rpi using samba.
Determined to don't deal again with this painful "flow", i installed [transmission](https://transmissionbt.com/) in my rpi
and download directly to my external hard drive. It works perfectly but its interface it's a bit ugly.

Based on this ~brief~ summary, the motivation of this project are:

1. Just for fun
2. Improve my golang skills
3. Offer a modern and fresh transmission client alternative to the community

> If you are enjoying the experience with transmission like me, join to this project and let's improve it together.

## Installation

### Using Docker
```
docker run -d -p 8000:8000 mfuentesg/transmission-client
```

## Development

This repository consists in two parts, server side and ui.

- Client side is built in `typescript` based on `create-react-app` command. (`ui` folder)
- Server side is built in `golang`

## Pending tasks

- [ ] Enable app to be used as desktop app
- [ ] Improve documentation