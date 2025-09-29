'use server";'

import bcrypt from "bcrypt"

const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT
const elasticsearchApiKey = process.env.ELASTICSEARCH_API_KEY
const userIndex = process.env.USER_INDEX
const verificationAttemptID = "verification_attempts"

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

export async function registerVerificationAttempt(
  username: string,
  inputData: { postcode: string, suburb: string, state: string },
  timestamp: Date,
  isVerified: boolean,
  errorMessage: string | null
): Promise<{success: boolean, errorMessage: string | null }> {

  try {
    const countResponse = await fetch(
      `${elasticsearchEndpoint}/${userIndex}-verification-attempts/_count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `ApiKey ${elasticsearchApiKey}`,
        },
      }
    );

    if (!countResponse.ok) {
      throw new Error(`Failed to fetch count: ${await countResponse.text()}`);
    }

    const countData = await countResponse.json();
    const newId = countData.count + 1;

    const response = await fetch(`${elasticsearchEndpoint}/${userIndex}-verification-attempts/_create/${newId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `ApiKey ${elasticsearchApiKey}` },
      body: JSON.stringify({
        username: username,
        inputData: inputData,
        timestamp: timestamp,
        isVerified: isVerified,
        errorMessage: errorMessage,
      })
    });

    const result = await response.json();
    if (response.status == 409) {
      throw new Error("Verification ID already exists");
    } else if (response.status == 201) {
      console.log("Verification Attempt Saved successfully");
      return { success: true, errorMessage: null };
    } else {
      console.log(`Error while trying to save verification attempt: ${result}`)
      throw new Error("Unknown error while");
    }
  } catch (error) {
    console.log(`Error while trying to save verification attempt: ${error}`)
    return { success: false, errorMessage: `Error while trying to save verification attempt` };
  }
}