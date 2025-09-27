'use server";'

import bcrypt from "bcrypt"

const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY
const userIndex = process.env.USER_INDEX

export async function registerNewUser(newUser: { username: string; plainTextPassword: string}) {
  console.log(newUser)

  const encryptedPassword = await bcrypt.hash(newUser.plainTextPassword, 10);
  
  const response = await fetch(`${elasticsearchEndpoint}/${userIndex}/_create/${newUser.username}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${elasticsearchApiKey}` },
    body: JSON.stringify({
      username: newUser.username,
      encryptedPassword: encryptedPassword,
    })
  });

  const result = await response.json();
  if (response.status == 409) {
    console.log("User already exists");
    return null;
  } else if (response.status == 201) {
    console.log("User created successfully");
    return result;
  } else {
    console.error("Error creating user:", result);
    throw new Error("Error creating user");
  }

}