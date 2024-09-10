const { OAuth2Client } = require("google-auth-library");
const { GOOGLE } = require("../../config/app");
const { google } = require("googleapis");
const crypto = require("crypto");

const client = new OAuth2Client(
  GOOGLE.CLIENT_ID, 
  GOOGLE.CLIENT_SECRET, 
  "http://localhost:3000/api/v1/auth/callback"
);

const oauth2Client = new google.auth.OAuth2(
  GOOGLE.CLIENT_ID,
  GOOGLE.CLIENT_SECRET,
  "http://localhost:3000/api/v1/auth/callback"
);

const googleVerify = async (code)=> {
  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE.CLIENT_ID
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  
    console.log(payload);
    return payload;
  } catch (error) {
    console.error(error);
  }
};

const googleAuthSignIn = async () => {
  const state = crypto.randomBytes(32).toString('hex');
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
  scope: 'profile email',
  // Enable incremental authorization. Recommended as a best practice.
  include_granted_scopes: true,
  // Include the state parameter to reduce the risk of CSRF attacks.
  state: state
  });
  let response = {
    authUrl: authorizationUrl,
    state
  };
  return response;
}

module.exports={
  googleVerify,
  googleAuthSignIn
};