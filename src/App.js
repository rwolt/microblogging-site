import { useEffect, useState } from "react";
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  query,
  orderBy,
  where,
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
import Profile from "./Pages/Profile";

const theme = {};

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    initFirebaseAuth();
  }, []);

  const initFirebaseAuth = () => onAuthStateChanged(auth, authStateObserver);

  const getProfilePic = async () => {
    if (!auth.currentUser.photoURL) {
      await updateProfile(auth.currentUser, {
        photoURL: `https://avatars.dicebear.com/api/identicon/${auth.currentUser.uid}.svg`,
      });
    }
  };

  const getDisplayName = () => {
    return auth.currentUser.displayName;
  };

  const handleLogin = async (e, userObject) => {
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
      await createUserWithEmailAndPassword(
        auth,
        userObject.email,
        userObject.password
      ).then(() => {
        updateProfile(auth.currentUser, {
          displayName: userObject.displayName,
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  //Check if there is a document in the users collection for the authenticated user
  const checkUserDoc = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentUser(docSnap.data());
      //If there is no document, create a new user doc and set that doc as the current user for the view
    } else {
      createUserDoc(auth.currentUser.uid).then(async () => {
        const userInfo = await getUserInfo(auth.currentUser.uid);
        setCurrentUser(userInfo);
      });
    }
  };

  //Create a document in the user collection with the specified uid
  const createUserDoc = async (uid) => {
    await setDoc(doc(db, "users", `${uid}`), {
      uid: uid,
      name: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      dateJoined: serverTimestamp(),
    });
  };

  //Get a user document from firestore
  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", `${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  };

  //Post a message from the post input box to the database
  const postMessage = async (e, message) => {
    const userDoc = await addDoc(collection(db, "posts"), {
      user: currentUser.uid,
      displayName: currentUser.name,
      profilePicURL: currentUser.photoURL,
      timestamp: serverTimestamp(),
      message: message,
    });
    return userDoc;
  };

  //Get posts from the database
  const getMessages = async () => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return posts;
  };

  const checkLiked = (postId) => {
    if (currentUser) {
      if (currentUser.likes.includes(postId)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const getProfilePosts = async (feedType, userId) => {
    const postsRef = collection(db, "posts");
    let q = "";
    let posts = [];
    switch (feedType) {
      case "posts":
        q = query(postsRef, where("user", "==", `${userId}`));
        const querySnapshot = await getDocs(q);
        posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        break;
      case "likes":
        posts = [];
        let likes = [];
        const userRef = doc(db, "users", userId);
        const user = await getDoc(userRef).then((doc) => {
          return doc.data();
        });
        user.likes.forEach(async (docId) => {
          const docRef = doc(db, "posts", docId);
          await getDoc(docRef).then((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
          });
        });
        break;
    }
    return posts;
  };

  const authStateObserver = async (user) => {
    if (user) {
      setShowPopup(false);
      await getProfilePic().then(() => {
        checkUserDoc().then(() => {});
      });
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
                  checkLiked={checkLiked}
                />
              }
            />
            <Route
              path="/users/:uid"
              element={
                <Profile
                  user={currentUser}
                  getUserInfo={getUserInfo}
                  getProfilePosts={getProfilePosts}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleLogin={handleLogin}
                  handleRegister={handleRegister}
                  handleLogout={handleLogout}
                  postMessage={postMessage}
                  getMessages={getMessages}
                  checkLiked={checkLiked}
                />
              }
            />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </Router>
      </>
    </ThemeProvider>
  );
}

export default App;
