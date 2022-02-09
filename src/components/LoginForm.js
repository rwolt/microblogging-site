import React, { useState } from "react";
import { Button } from "./styled/Button.styled";
import { Flex } from "./styled/Flex.styled";
import { StyledLoginForm } from "./styled/LoginForm.styled";
import { GoogleLoginButton } from "./styled/GoogleLoginButton.styled";

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
          <h2>Create your account</h2>
          <input
            name="display-name"
            placeholder="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            name="register-email"
            placeholder="Email"
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          <input
            name="register-password"
            placeholder="Password"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
          <Flex justifyContent="flex-end">
            <Button onClick={handleRegister}>Register</Button>
          </Flex>
          <Flex flexDirection="column">
            <p> or </p>
            <GoogleLoginButton onClick={props.handleGoogleLogin} />
          </Flex>
        </>
      ) : (
        <>
          <h2>Sign In</h2>
          <input
            name="sign-in-email"
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            name="sign-in-password"
            placeholder="Password"
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
          <Flex justifyContent="flex-end">
            <Button onClick={handleLogin}>Login</Button>
          </Flex>
          <Flex flexDirection="column">
            <p> or </p>
            <GoogleLoginButton onClick={props.handleGoogleLogin} />
          </Flex>
        </>
      )}
    </StyledLoginForm>
  );
};

export default LoginForm;
