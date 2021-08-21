import * as msal from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
    redirectUri: "/",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// Add here scopes for id token to be used at MS Identity Platform endpoints.
const loginRequest = {
  scopes: ["User.Read", "profile", "openid"],
};

// Add here the endpoints for MS Graph API services you would like to use.
const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft-ppe.com/v1.0/me",
};

// https://graph.microsoft.com/oidc/userinfo
export { msalInstance, loginRequest, graphConfig };
