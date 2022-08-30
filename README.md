### Installation

`yarn install`

#### Prerequisites

1. Serverless plugin
   `npm i -g serverless`
2. MongoDB (docker)
   `docker pull mongo`

### Run Locally

1. Start MongoDB local in docker container:
   `docker run -d --name mongo-ledn -p 80:27017 mongo`

2. Start dserverless offline
   `sls offline`
