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
  const [formValidation, setFormValidation] = useState({});

  const clearForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setDisplayName("");
    setUserHandle("");
    setProfilePicture(null);
  };

  // useEffect(() => {
  //   return () => clearForm();
  // }, []);

  const validateForm = (e, userObject) => {
    const { id } = e.target;
    console.log(id);
    let error = {};
    switch (id) {
      case "email-register":
        if (!userObject.displayName) {
          error = {
            ...error,
            displayName:
              "Display name is required for email/password registration",
          };
        }

        if (!userObject.userHandle) {
          error = { ...error, handle: "User handle is required" };
        }

      case "email-login":
        if (!userObject.email) {
          error = {
            ...error,
            email:
              "Email address is required for email/password authentication",
          };
        }

        if (!userObject.password) {
          error = {
            ...error,
            password: "Password is required for email/password authentication",
          };
        }

        break;
      case "google-register":
        if (!userObject.userHandle) {
          error = { ...error, handle: "User handle is required" };
        }
        break;
    }
    return error;
  };

  return (
    // Show login form or registration form
    <StyledLoginForm>
      {props.showRegisterForm ? (
        <>
          <h2>Create your account</h2>
          <label htmlFor="register-profile-picture">
            Choose a Profile Picture (optional)
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
          {formValidation.handle ? (
            <p className="error-message">{formValidation.handle}</p>
          ) : (
            ""
          )}
          <input
            name="register-handle"
            placeholder="Handle"
            type="text"
            value={userHandle}
            onChange={(e) =>
              setUserHandle(
                e.target.value.length === 1 && e.target.value[0] !== "@"
                  ? `@${e.target.value}`
                  : e.target.value
              )
            }
          />
          {formValidation.displayName ? (
            <p className="error-message">{formValidation.displayName}</p>
          ) : (
            ""
          )}
          <input
            name="display-name"
            placeholder="Display Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          {formValidation.email ? (
            <p className="error-message">{formValidation.email}</p>
          ) : (
            ""
          )}
          <input
            name="register-email"
            placeholder="Email"
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
          {formValidation.password ? (
            <p className="error-message">{formValidation.password}</p>
          ) : (
            ""
          )}
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
              id="email-register"
              onClick={(e) => {
                e.preventDefault();
                const userObject = {
                  email: registerEmail,
                  password: registerPassword,
                  displayName: displayName,
                  userHandle: userHandle,
                  profilePicture: profilePicture,
                };
                const error = validateForm(e, userObject);
                if (!Object.keys(error).length) {
                  setFormValidation("");
                  props.handleRegister(e, userObject);
                } else {
                  setFormValidation(error);
                }
              }}
            >
              Register
            </Button>
          </Flex>
          <Flex flexDirection="column">
            <p> or </p>
            <GoogleLoginButton
              id="google-register"
              onClick={(e) => {
                e.preventDefault();
                const userObject = {
                  email: registerEmail,
                  password: registerPassword,
                  displayName: displayName,
                  userHandle: userHandle,
                  profilePicture: profilePicture,
                };
                const error = validateForm(e, userObject);
                if (!Object.keys(error).length) {
                  setFormValidation("");
                  props.handleRegister(e, userObject);
                } else {
                  setFormValidation(error);
                }
              }}
            />
          </Flex>
        </>
      ) : (
        <>
          <h2>Sign In</h2>
          {formValidation.email ? (
            <p className="error-message">{formValidation.email}</p>
          ) : (
            ""
          )}
          <input
            name="sign-in-email"
            placeholder="Email"
            type="email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          {formValidation.password ? (
            <p className="error-message">{formValidation.password}</p>
          ) : (
            ""
          )}
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
                e.preventDefault();
                const userObject = {
                  email: loginEmail,
                  password: loginPassword,
                };
                const error = validateForm(e, userObject);
                console.log(error);
                if (!Object.keys(error).length) {
                  setFormValidation("");
                  props.handleLogin(e, userObject);
                } else {
                  setFormValidation(error);
                }
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
