import { useState } from "react";
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
  const [user, setUser] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

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
        console.log(user);
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
                  user={user}
                  showPopup={showPopup}
                  setShowPopup={setShowPopup}
                  showRegisterForm={showRegisterForm}
                  setShowRegisterForm={setShowRegisterForm}
                  handleLogin={handleLogin}
                  handleRegister={handleRegister}
                  handleLogout={handleLogout}
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
