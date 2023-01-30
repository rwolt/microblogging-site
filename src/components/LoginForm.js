import React, { useEffect, useState } from "react";
import { Button } from "./styled/Button.styled";
import { Flex } from "./styled/Flex.styled";
import { StyledLoginForm } from "./styled/LoginForm.styled";
import { GoogleLoginButton } from "./styled/GoogleLoginButton.styled";
import { resizeImage } from "../utils/resizeImage";

const LoginForm = (props) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const clearForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setDisplayName("");
    setUserHandle("");
    setProfilePicture(null);
  };

  useEffect(() => {
    return () => clearForm();
  }, []);

  return (
    // Show login form or registration form
    <StyledLoginForm>
      {props.showRegisterForm ? (
        <>
          <h2>Create your account</h2>
          <label htmlFor="register-profile-picture">
            Choose a Profile Picture
          </label>
          <input
            name="register-profile-picture"
            placeholder="Choose File"
            type="file"
            onChange={(e) => {
              resizeImage(e.target.files[0], 100).then((image) =>
                setProfilePicture(image)
              );
            }}
          />
          <input
            required
            name="register-handle"
            placeholder="Handle"
            type="text"
            value={userHandle}
            onChange={(e) =>
              setUserHandle(
                e.target.value.length == 1 && e.target.value[0] !== "@"
                  ? `@${e.target.value}`
                  : e.target.value
              )
            }
          />
          <input
            required
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
              id="email-login"
              onClick={(e) => {
                const userObject = {
                  email: registerEmail,
                  password: registerPassword,
                  displayName: displayName,
                  userHandle: userHandle,
                  profilePicture: profilePicture,
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
              id="google-login"
              onClick={(e) => {
                const userObject = {
                  email: registerEmail,
                  password: registerPassword,
                  displayName: displayName,
                  userHandle: userHandle,
                  profilePicture: profilePicture,
                };
                props.handleRegister(e, userObject);
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
              //Create an object with login information and pass to the login event handler
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
