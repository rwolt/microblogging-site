import React from "react";
import { Button } from "./styled/Button.styled";
import { StyledLoginForm } from "./styled/LoginForm.styled";

const LoginForm = (props) => {
  return (
    <StyledLoginForm>
      {props.showRegisterForm ? (
        <>
          <h3>Register User</h3>
          <label for="register-email">Email: </label>
          <input name="register-email" placeholder="Email" type="email" />
          <label for="register-password">Password:</label>
          <input
            name="register-password"
            placeholder="Password"
            type="password"
          />
          <Button>Register</Button>
        </>
      ) : (
        <>
          <h3>Sign In</h3>
          <label for="sign-in-email">Email:</label>
          <input name="sign-in-email" placeholder="Email" type="email" />
          <label for="sign-in-password">Password</label>
          <input
            name="sign-in-password"
            placeholder="Password"
            type="password"
          />
          <Button>Login</Button>
          <p>Don't have an account?</p>
          <Button onClick={() => props.setShowRegisterForm(true)}>
            Register
          </Button>
        </>
      )}
    </StyledLoginForm>
  );
};

export default LoginForm;
