import React, { useState } from "react";
import { Button } from "./styled/Button.styled";
import { StyledLoginForm } from "./styled/LoginForm.styled";

const LoginForm = (props) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    props.handleLogin(loginEmail, loginPassword);
    clearForm();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    props.handleRegister(registerEmail, registerPassword, displayName);
    clearForm();
  };

  const clearForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setDisplayName("");
    props.setShowPopup(false);
    props.setShowRegisterForm(false);
  };

  return (
    <StyledLoginForm>
      {props.showRegisterForm ? (
        <>
          <h3>Register User</h3>
          <label htmlFor="display-name">Display Name:</label>
          <input
            name="display-name"
            placeholder="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <label htmlFor="register-email">Email: </label>
          <input
            name="register-email"
            placeholder="Email"
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <label htmlFor="register-password">Password:</label>
          <input
            name="register-password"
            placeholder="Password"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <Button onClick={handleRegister}>Register</Button>
        </>
      ) : (
        <>
          <h3>Sign In</h3>
          <label htmlFor="sign-in-email">Email:</label>
          <input
            name="sign-in-email"
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <label htmlFor="sign-in-password">Password</label>
          <input
            name="sign-in-password"
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <Button onClick={handleLogin}>Login</Button>
          <p>Don't have an account?</p>
          <Button
            onClick={(e) => {
              e.preventDefault();
              props.setShowRegisterForm(true);
            }}
          >
            Register
          </Button>
        </>
      )}
    </StyledLoginForm>
  );
};

export default LoginForm;
