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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
