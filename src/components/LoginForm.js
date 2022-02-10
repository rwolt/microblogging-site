import React, { useEffect, useState } from "react";
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

  const clearForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setDisplayName("");
  };

  useEffect(() => {
    return () => clearForm();
  }, []);

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
            onChange={(e) => {
              setRegisterPassword(e.target.value);
            }}
          />
          <Flex justifyContent="flex-end">
            <Button
              onClick={(e) => {
                const userObject = {
                  email: registerEmail,
                  password: registerPassword,
                  displayName: displayName,
                };
                props.handleRegister(e, userObject);
              }}
            >
              Register
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <p> or </p>
            <GoogleLoginButton
              onClick={(e) => {
                props.handleLogin(e);
              }}
            />
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
            <Button
              id="email-login"
              onClick={(e) => {
                const userObject = {
                  email: loginEmail,
                  password: loginPassword,
                };
                props.handleLogin(e, userObject);
              }}
            >
              Login
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <p> or </p>
            <GoogleLoginButton
              id="google-login"
              onClick={(e) => {
                props.handleLogin(e);
              }}
            />
          </Flex>
        </>
      )}
    </StyledLoginForm>
  );
};

export default LoginForm;
