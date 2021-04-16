import React, { useEffect, useState, useMemo } from "react";
import cookie from "js-cookie";
import get from "lodash/get";
import firebase, { logEvent } from "../firebase";

const FIREBASE_TOKEN = "firebaseToken";
export const UserContext = React.createContext();

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useCountState must be used within a CountProvider");
  }
  return context;
}

const UserProvider = ({ children = null }) => {
  const [userState, setUser] = useState(null);
  const [loginState, setLogin] = useState({ visible: false, source: null });

  useEffect(() => {
    if (loginState.visible) {
      logEvent("login_screen_viewed", {
        source: loginState.source,
      });
    }
  }, [loginState]);
  // Checks that user state has changed and then creates or destroys cookie with Firebase token.
  const onAuthStateChange = () => {
    return firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        cookie.set(FIREBASE_TOKEN, token, { expires: 14 });
        sessionStorage.setItem(FIREBASE_TOKEN, token);
        const { name, email, photoUrl, uid, emailVerified, phoneNumber } = user;
        setUser({
          name,
          email,
          photoUrl,
          uid,
          emailVerified,
          phoneNumber,
        });
        setLogin({ visible: false, nextPage: null });
      } else {
        setUser({ error: "No user Exist" });
        cookie.remove(FIREBASE_TOKEN);
      }
    });
  };

  const onGmailLogin = () => {
    logEvent("login_dialog_google_login_clicked");
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(async () => {
        logEvent("login_dialog_google_login_success");
        // const {
        //   credential: { accessToken }
        // } = result;
        // const { user } = result;
        // const token = await user.getIdToken();
        // cookie.set(tokenName, token, { expires: 14 });
        // const { name, email, photoUrl, uid, emailVerified } = user;
        // console.log({ user });
        // setUser({ name, email, photoUrl, uid, emailVerified });
      })
      .catch((e) => {
        logEvent("login_dialog_google_login_failed", { message: e.message });
        setUser({ error: "Unable to login by Email" });
      });
  };

  const logOut = () => {
    logEvent("logout_clicked");
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        logEvent("logout_success");
      })
      .catch((e) => {
        logEvent("logout_error", { message: e.message });
        setUser({ error: "Unable to Logout" });
        // An error happened.
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange();
    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user: userState,
      setLogin,
      loginState,
      logOut,
      setUser,
      onGmailLogin,
    }),
    [userState, loginState]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider, useUser };
