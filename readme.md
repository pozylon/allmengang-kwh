# kWH Updater

.env:
```
CHARGERS={ "CHARGER1": "CLOUD_TOKEN_CHARGER1", "CHARGER2": "CLOUD_TOKEN_CHARGER2" }
AIRTABLE_BASE_ID=appYTggkCoiSlmC36
AIRTABLE_TABLE_ID=tbl7jsyUrCZJZjAza
AIRTABLE_ACCESS_TOKEN=***
```

Airtable:

- Date (Date)
- Charger (Text)
- kWH (Number)


Example for Cronjob Scheduler in Docker Swarm:

```
version: "3.2"

services:
  swarm-cronjob:
    image: crazymax/swarm-cronjob
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    environment:
      - "TZ=Europe/Paris"
      - "LOG_LEVEL=info"
      - "LOG_JSON=true"
    deploy:
      placement:
        constraints:
          - node.role == manager
          - node.platform.arch == x86_64
```

Then docker stack deploy -c docker-stack.yml allmengang-kwh