## Getting Started

1) Get the local elastic search running on a docker container
    - install it by running the script in your CMD: curl -fsSL https://elastic.co/start-local | sh
    - Elasticsearch db will be running on http://localhost:9200/
    - Kibana will be running on http://localhost:5601/
    - your username and password for logging in will be provided at the end of the script
    - Add all of these variables into your own .env file (generate a new one by copying the .env.example)

    For further instructions, look here: https://www.elastic.co/docs/deploy-manage/deploy/self-managed/local-development-installation-quickstart

2) Add an auth key
    - run "openssl rand -base64 32" to generate your own local auth secret.
    - Add the auth key generated into your .env file for "AUTH_SECRET" and "NEXTAUTH_SECRET". 

    https://nextjs.org/learn/dashboard-app/adding-authentication

3) Seeding the elasticsearch database
    - Add your first name and last name into the .env file (e.g. USER_INDEX=tim-xue-index)
    - run "node elasticsearch.seed.js", which will fill in your local running elasticsearch db with a new index [firstname-lastname-index], and load it with a single user. Also will create a [firstname-lastname-index-verification-attempts], which stores all verification attempts globally

4) Fill in the remaining .env values:
    - For AUS_POST_BEARER_TOKEN and AUS_POST_REST_ENDPOINT, use the provided values from the assignment
    - For the NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, you can generate one by logging into the google cloud console for maps, generating a new API key, and pasting it here:

    https://developers.google.com/maps/documentation/javascript/get-api-key


5) Run the app locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

*N.B. If you want all the features to run correctly (specifically calls to elasticsearch running locally), you need to make sure that you start up the elasticsearch DB (have it running in docker)

6) Playwright has been installed on this app. To run these tests:
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