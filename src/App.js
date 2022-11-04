import { useEffect, useState } from "react";
import {
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
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
import Tweet from "./Pages/Tweet";

const theme = {};

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    initFirebaseAuth();
  }, []);

  const initFirebaseAuth = () => onAuthStateChanged(auth, authStateObserver);

  const handleLogin = async (e, userObject) => {
    const { id } = e.target;
    //If the Sign in with Google button is clicked, show a google sign-in popup
    if (id === "google-login") {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else if (id === "email-login") {
      //If the login button is clicked, try to authenticate using email and password from the form
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
      likes: [],
      retweets: [],
    });
  };

  const getProfilePic = async () => {
    if (!auth.currentUser.photoURL) {
      await updateProfile(auth.currentUser, {
        photoURL: `https://avatars.dicebear.com/api/identicon/${auth.currentUser.uid}.svg`,
      });
    }
  };

  // Get a user document from firestore
  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", `${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  };

  // Update documents with new counts on firestore

  const updateUserInteractions = (postId, type, newCount, newArray) => {
    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", currentUser.uid);

    switch (type) {
      case "like":
        updateDoc(userRef, { likes: newArray });
        updateDoc(postRef, { likeCount: newCount });
        break;
      case "retweet":
        updateDoc(userRef, { retweets: newArray });
        updateDoc(postRef, { retweetCount: newCount });
        break;
      case "comment":
        updateDoc(postRef, { commentCount: newCount });
        break;
    }
  };

  // Post a tweet, comment, or retweet to firestore

  const postMessage = async (e, message, type, post) => {
    let messageDoc = "";
    switch (type) {
      case "post":
        messageDoc = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          profilePicURL: currentUser.photoURL,
          timestamp: serverTimestamp(),
          message: message,
          likeCount: 0,
          retweetCount: 0,
          commentCount: 0,
          type: "post",
        });
        break;
      case "retweet":
        // Create a new doc for the retweet
        messageDoc = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          type: "retweet",
          timestamp: serverTimestamp(),
          origPostId: post.id,
        });

        // Update retweets in UI
        let newRetweets = [...currentUser.retweets, post.id];
        setCurrentUser({ ...currentUser, retweets: newRetweets });

        // Calculate new retweet count from the original post
        let newRetweetCount;
        await getDoc(doc(db, "posts", post.id)).then((doc) => {
          newRetweetCount = doc.data().retweetCount + 1;
        });

        // Update retweets and retweet count on the server
        updateUserInteractions(
          post.id,
          "retweet",
          newRetweetCount,
          newRetweets
        );
        break;
      case "comment":
        messageDoc = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          profilePicURL: currentUser.photoURL,
          likeCount: 0,
          retweetCount: 0,
          commentCount: 0,
          type: "comment",
          origPostId: post.id,
          origPostUser: post.user,
          origPostDisplayName: post.displayName,
          message: message,
          timestamp: serverTimestamp(),
        });
        // Update comments in UI
        await getDoc(messageDoc).then((doc) => {
          const newComment = { ...doc.data(), id: doc.id };
          setPosts(posts.splice(1, 0, newComment));
        });
        // Calculate new comment count
        let newCommentCount;
        await getDoc(doc(db, "posts", post.id)).then((doc) => {
          newCommentCount = doc.data().commentCount + 1;
        });
        // Update Comments on the server
        updateUserInteractions(post.id, "comment", newCommentCount);
        break;
    }
    return messageDoc;
  };

  const checkLiked = (postId) => {
    if (currentUser && currentUser.likes.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  const checkRetweeted = (postId) => {
    if (currentUser && currentUser.retweets.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  // Get posts for the Home view
  const getHomeFeed = async () => {
    const tweetQuery = query(
      collection(db, "posts"),
      where("type", "==", "post"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const retweetQuery = query(
      collection(db, "posts"),
      where("type", "==", "retweet"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const getTweets = new Promise(async (resolve, reject) => {
      const posts = [];
      const snapshot = await getDocs(tweetQuery);
      snapshot.docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
      resolve(posts);
    });

    const getRetweets = new Promise(async (resolve, reject) => {
      const posts = [];
      const snapshot = await getDocs(retweetQuery);
      snapshot.docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
      resolve(posts);
    });

    const fetchOriginalDoc = (retweet) => {
      return new Promise(async (resolve, reject) => {
        const original = await getDoc(doc(db, "posts", retweet.origPostId));
        resolve(original.data());
      });
    };

    const fetchOriginalDocs = (retweets) => {
      return new Promise(async (resolve, reject) => {
        const posts = [];
        console.log(retweets.length);
        let i = 0;
        while (i < retweets.length) {
          await fetchOriginalDoc(retweets[i]).then((doc) => {
            console.log(doc);
            posts.push({ ...retweets[i], origDoc: doc });
          });
          i++;
        }
        resolve(posts);
      });
    };

    const getUpdatedRetweets = new Promise(async (resolve, reject) => {
      const updated = await getRetweets.then((retweets) =>
        fetchOriginalDocs(retweets)
      );
      resolve(updated);
    });

    const sorted = await Promise.all([getTweets, getUpdatedRetweets]).then(
      ([posts, retweets]) => {
        return [...posts, ...retweets];
      }
    );

    return sorted;
  };

  const getProfilePosts = async (feedType, userId) => {
    const postsRef = collection(db, "posts");
    const repliesRef = collection(db, "replies");
    let q = "";
    let userRef = "";
    let posts = [];
    setPosts([]);
    switch (feedType) {
      case "posts":
        q = query(
          postsRef,
          where("user", "==", `${userId}`),
          where("type", "==", "post"),
          orderBy("timestamp", "desc"),
          limit(10)
        );
        break;
      case "likes":
        userRef = doc(db, "users", userId);
        await getDoc(userRef).then(async (doc) => {
          if (doc.data().likes.length > 0) {
            // Order likes by date liked instead?
            q = query(postsRef, where("__name__", "in", doc.data().likes));
          } else {
            q = "";
          }
        });
        break;
      case "posts-replies":
        userRef = doc(db, "users", userId);
        await getDoc(userRef).then(async (doc) => {
          if (doc.data().retweets.length > 0) {
            q = query(postsRef, where("__name__", "in", doc.data().retweets));
          } else {
            q = "";
          }
        });
    }

    if (q !== "") {
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
    }
    return posts;
  };

  const handleLike = (post) => {
    let newCount, newLikes;
    //Check if the post is already liked
    if (checkLiked(post.id)) {
      //If it is, remove the post from the user doc's 'liked' map
      newLikes = currentUser.likes.filter((item) => item !== post.id);
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      newCount = post.likeCount - 1;
      setPosts(
        posts.map((item) =>
          item.id === post.id ? { ...item, likeCount: newCount } : item
        )
      );
    } else if (currentUser && !checkLiked(post.id)) {
      //Otherwise, add the postId to the user doc's 'liked' map & increase the likes count on the post doc by 1
      newLikes = [...currentUser.likes, post.id];
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      newCount = post.likeCount + 1;
      setPosts(
        posts.map((item) =>
          item.id === post.id ? { ...item, likeCount: newCount } : item
        )
      );
    }
    updateUserInteractions(post.id, "like", newCount, newLikes);
  };

  const authStateObserver = async (user) => {
    if (user) {
      setShowPopup(false);
      await getProfilePic().then(() => {
        checkUserDoc();
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
                  posts={posts}
                  setPosts={setPosts}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleLogin={handleLogin}
                  handleRegister={handleRegister}
                  handleLogout={handleLogout}
                  postMessage={postMessage}
                  getHomeFeed={getHomeFeed}
                  handleLike={handleLike}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
                />
              }
            />
            <Route
              path="/users/:uid"
              element={
                <Profile
                  user={currentUser}
                  posts={posts}
                  setPosts={setPosts}
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
                  getHomeFeed={getHomeFeed}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
                />
              }
            />

            <Route
              path="/posts/:postId"
              element={
                <Tweet
                  user={currentUser}
                  posts={posts}
                  setPosts={setPosts}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleRegister={handleRegister}
                  postMessage={postMessage}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
                  getHomeFeed={getHomeFeed}
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
