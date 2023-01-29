import { devices } from "./devices";
import styled from "styled-components";

export const Input = styled.input`
  width: 90%;
  font-size: 20px;
  padding: 10px 10px 10px 5px;
  outline: none;
  border: none;
  border-radius: 5px;

  @media ${devices.mobileS} {
    font-size: 1.1rem;
  }
  @media ${devices.mobileL} {
    font-size: 1.2rem;
  }
  @media ${devices.tablet} {
    font-size: 1.3rem;
  }
`;
