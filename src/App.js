import { useState } from "react";
import { db, storage, auth } from "./utils/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
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

  const handleLogin = async (email, password) => {
    try {
      const currentUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRegister = async (email, password, displayName) => {
    try {
      const currentUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((result) => {
        updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      });
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
