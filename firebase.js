import firebase from "@firebase/app";
import "@firebase/analytics";
import "@firebase/auth";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATA_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESUREMENT_ID,
};

// eslint-disable-next-line import/no-mutable-exports
export let analytics = null;

// Check that `window` is in scope for the analytics module!
if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
  // To enable analytics. https://firebase.google.com/docs/analytics/get-started
  analytics = firebase.analytics();
  if (analytics) {
    window.gtag("js", new Date());
  }
}

export const logEvent = (event, options = {}) => {
  if (analytics) {
    analytics.logEvent(event, options);
    window.gtag("event", event, options);
  }
};

export default firebase;
