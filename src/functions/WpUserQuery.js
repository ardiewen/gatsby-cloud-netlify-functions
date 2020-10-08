const fetch = require("node-fetch")
const { v4: uuidv4 } = require("uuid")

async function login() {
  const headers = { "Content-Type": "application/json" }
  const graphql = JSON.stringify({
    query:
      "mutation LOGIN($input: LoginInput!) {\n    login(input: $input) {\n      authToken\n      refreshToken\n      user {\n        id\n        jwtAuthExpiration\n      }\n    }\n  }",
    variables: {
      input: {
        clientMutationId: uuidv4(),
        username: process.env.SERVICE_USER,
        password: process.env.SERVICE_PASSWORD,
      },
    },
  })
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
  }

  return fetch(process.env.GATSBY_GRAPHQL_URL, requestOptions)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.data.login.authToken
    })
}

async function getUser(authToken, username) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  }
  const graphql = JSON.stringify({
    query:
      "query GET_USER($id: ID!) {\n  user(id: $id, idType: EMAIL) {\n    username\n  }\n}",
    variables: { id: username },
  })
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: graphql,
  }

  return fetch(process.env.GATSBY_GRAPHQL_URL, requestOptions).then(response =>
    response.json()
  )
}

module.exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  // Parse the body contents into an object.
  const data = JSON.parse(event.body)
  console.log("Incoming Data: ", data)

  if (!data.username) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing field: username`,
      }),
    }
  }

  try {
    console.log("[INFO] Checking username at: ", process.env.GATSBY_GRAPHQL_URL)
    const authToken = await login()
    console.log(
      authToken
        ? "[INFO] Successfully authenticated as service user"
        : "[ERROR] Was not able to authenticate succesfully"
    )
    const result = await getUser(authToken, data.username)

    const { user } = result.data

    if (user) {
      console.log("[INFO] user successfully retrieved.")
      return {
        statusCode: 200,
        body: JSON.stringify({ username: result.data.user.username }),
      }
    } else {
      console.log("[INFO] No user found.")
      return {
        statusCode: 200,
        body: JSON.stringify({ username: null }),
      }
    }
  } catch (err) {
    console.log(err.message)

    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Error: ${err.message}`,
      }),
    }
  }
}
