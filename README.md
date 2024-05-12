# Barotrauma Server Mod Manager

Barotrauma Server Mod Manager (aka BSMM) allows you to enable and disable mods and other content packages on your Barotrauma server instance. This management is done through a web interface and only allows for enabling and disabling mods, adding new mods or removing the files must be done through the filesystem of the server and currenly cannot be done through this application.

## Application Setup

This application is primarily designed to be ran via a docker container, here is an example `docker-compose.yml` file:

```yaml
---
services:
  bsmm:
    image: barotrauma-server-mod-manager
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - /path/to/barotrauma-server:/barotrauma
```

This will set up the mod manager to be accessible at `http://<your-ip>:3000` and load the Barotrauma files from `/path/to/barotrauma-server`


## Notes
The name Barotrauma and all related names and assets are property of the respective rights holders