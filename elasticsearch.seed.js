const bcrypt = require("bcrypt");
const { execSync } = require("child_process");
require("dotenv").config();

async function run() {
  const password = "password123";
  const hash = await bcrypt.hash(password, 10);
  const apiKey = process.env.ELASTICSEARCH_API_KEY;

  if (!apiKey) {
    console.error("ELASTICSEARCH_API_KEY environment variable is not set.");
    process.exit(1);
  }

  execSync(`curl -X POST "http://localhost:9200/users/_doc" \
    -H 'Content-Type: application/json' \
    -H 'Authorization: ApiKey ${apiKey}' \
    -d '{"username":"testuser","encryptedPassword":"${hash}"}'`);

  console.log("Elasticsearch seeded with user:");
  console.log("  username: testuser");
  console.log("  password: password123");
}

run();
