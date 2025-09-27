const bcrypt = require("bcrypt");
const { execSync } = require("child_process");
require("dotenv").config();

async function run() {
  const password = "password123!";
  const hash = await bcrypt.hash(password, 10);
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  const ELASTICSEARCH_ENDPOINT = process.env.ELASTICSEARCH_ENDPOINT;
  const userIndex = "tim-xue-index";
  const userId = "testuser";

  if (!ELASTICSEARCH_ENDPOINT) {
    console.error("ELASTICSEARCH_ENDPOINT environment variable is not set.");
    process.exit(1);
  }
  if (!apiKey) {
    console.error("ELASTICSEARCH_API_KEY environment variable is not set.");
    process.exit(1);
  }

  try {
    // Create the index if it doesn't exist
    console.log(`Ensuring index "${userIndex}" exists...`);
    execSync(
      `curl -X PUT "${ELASTICSEARCH_ENDPOINT}/${userIndex}" \
        -H 'Content-Type: application/json' \
        -H 'Authorization: ApiKey ${apiKey}' \
        -d '{}'`,
      { stdio: "inherit" }
    );

    // Insert the test user document
    console.log(`Creating user "${userId}"...`);
    execSync(
      `curl -X PUT "${ELASTICSEARCH_ENDPOINT}/${userIndex}/_doc/${userId}" \
        -H 'Content-Type: application/json' \
        -H 'Authorization: ApiKey ${apiKey}' \
        -d '{"encryptedPassword":"${hash}"}'`,
      { stdio: "inherit" }
    );

    console.log("Elasticsearch seeded with user:");
    console.log("  username:", userId);
    console.log("  password:", password);
  } catch (err) {
    console.error("Error seeding Elasticsearch:", err.message);
  }
}

run();