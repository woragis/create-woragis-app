const { CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require("crypto");

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-1" 
});

const USER_POOL_ID = process.env.USER_POOL_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const genereteSecretHash = (username) => {
  const message = username + CLIENT_ID;
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(message);
  return hmac.digest('base64');

}

module.exports = { cognitoClient, USER_POOL_ID, CLIENT_ID,CLIENT_SECRET, genereteSecretHash };
