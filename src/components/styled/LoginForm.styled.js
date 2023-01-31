import styled from "styled-components";
import { devices } from "./devices";

export const StyledLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  z-index: 100;

  .error-message {
    color: #ff5555;
    font-size: 14px;
  }

  @media ${devices.mobileS} {
    & > input {
      height: 2.5em;
      outline: none;
      font-size: 1em;
      border: none;
      border-radius: 5px;
      margin-bottom: 15px;
      padding: 10px;
    }
  }

  @media ${devices.mobileL} {
    & > input {
      height: 50px;
      outline: none;
      font-size: 1.2em;
      border: none;
      border-radius: 5px;
      margin-bottom: 15px;
      padding: 10px;
    }

    @media ${devices.tablet} {
      & > input {
        font-size: 1.3em;
        height: 2.75em;
        padding: 15px;
      }
    }
  }
`;
