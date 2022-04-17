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
      likes: [],
      replies: [],
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
      likeCount: 0,
      retweetCount: 0,
    });
    return userDoc;
  };

  const handleReply = async (e, post, message) => {
    const { id } = e.currentTarget;
    let postRef = "";
    //If the post is not already retweeted, post a retweet
    if (!currentUser.replies.includes(post.id)) {
      console.log("Not yet Retweeted");
      postReply(id, post);
      //Update the original doc retweet count
    } else {
      console.log("Already retweeted");
      // console.log(post.id);
      //Otherwise remove the retweet doc and update the local state
      const q = query(
        collection(db, "replies"),
        where("origPostId", "==", post.id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((item) => {
        deleteDoc(doc(db, "replies", item.id));
      });

      //Reduce the retweet count by 1
      postRef = doc(db, "posts", post.id);
      await getDoc(postRef).then((doc) => {
        const retweetCount = doc.data().retweetCount;
        console.log(retweetCount);
        const newCount = retweetCount - 1;
        updateDoc(postRef, { retweetCount: newCount });
        setPosts(
          posts.map((item) =>
            item.id == post.id ? { ...item, retweetCount: newCount } : item
          )
        );
      });

      const newReplies = currentUser.replies.filter(
        (post) => post.id !== post.id
      );
      setCurrentUser({
        ...currentUser,
        replies: newReplies,
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        replies: newReplies,
      });
    }
  };

  const postReply = async (type, post, message) => {
    //If the reply is a retweet, create a doc with type retweet and reference the original post
    if (type === "retweet") {
      const origDocRef = doc(db, "posts", post.id);

      const docRef = await addDoc(collection(db, "replies"), {
        user: currentUser.uid,
        displayName: currentUser.name,
        replyType: "retweet",
        origPostId: post.id,
        timestamp: serverTimestamp(),
      });

      //Add the id of the tweet to the currentUser state
      const newReplies = [...currentUser.replies, post.id];
      setCurrentUser({ ...currentUser, replies: newReplies });
      //Add the id of the reply to the user's replies map
      const userRef = doc(db, "users", currentUser.uid);
      updateDoc(userRef, { replies: newReplies });
      //Update the retweet count for the reply
      const retweetCount = await getDoc(origDocRef).then(
        (doc) => doc.data().retweetCount
      );
      const newCount = retweetCount + 1;
      updateDoc(origDocRef, { retweetCount: newCount });
      setPosts(
        posts.map((item) =>
          item.id == post.id ? { ...item, retweetCount: newCount } : item
        )
      );
      //If the reply is a comment, create a doc with type comment and reference the original post with a message
    } else if (type === "reply") {
      const docRef = await addDoc(collection(db, "replies"), {
        user: currentUser.uid,
        replyType: "comment",
        origPostId: post.id,
        origPostUser: post.user,
        origPostDisplayName: post.displayName,
        message: message,
        timestamp: serverTimestamp(),
      });
    }
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
    if (currentUser && currentUser.likes.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  const updateLikes = (post, newLikes, newCount) => {
    const postRef = doc(db, "posts", post.id);
    const userRef = doc(db, "users", currentUser.uid);

    updateDoc(userRef, { likes: newLikes });
    updateDoc(postRef, { likeCount: newCount });
  };

  const handleLike = (post) => {
    //Check if the post is already liked
    if (checkLiked(post.id)) {
      //If it is, remove the post from the user doc's 'liked' map
      const newLikes = currentUser.likes.filter((item) => item !== post.id);
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      const newCount = post.likeCount - 1;
      setPosts(
        posts.map((item) =>
          item.id == post.id ? { ...item, likeCount: newCount } : item
        )
      );
      updateLikes(post, newLikes, newCount);
    } else if (currentUser && !checkLiked(post.id)) {
      //Otherwise, add the postId to the user doc's 'liked' map & increase the likes count on the post doc by 1
      const newLikes = [...currentUser.likes, post.id];
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      const newCount = post.likeCount + 1;
      setPosts(
        posts.map((item) =>
          item.id == post.id ? { ...item, likeCount: newCount } : item
        )
      );
      updateLikes(post, newLikes, newCount);
    } else {
      return;
    }
  };

  const getProfilePosts = async (feedType, userId) => {
    const postsRef = collection(db, "posts");
    const repliesRef = collection(db, "replies");
    let q = "";
    let querySnapshot = "";
    let userRef = "";
    let posts = [];
    switch (feedType) {
      case "posts":
        q = query(
          postsRef,
          where("user", "==", `${userId}`),
          orderBy("timestamp", "desc")
        );
        querySnapshot = await getDocs(q);
        posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ ...doc.data(), id: doc.id });
        });
        break;
      case "likes":
        posts = [];
        let likes = [];
        userRef = doc(db, "users", userId);
        await getDoc(userRef).then(async (doc) => {
          q = query(postsRef, where("__name__", "in", doc.data().likes));
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
          });
        });
        break;
      case "posts-replies":
        posts = [];
        userRef = doc(db, "users", userId);
        await getDoc(userRef).then(async (doc) => {
          q = query(repliesRef, where("data.id", "in", doc.data().replies));
          const snapshot = await getDocs(q);
          snapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
          });
        });
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
                  getMessages={getMessages}
                  checkLiked={checkLiked}
                  handleLike={handleLike}
                  handleReply={handleReply}
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
                  getMessages={getMessages}
                  checkLiked={checkLiked}
                  handleLike={handleLike}
                  handleReply={handleReply}
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
