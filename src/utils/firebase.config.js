const config = {
  apiKey: "AIzaSyDtP7IYj9vtxpzUpcKPma-A0zzJU69uBgw",
  authDomain: "microblogger-f7428.firebaseapp.com",
  projectId: "microblogger-f7428",
  storageBucket: "microblogger-f7428.appspot.com",
  messagingSenderId: "96449475875",
  appId: "1:96449475875:web:5cd7280700d1bc39f8c896",
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw (
      new Error("No firebase configuration object provided." + "\n") +
      "Add your web app's configuration object to firebase.config.js"
    );
  } else {
    return config;
  }
}
