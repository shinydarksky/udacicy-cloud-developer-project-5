const apiId = 'ouxph7pph7';
const region = 'us-east-1';
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/dev`;

export const authConfig = {
  // Auth0 settings
  domain: 'dev-tkib8gnatghhblhe.us.auth0.com',
  clientId: 'k0YdJe6TUIsITjXF8dfDHC6egSgjthtQ',
  callbackUrl: 'http://localhost:3000/callback'
};
