# Go-E Flux Compensator

You can use this if you have multiple Go-E (one per user) but only one utility bill that you want to split among those users. It downloads the measurements through Go-E Cloud API and uploads the data to an Airtable Base for further aggregation.

.env:
```
CHARGERS={ "CHARGER1": "CLOUD_TOKEN_CHARGER1", "CHARGER2": "CLOUD_TOKEN_CHARGER2" }
AIRTABLE_BASE_ID=xxx
AIRTABLE_MEASUREMENTS_TABLE_ID=xxx
AIRTABLE_UTILITY_BILLS_TABLE_ID=xxx
AIRTABLE_ACCESS_TOKEN=***
```

## Airtable Setup

Table "Measurements":
- Date (Date)
- Charger (Text)
- kWH (Number)

Table "Aggregation":
- Abrechnungsdatum (Date)
- Abrechnung von (Date)
- Abrechnung bis (Date)
- Kosten Total (Currency)
- Measurements (Reference Field to Measurements, multi-value)

## Cronjob Example for Docker Swarm

First deploy crazymax/swarm-cronjob Cronjob Orchestrator like this:

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

Then use the example docker-stack.yml to deploy the stack