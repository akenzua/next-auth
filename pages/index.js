import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { loginRequest } from "../services/msal";

function SignInButton() {
  const { instance } = useMsal();

  // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider

  return (
    <button onClick={() => instance.loginRedirect(loginRequest)}>
      Sign In
    </button>
  );
}

function SignOutButton() {
  const { instance } = useMsal();

  return <button onClick={() => instance.logoutPopup()}>Sign Out</button>;
}

function WelcomeUser() {
  const { accounts } = useMsal();
  const username = accounts[0].username;

  return <p>Welcome, {username}</p>;
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Azure AD Authentication using MSAL and Next.js</title>
      </Head>

      <AuthenticatedTemplate>
        <p>This will only render if a user is signed-in.</p>
        <WelcomeUser />
        <SignOutButton />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>This will only render if a user is not signed-in.</p>
        <SignInButton />
      </UnauthenticatedTemplate>
    </div>
  );
}
