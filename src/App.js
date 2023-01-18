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
import { AiFillPropertySafety } from "react-icons/ai";

const theme = {};

function App() {
  const [currentUser, setCurrentUser] = useState();
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    initFirebaseAuth();
  }, []);

  // Call authStateObserver on auth state change
  const initFirebaseAuth = () => onAuthStateChanged(auth, authStateObserver);

  // Login
  const handleLogin = async (e, userObject) => {
    const { id } = e.target;
    // If the Sign in with Google button is clicked, show a google sign-in popup
    if (id === "google-login") {
      e.preventDefault();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } else if (id === "email-login") {
      // If the login button is clicked, try to authenticate using email and password from the form
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

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
  };

  // Register new user
  const handleRegister = async (e, userObject) => {
    e.preventDefault();
    // If a new account is created, the user is signed in automatically
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

  // Create a document in the user collection with the specified uid
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

  // Assign the user a gravatar if no profile pictures is defined
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

  // Check if there is a document in the users collection for the authenticated user
  const checkUserDoc = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentUser(docSnap.data());
      // If there is no document, create a new user doc and set that doc as the current user for the view
    } else {
      createUserDoc(auth.currentUser.uid).then(async () => {
        const userInfo = await getUserInfo(auth.currentUser.uid);
        setCurrentUser(userInfo);
      });
    }
  };

  const handlePost = async (e, type, message, view) => {
    const postRef = await postMessage(e, type, message);
    //Set the new feed
    await getDoc(postRef).then((doc) => {
      const postDoc = { id: doc.id, ...doc.data() };
      addPostToFeed(postDoc, view);
    });
  };

  const handleReply = (e, type, message, post, view) => {};

  const addPostToFeed = (post, view) => {
    const type = post.type;
    const newPosts = posts.slice();
    if ((type === "post" || type === "repost") && view === "/") {
      newPosts.splice(0, 0, post);
      console.log(newPosts);
      setPosts(newPosts);
    } else if (type === "comment" && view === "/posts") {
      setPosts(newPosts.splice(1, 0, post));
    }
  };

  const handleLike = async (post) => {
    let newCount, newLikes;
    //Check if the post is already liked
    if (checkLiked(post.id)) {
      newLikes = currentUser.likes.filter((item) => item !== post.id);
      newCount = post.likeCount - 1;
    } else if (currentUser && !checkLiked(post.id)) {
      // Otherwise, add the postId to the user doc's 'liked' map & increase the likes count on the post doc by 1
      newLikes = [...currentUser.likes, post.id];
      newCount = post.likeCount + 1;
    }
    // Update the firestore doc
    await updateUserInteractions(post.id, "like", newCount, newLikes);

    // Update the count in local state
    setCurrentUser({ ...currentUser, likes: newLikes });
    setPosts(
      posts.map((item) => {
        if (item.id === post.id) {
          return { ...item, likeCount: newCount };
        } else if (item.origPostId === post.id) {
          const updatedDoc = { ...item.origDoc, likeCount: newCount };
          return { ...item, origDoc: { ...updatedDoc } };
        } else {
          return item;
        }
      })
    );
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
  const postMessage = async (e, type, message, post) => {
    let messageDocRef = null;
    switch (type) {
      case "post":
        messageDocRef = await addDoc(collection(db, "posts"), {
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
        // Create a new doc for the retweet, with id of original post
        messageDocRef = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          type: "retweet",
          timestamp: serverTimestamp(),
          origPostId: post.id,
        });
        break;

      case "comment":
        messageDocRef = await addDoc(collection(db, "posts"), {
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
        break;
    }
    return messageDocRef;
  };
  // // Calculate new comment count
  // let newCommentCount;
  // await getDoc(doc(db, "posts", post.id)).then((doc) => {
  //   newCommentCount = doc.data().commentCount + 1;
  // });

  // // Update comments in UI
  // await getDoc(messageDoc).then((doc) => {
  //   const newComment = { ...doc.data(), id: doc.id };
  //   const newPosts = posts.slice();
  //   newPosts.splice(1, 0, newComment);
  //   setPosts(
  //     newPosts.map((item) =>
  //       item.id === post.id
  //         ? { ...item, commentCount: newCommentCount }
  //         : item
  //     )
  //   );
  // });
  //
  //    // Update retweets array in local state
  //     let newRetweets = [...currentUser.retweets, post.id];
  //     let newRetweetCount;
  //     await getDoc(doc(db, "posts", post.id)).then((doc) => {
  //       newRetweetCount = doc.data().retweetCount + 1;
  //     });

  //     setCurrentUser({ ...currentUser, retweets: newRetweets });
  //     setPosts(
  //       posts.map((item) =>
  //         item.id === post.id
  //           ? { ...item, retweetCount: newRetweetCount }
  //           : item
  //       )
  //     );

  //     // Update retweets and retweet count on the server
  //     updateUserInteractions(
  //       post.id,
  //       "retweet",
  //       newRetweetCount,
  //       newRetweets
  //     );
  //     // Update Comments on the server
  //     updateUserInteractions(post.id, "comment", newCommentCount);
  //     break;
  // }

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
        let i = 0;
        while (i < retweets.length) {
          await fetchOriginalDoc(retweets[i]).then((doc) => {
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
                  handlePost={handlePost}
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
                  handleLike={handleLike}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleRegister={handleRegister}
                  postMessage={postMessage}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
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
