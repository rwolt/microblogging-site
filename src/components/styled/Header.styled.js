import styled from "styled-components";
import { devices } from "./devices";

export const StyledPageHeader = styled.div`
  margin: 0;
  padding: 10px;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  @media ${devices.mobileS} {
    h2 {
      font-size: 1.1em;
    }

    #register-button,
    #login-button {
      font-size: 0.9em;
      width: 80px;
      height: 30px;
    }
  }

  @media ${devices.mobileL} {
    h2 {
      font-size: 1.4em;
    }
    #register-button,
    #login-button {
      font-size: 1.2em;
      width: 100px;
      height: 32px;
    }
  }

  @media ${devices.tablet} {
    h2 {
      font-size: 1.5em;
    }
    #register-button,
    #login-button {
      font-size: 1.3em;
      height: 35px;
    }
  }
`;
