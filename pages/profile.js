import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import { useState, useEffect } from "react";
import { msalInstance } from "../services/msal";

function ProtectedComponent() {
  const { instance, inProgress, accounts } = useMsal();
  const [apiData, setApiData] = useState(null);

  useEffect(async () => {
    if (!apiData && inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: ["user.read", "profile"],
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          //   console.log(accessToken);
          // Call your API with token

          const headers = new Headers();
          const bearer = `Bearer ${accessToken}`;

          headers.append("Authorization", bearer);

          const options = {
            method: "GET",
            headers: headers,
          };

          fetch("https://graph.microsoft.com/oidc/userinfo/", options)
            .then((response) => {
              response.json();
            })
            .then((response) => {
              setApiData(response);
              console.log(response);
            });

          // callApi(accessToken).then((response) => { setApiData(response) });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                // Call your API with token
                callApi(accessToken).then((response) => {
                  setApiData(response);
                });
              })
              .catch(function (error) {
                // Acquire token interactive failure
                console.log(error);
              });
          }
          console.log(error);
        });
    }
  }, [instance, accounts, inProgress, apiData]);

  console.log(apiData);

  return <p>Return your protected content here: {apiData?.email}</p>;
}

function App() {
  return (
    <AuthenticatedTemplate>
      <ProtectedComponent />
    </AuthenticatedTemplate>
  );
}

export default App;
