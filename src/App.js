import { useEffect, useState } from "react";
import {
  addDoc,
  getDocs,
  collection,
  serverTimestamp,
  query,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";
import { db, storage, auth } from "./utils/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalStyles from "./components/styled/Global";
import Home from "./Pages/Home";

const theme = {};

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    initFirebaseAuth();
  }, []);

  const initFirebaseAuth = () => onAuthStateChanged(auth, authStateObserver);

  const getProfilePic = () => {
    if (!currentUser.photoURL) {
      updateProfile(auth.currentUser, {
        photoURL: `https://avatars.dicebear.com/api/identicon/${auth.currentUser.uid}.svg`,
      });
    }
    return auth.currentUser.photoURL;
  };

  const getDisplayName = () => {
    return auth.currentUser.displayName;
  };

  const handleLogin = async (e, userObject) => {
    console.log(userObject);
    console.log(e.target);
    const { id } = e.target;
    if (id === "google-login") {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else if (id === "email-login") {
      e.preventDefault();
      try {
        const currentUser = await signInWithEmailAndPassword(
          auth,
          userObject.email,
          userObject.password
        );
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleRegister = async (e, userObject) => {
    e.preventDefault();
    try {
      const currentUser = await createUserWithEmailAndPassword(
        auth,
        userObject.email,
        userObject.password
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  //Post a message from the post input box to the database
  const postMessage = async (e, message) => {
    await addDoc(collection(db, "posts"), {
      user: currentUser.uid,
      displayName: currentUser.displayName,
      profilePicURL: currentUser.photoURL,
      timestamp: serverTimestamp(),
      message: message,
    });
  };

  //Get posts from the database
  const getMessages = async () => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
    return posts;
  };

  const authStateObserver = async (user) => {
    if (user) {
      setShowPopup(false);
      await setCurrentUser({ ...user, photoURL: getProfilePic() });
      console.log(currentUser);
    } else {
      setCurrentUser("");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  user={currentUser}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleLogin={handleLogin}
                  handleRegister={handleRegister}
                  handleLogout={handleLogout}
                  postMessage={postMessage}
                  getMessages={getMessages}
                />
              }
            />
          </Routes>
        </Router>
      </>
    </ThemeProvider>
  );
}

export default App;
