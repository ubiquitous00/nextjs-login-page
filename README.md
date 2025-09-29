## Getting Started

1) Get the local elastic search running on a docker container
    - install it by running the script in your CMD: curl -fsSL https://elastic.co/start-local | sh
    - Elasticsearch db will be running on http://localhost:9200/
    - Kibana will be running on http://localhost:5601/
    - your username and password for logging in will be provided at the end of the script
    - Add all of these variables into your own .env file (generate a new one by copying the .env.example)

    For further instructions, look here: https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart

2) Add an auth key
    - run "openssl rand -base64 32" to generate your own local auth secret. This key is used by the application to encrypt cookies which will secure user sessions
    - Add the auth key generated into your .env file. 

    https://nextjs.org/learn/dashboard-app/adding-authentication

3) Seeding the elasticsearch database
    - run "node elasticsearch.seed.js", which will fill in your local running elasticsearch db with a new index [firstname-lastname-index], and load it with a single user


4) Run the app locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5) Playwright has been installed on this app. To run these tests:
    - run "pnpm exec playwright test"
    - If you want to see it executed in the ui, then use "pnpm exec playwright test --headed"
    

## Codebase Structure

/app: src code
/app/api: Where all the API or external calls should go
/app/lib: where all library code should go. Stores the models and actions for any intermediate transactions between the client and the server calls
/app/ui: All forms or reusable react templates should be going here
/app/*: everything else is a page

/public: where static assets are stored to be served

/tests: All test files are stored here. One E2E testing file + individual unit tests, so that it's easier to manage and check which pages have been covered.