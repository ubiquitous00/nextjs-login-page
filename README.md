## Getting Started

1) Get the local elastic search running on a docker container
    - install it by running the script in your CMD: curl -fsSL https://elastic.co/start-local | sh
    - Elasticsearch db will be running on http://localhost:9200/
    - Kibana will be running on http://localhost:5601/
    - your username and password for logging in will be provided at the end of the script
    - Add all of these variables into your own .env.local file (generate a new one by copying the .env.example)

    For further instructions, look here: https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart

2) Add an auth key
    - run "openssl rand -base64 32" to generate your own local auth secret. This key is used by the application to encrypt cookies which will secure user sessions
    - Add the auth key generated into your .env.local file. 

    https://nextjs.org/learn/dashboard-app/adding-authentication

3) Seeding the elasticsearch database


3) Run the app locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Codebase Structure

/app: src code
/app/api: Where all the API or external calls should go
/app/lib: where all library code should go. Stores the models and actions, but not repository code
/app/ui
/app/*: everything else is probably a page

/public: where static assets are stored to be served