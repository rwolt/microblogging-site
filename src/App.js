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
  const [parentTweet, setParentTweet] = useState({});
  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

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

  //Get a user document from firestore
  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", `${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  };

  //Post a message from the post input box to the database
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
          data: post,
        });

        // Update retweets in UI
        let newRetweets = [...currentUser.retweets, messageDoc.id];
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
        await getDoc(messageDoc).then((doc) =>
          setComments([{ ...doc.data(), id: doc.id }, ...comments])
        );
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

  const handleReply = async (e, post, message) => {
    const { id } = e.currentTarget;
    let postRef = "";
    //If the post is not already retweeted, post a retweet
    if (id === "retweet" && !currentUser.retweets.includes(post.id)) {
      postReply(id, post);
      //If the reply is a comment, post a new comment
    } else if (id === "comment") {
      postReply(id, post, message);
    } else {
      //Otherwise remove the retweet doc and update the local state
      const q = query(
        collection(db, "replies"),
        where("data.id", "==", post.id)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((item) => {
        deleteDoc(doc(db, "replies", item.id));
      });

      //Reduce the retweet count by 1
      if (post.replyType) {
        postRef = doc(db, "replies", post.id);
      } else {
        postRef = doc(db, "posts", post.id);
      }
      await getDoc(postRef).then((doc) => {
        const retweetCount = doc.data().retweetCount;
        const newCount = retweetCount - 1;
        updateDoc(postRef, { retweetCount: newCount });
        if (post.replyType === "comment" && post.type !== "parent") {
          setComments(
            comments.map((item) =>
              item.id === post.id ? { ...item, retweetCount: newCount } : item
            )
          );
        }
        if (post.type === "parent") {
          setParentTweet({ ...parentTweet, retweetCount: newCount });
        } else {
          setPosts(
            posts.map((item) =>
              item.id === post.id ? { ...item, retweetCount: newCount } : item
            )
          );
        }
      });

      // Redundant to do this here for comments (not stored in retweet array, doc already deleted from server)
      const newReplies = currentUser.retweets.filter(
        (post) => post.id !== post.id
      );
      setCurrentUser({
        ...currentUser,
        retweets: newReplies,
      });
      updateDoc(doc(db, "users", currentUser.uid), {
        retweets: newReplies,
      });
    }
  };

  const postReply = async (type, post, message) => {
    //If the reply is a retweet, create a doc with type retweet and reference the original post
    if (type === "retweet") {
      let origDocRef = "";
      if (post.replyType) {
        //If retweeting a reply
        origDocRef = doc(db, "replies", post.id);
      } else {
        //If retweeting a post
        origDocRef = doc(db, "posts", post.id);
      }

      const docRef = await addDoc(collection(db, "replies"), {
        user: currentUser.uid,
        displayName: currentUser.name,
        replyType: "retweet",
        timestamp: serverTimestamp(),
        data: post,
      });
      //Add the id of the tweet to the currentUser state
      const newReplies = [...currentUser.retweets, post.id];
      setCurrentUser({ ...currentUser, retweets: newReplies });
      //Add the id of the reply to the user's replies map
      const userRef = doc(db, "users", currentUser.uid);
      updateDoc(userRef, { retweets: newReplies });
      //Update the retweet count for the reply
      const retweetCount = await getDoc(origDocRef).then(
        (doc) => doc.data().retweetCount
      );
      const newCount = retweetCount + 1;
      updateDoc(origDocRef, { retweetCount: newCount });
      if (post.replyType === "comment" && post.type !== "parent") {
        setComments(
          comments.map((item) =>
            item.id === post.id ? { ...item, retweetCount: newCount } : item
          )
        );
      } else if (post.type === "parent") {
        setParentTweet({ ...parentTweet, retweetCount: newCount });
      } else {
        setPosts(
          posts.map((item) =>
            item.id === post.id ? { ...item, retweetCount: newCount } : item
          )
        );
      }
    } else if (type === "comment") {
      const docRef = await addDoc(collection(db, "replies"), {
        user: currentUser.uid,
        displayName: currentUser.name,
        profilePicURL: currentUser.photoURL,
        likeCount: 0,
        retweetCount: 0,
        commentCount: 0,
        replyType: "comment",
        origPostId: post.id,
        origPostUser: post.user,
        origPostDisplayName: post.displayName,
        message: message,
        timestamp: serverTimestamp(),
      });
      // Add the new comment to the UI
      await getDoc(docRef).then((doc) => {
        setComments([{ ...doc.data(), id: docRef.id }, ...comments]);
      });
    }
  };

  //Get posts from the database
  const getMessages = async () => {
    const postQuery = query(
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

    const messageSnapshot = await getDocs(postQuery);
    const retweetSnapshot = await getDocs(retweetQuery);

    // Combine the two snapshots and sort by timestamp

    let posts = [];

    messageSnapshot.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    retweetSnapshot.forEach((doc) => {
      posts.push({
        ...doc.data(),
        id: doc.id,
      });
    });

    posts = posts.sort((a, b) => {
      return b.timestamp.seconds - a.timestamp.seconds;
    });

    return posts;
  };

  const getComments = async (id) => {
    const q = query(
      collection(db, "posts"),
      where("type", "==", "comment"),
      where("origPostId", "==", id),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({ ...doc.data(), id: doc.id });
    });
    return comments;
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

  const updateUserInteractions = (postId, type, newCount, newArray) => {
    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", currentUser.uid);

    // Update the documents on firestore

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

  const handleLike = (post) => {
    //Check if the post is already liked
    if (checkLiked(post.id)) {
      //If it is, remove the post from the user doc's 'liked' map
      const newLikes = currentUser.likes.filter((item) => item !== post.id);
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      const newCount = post.likeCount - 1;
      if (post.replyType === "comment" && post.type !== "parent") {
        setComments(
          comments.map((item) =>
            item.id === post.id ? { ...item, likeCount: newCount } : item
          )
        );
      } else if (post.type === "parent") {
        setParentTweet({ ...parentTweet, likeCount: newCount });
      } else {
        setPosts(
          posts.map((item) =>
            item.id === post.id ? { ...item, likeCount: newCount } : item
          )
        );
      }
      updateUserInteractions(post, "like", newCount, newLikes);
    } else if (currentUser && !checkLiked(post.id)) {
      //Otherwise, add the postId to the user doc's 'liked' map & increase the likes count on the post doc by 1
      const newLikes = [...currentUser.likes, post.id];
      setCurrentUser({ ...currentUser, likes: newLikes });
      //Update the firestore doc
      const newCount = post.likeCount + 1;
      if (post.replyType === "comment" && post.type !== "parent") {
        setComments(
          comments.map((item) =>
            item.id === post.id ? { ...item, likeCount: newCount } : item
          )
        );
      } else if (post.type === "parent") {
        setParentTweet({ ...parentTweet, likeCount: newCount });
      } else {
        setPosts(
          posts.map((item) =>
            item.id === post.id ? { ...item, likeCount: newCount } : item
          )
        );
      }
      updateUserInteractions(post, "like", newCount, newLikes);
    } else {
      return;
    }
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

    // posts = [];
    if (q !== "") {
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
    }
    setLoadingMessage("");
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
                  getMessages={getMessages}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
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
                  checkRetweeted={checkRetweeted}
                  handleLike={handleLike}
                  handleReply={handleReply}
                  loadingMessage={loadingMessage}
                  setLoadingMessage={setLoadingMessage}
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
                  handleLike={handleLike}
                  handleReply={handleReply}
                  checkLiked={checkLiked}
                  checkRetweeted={checkRetweeted}
                  getComments={getComments}
                  comments={comments}
                  setComments={setComments}
                  parentTweet={parentTweet}
                  setParentTweet={setParentTweet}
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
