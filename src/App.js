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
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { ThemeProvider } from "styled-components";
import {
  HashRouter as Router,
  Routes,
  Route,
  matchPath,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import GlobalStyles from "./components/styled/Global";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Post from "./Pages/Post";

const theme = {};
const provider = new GoogleAuthProvider();

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  useEffect(() => {
    initFirebaseAuth();
  }, []);

  const pageTitles = {
    "/": "home",
    "/users/:uid": "profile",
    "/posts/:postId": "post",
  };

  const getPageTitleFromUrl = (pathname) => {
    const currentPageTitle = Object.keys(pageTitles).find((key) => {
      if (matchPath({ path: key, exact: true }, pathname)) {
        return true;
      }

      return false;
    });

    return pageTitles[currentPageTitle];
  };

  // Call authStateObserver on auth state change
  const initFirebaseAuth = () => onAuthStateChanged(auth, authStateObserver);

  const handleLogin = async (e, userObject) => {
    const { id } = e.target;
    console.log(id, userObject);
    // If the Sign in with Google button is clicked, show a google sign-in popup
    if (id === "google-login") {
      e.preventDefault();
      try {
        await signInWithPopup(auth, provider).then(async () => {
          console.log("Signed In");
          console.log("Current User ID: " + auth.currentUser.uid);
          console.log("getting user info");
          const userInfo = await getUserInfo(auth.currentUser.uid);
          console.log("User Info: " + userInfo);
          setCurrentUser(userInfo);
        });
      } catch (err) {
        console.error(err);
      }
    } else if (id === "email-login") {
      // If the login button is clicked, try to authenticate using email and password from the form
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(
          auth,
          userObject.email,
          userObject.password
        ).then(async () => {
          const userInfo = await getUserInfo(auth.currentUser.uid);
          setCurrentUser(userInfo);
        });
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
    const { id } = e.target;
    console.log(id, userObject);
    // If a new account is created, the user is signed in automatically
    if (id === "google-register") {
      signInWithPopup(auth, provider).then(() => {
        if (!userObject.displayName) {
          userObject = {
            ...userObject,
            displayName: auth.currentUser.displayName,
          };
        }
        createUserDoc(
          auth.currentUser.uid,
          userObject,
          auth.currentUser.photoURL
        ).then(async () => {
          const userInfo = await getUserInfo(auth.currentUser.uid);
          setCurrentUser(userInfo);
        });
        // if (userObject.profilePicture) {
        //   handleImageChange("profile", userObject.profilePicture);
        // }
      });
    } else {
      try {
        await createUserWithEmailAndPassword(
          auth,
          userObject.email,
          userObject.password
        )
          .then(async () => {
            if (userObject.profilePicture) {
              const photoRef = ref(
                storage,
                `profile-pictures/${auth.currentUser.uid}.jpg`
              );
              const photoURL = await uploadString(
                photoRef,
                userObject.profilePicture,
                "data_url"
              ).then(() => {
                const url = getDownloadURL(photoRef);
                return url;
              });
              return photoURL;
            } else {
              return `https://avatars.dicebear.com/api/identicon/${auth.currentUser.uid}.svg`;
            }
          })
          .then((url) => {
            console.log(url);
            updateProfile(auth.currentUser, {
              displayName: userObject.displayName,
              photoURL: url,
            });
            return url;
          })
          .then((url) => {
            createUserDoc(auth.currentUser.uid, userObject, url).then(
              async () => {
                const userInfo = await getUserInfo(auth.currentUser.uid);
                setCurrentUser(userInfo);
              }
            );
          });
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const handleImageChange = async (type, image) => {
    let photoRef;
    switch (type) {
      case "profile":
        photoRef = (storage, `profile-pictures/${auth.currentUser.uid}.jpg`);
        break;
      case "header":
        photoRef = ref(storage, `header-images/${uuidv4()}.jpg`);
        break;
      case "post":
        photoRef = ref(storage, `post-images/${uuidv4()}`);
    }

    let url;
    await uploadString(photoRef, image, "data_url").then(async () => {
      url = await getDownloadURL(photoRef);
      const userRef = doc(db, "users", currentUser.uid);

      switch (type) {
        case "header":
          setCurrentUser({ ...currentUser, headerImage: url });
          updateDoc(userRef, {
            headerImage: url,
          });
          break;
        case "profile":
          setCurrentUser({ ...currentUser, photoURL: url });
          updateDoc(userRef, {
            photoURL: url,
          });
          updateProfile(auth.currentUser, {
            photoURL: url,
          });
          break;
      }
    });
    return url;
  };

  // Create a document in the user collection with the specified uid
  const createUserDoc = async (uid, userObject, url) => {
    await setDoc(doc(db, "users", `${uid}`), {
      uid: uid,
      userHandle: userObject.userHandle,
      name: userObject.displayName,
      photoURL: url,
      dateJoined: serverTimestamp(),
      likes: [],
      reposts: [],
      comments: [],
    });
  };

  // Assign the user a gravatar if no profile pictures is defined
  // const getProfilePic = async () => {
  //   if (!auth.currentUser.photoURL) {
  //     await updateProfile(auth.currentUser, {
  //       photoURL: `https://avatars.dicebear.com/api/identicon/${auth.currentUser.uid}.svg`,
  //     });
  //   }
  // };

  // Get a user document from firestore
  const getUserInfo = async (uid) => {
    const userDocRef = doc(db, "users", `${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data();
  };

  // Check if there is a document in the users collection for the authenticated user
  const checkUserDoc = async () => {
    console.log("Checking...");
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentUser(docSnap.data());
    }
  };

  const handlePost = async (e, type, message, pathname, image) => {
    const view = getPageTitleFromUrl(pathname);
    const postRef = await postMessage(e, type, message, null, image);
    //Set the new feed
    const postSnap = await getDoc(postRef);
    const postDoc = { id: postSnap.id, ...postSnap.data() };
    const newPosts = await addPostToFeed(posts, postDoc, view);
    setPosts([...newPosts]);
  };

  const handleReply = async (e, type, message, post, pathname, id) => {
    let newCount = [];
    let newArray = [];
    let newPosts = [...posts];
    let postDoc = [];
    const view = getPageTitleFromUrl(pathname);
    if (type === "repost" && checkReposted(post.id)) {
      [newCount, newArray] = await calculateCountAndReplies(post, type, -1);

      const q = query(
        collection(db, "posts"),
        where("origPostId", "==", post.id),
        where("user", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const ids = [];
      querySnapshot.forEach((doc) => ids.push({ id: doc.id, ...doc.data() }));
      await deleteDoc(doc(db, "posts", ids[0].id));

      await updateUserInteractions(post.id, type, newCount, newArray);
      if (
        (view === "home" && type === "repost") ||
        (view === "post" && type === "comment")
      ) {
        newPosts = removePostsFromFeed(posts, ids[0], view);
      }
    } else if (
      (type === "repost" && !checkReposted(post.id)) ||
      type === "comment"
    ) {
      [newCount, newArray] = await calculateCountAndReplies(post, type, 1);
      const postRef = await postMessage(e, type, message, post);
      const postSnap = await getDoc(postRef);
      postDoc = { id: postSnap.id, ...postSnap.data() };
      await updateUserInteractions(post.id, type, newCount, newArray);
      if (
        (view === "home" && type === "repost") ||
        (view === "post" && type === "comment")
      ) {
        newPosts = await addPostToFeed(posts, postDoc, view);
      }
    }
    updateLocalCountAndReplies(newPosts, post, type, newCount, newArray);
  };

  const addPostToFeed = async (postsBefore, post, view) => {
    const type = post.type;
    // Makes a copy of whichever array is passed
    const newPosts = postsBefore;
    if ((type === "post" || type === "repost") && view === "home") {
      if (type === "repost") {
        await fetchOriginalDoc(post).then((doc) => {
          post = { ...post, origDoc: doc };
        });
      }
      newPosts.splice(0, 0, post);
      return newPosts;
    } else if (type === "comment" && view === "post") {
      setPosts(newPosts.splice(1, 0, post));
      return newPosts;
    }
  };

  const removePostsFromFeed = (postsBefore, post, view) => {
    const type = post.type;
    // Makes a copy of whichever array is passed
    const newPosts = postsBefore;
    if ((type === "post" || type === "repost") && view === "home") {
      if (type === "repost") {
        return newPosts.filter((item) => item.id !== post.id);
      }
    } else if (type === "comment" && view === "post") {
      setPosts(newPosts.splice(1, 0, post));
      return newPosts;
    }
  };

  const postMessage = async (e, type, message, post, image) => {
    let messageDocRef = null;

    switch (type) {
      case "post":
        messageDocRef = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          userHandle: currentUser.userHandle,
          profilePicURL: currentUser.photoURL,
          timestamp: serverTimestamp(),
          message: message,
          likeCount: 0,
          repostCount: 0,
          commentCount: 0,
          type: "post",
        });
        break;

      case "repost":
        // Create a new doc for the retweet, with id of original post
        messageDocRef = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          userHandle: currentUser.userHandle,
          type: "repost",
          timestamp: serverTimestamp(),
          origPostId: post.id,
        });
        break;

      case "comment":
        messageDocRef = await addDoc(collection(db, "posts"), {
          user: currentUser.uid,
          displayName: currentUser.name,
          userHandle: currentUser.userHandle,
          profilePicURL: currentUser.photoURL,
          likeCount: 0,
          repostCount: 0,
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

    if (image) {
      const url = await handleImageChange("post", image);

      await updateDoc(doc(db, "posts", messageDocRef.id), {
        image: url,
      });
    }
    return messageDocRef;
  };

  const calculateCountAndReplies = async (post, type, operation) => {
    let newReplies;
    let newCount;
    switch (type) {
      case "repost":
        if (operation === 1) {
          newReplies = [...currentUser.reposts, post.id];
          newCount = post.repostCount + 1;
        } else if (operation === -1) {
          let copy = currentUser.reposts.slice();
          newReplies = copy.filter((item) => item !== post.id);
          newCount = post.repostCount - 1;
        } else {
          console.error(`Invalid operation ${operation}`);
        }
        break;
      case "comment":
        const q = query(
          collection(db, "posts"),
          where("type", "==", "comment"),
          where("origPostId", "==", post.id),
          where("user", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const ids = [];
        querySnapshot.forEach((doc) => ids.push(doc.id));

        if (operation === 1 && ids.length === 0) {
          newReplies = [...currentUser.comments, post.id];
          newCount = +post.commentCount + 1;
        } else if (operation === 1 && ids.length > 0) {
          newReplies = [...currentUser.comments];
          newCount = +post.commentCount + 1;
        } else if (operation === -1 && ids.length === 1) {
          newReplies = currentUser.comments.filter(
            (item) => item.id !== post.id
          );
          newCount = +post.commentCount - 1;
        } else if (operation === -1 && ids.length > 1) {
          newReplies = [...currentUser.comments];
          newCount = +post.commentCount - 1;
        } else {
          console.error(`Invalid operation ${operation}`);
        }
        break;
      default:
        console.error(`Invalid type ${type}`);
    }
    return [newCount, newReplies];
  };

  const updateLocalCountAndReplies = (
    newPosts,
    post,
    type,
    newCount,
    newReplies
  ) => {
    switch (type) {
      case "repost":
        setCurrentUser({ ...currentUser, reposts: newReplies });
        setPosts(
          newPosts.map((item) =>
            item.id === post.id ? { ...item, repostCount: newCount } : item
          )
        );
        break;
      case "comment":
        setCurrentUser({ ...currentUser, comments: newReplies });
        setPosts(
          newPosts.map((item) =>
            item.id === post.id ? { ...item, commentCount: newCount } : item
          )
        );
        break;
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
  const updateUserInteractions = async (postId, type, newCount, newArray) => {
    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", currentUser.uid);
    switch (type) {
      case "like":
        await updateDoc(userRef, { likes: newArray });
        await updateDoc(postRef, { likeCount: newCount });
        break;
      case "repost":
        await updateDoc(userRef, { reposts: newArray });
        await updateDoc(postRef, { repostCount: newCount });
        break;
      case "comment":
        await updateDoc(userRef, { comments: newArray });
        await updateDoc(postRef, { commentCount: newCount });
        break;
    }
  };

  const checkLiked = (postId) => {
    if (currentUser && currentUser.likes.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  const checkReposted = (postId) => {
    if (currentUser && currentUser.reposts.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  const checkCommented = (postId) => {
    if (currentUser && currentUser.comments.includes(postId)) {
      return true;
    } else {
      return false;
    }
  };

  // Get posts for the Home view
  const getHomeFeed = async () => {
    const postQuery = query(
      collection(db, "posts"),
      where("type", "==", "post"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const repostQuery = query(
      collection(db, "posts"),
      where("type", "==", "repost"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    const getPosts = new Promise(async (resolve, reject) => {
      const posts = [];
      const snapshot = await getDocs(postQuery);
      snapshot.docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
      resolve(posts);
    });

    const getReposts = new Promise(async (resolve, reject) => {
      const posts = [];
      const snapshot = await getDocs(repostQuery);
      snapshot.docs.forEach((doc) => posts.push({ ...doc.data(), id: doc.id }));
      resolve(posts);
    });

    const getUpdatedReposts = new Promise(async (resolve, reject) => {
      const updated = await getReposts.then((reposts) =>
        fetchOriginalDocs(reposts)
      );
      resolve(updated);
    });

    const sorted = await Promise.all([getPosts, getUpdatedReposts]).then(
      ([posts, reposts]) => {
        const feed = [...posts, ...reposts];
        return feed.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      }
    );

    return sorted;
  };

  const fetchOriginalDoc = (repost) => {
    return new Promise(async (resolve, reject) => {
      const original = await getDoc(doc(db, "posts", repost.origPostId));
      resolve({ id: original.id, ...original.data() });
    });
  };

  const fetchOriginalDocs = (docs) => {
    return new Promise(async (resolve, reject) => {
      const updated = [];
      let i = 0;
      while (i < docs.length) {
        if (docs[i].type === "repost") {
          await fetchOriginalDoc(docs[i]).then((doc) => {
            updated.push({ ...docs[i], origDoc: doc });
          });
        } else {
          updated.push(docs[i]);
        }
        i++;
      }
      resolve(updated);
    });
  };

  const getProfilePosts = async (feedType, userId) => {
    const postsRef = collection(db, "posts");
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
          if (doc.data().reposts.length > 0 || doc.data().comments.length > 0) {
            q = query(
              postsRef,
              where("user", "==", doc.data().uid),
              where("type", "in", ["comment", "repost"]),
              orderBy("timestamp", "desc"),
              limit(10)
            );
          } else {
            q = "";
          }
        });
        break;
      case "media":
        userRef = doc(db, "users", userId);
        await getDoc(userRef).then(async (doc) => {
          q = query(
            postsRef,
            where("user", "==", doc.data().uid),
            where("type", "==", "post"),
            orderBy("image"),
            limit(10)
          );
        });
    }
    if (q !== "") {
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        posts.push({ ...doc.data(), id: doc.id });
      });
    }

    const updated = await fetchOriginalDocs(posts);
    return updated.sort((a, b) => a.timestamp.seconds < b.timestamp.seconds);
  };

  const authStateObserver = async (user) => {
    if (user) {
      const userInfo = await getUserInfo(auth.currentUser.uid);
      if (!userInfo) {
        await signOut(auth);
        setShowRegisterForm(true);
      } else {
        setShowPopup(false);
      }
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
                  getHomeFeed={getHomeFeed}
                  handleLike={handleLike}
                  handlePost={handlePost}
                  handleReply={handleReply}
                  checkLiked={checkLiked}
                  checkReposted={checkReposted}
                  checkCommented={checkCommented}
                />
              }
            />
            <Route
              path="/users/:uid"
              element={
                <Profile
                  handleImageChange={handleImageChange}
                  currentUser={currentUser}
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
                  handleReply={handleReply}
                  handleLike={handleLike}
                  checkLiked={checkLiked}
                  checkReposted={checkReposted}
                  checkCommented={checkCommented}
                />
              }
            />

            <Route
              path="/posts/:postId"
              element={
                <Post
                  user={currentUser}
                  posts={posts}
                  setPosts={setPosts}
                  handleLogin={handleLogin}
                  handleLogout={handleLogout}
                  handleLike={handleLike}
                  handleReply={handleReply}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleRegister={handleRegister}
                  checkLiked={checkLiked}
                  checkReposted={checkReposted}
                  checkCommented={checkCommented}
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
