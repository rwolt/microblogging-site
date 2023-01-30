import styled from "styled-components";
import { devices } from "./devices";

export const Popup = styled.div`
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: black;
  color: white;
  position: absolute;
  z-index: 100;


  @media ${devices.mobileS} {
   top 2.5%;
   left: 5%;
   width: 90%; 
  }

  @media ${devices.mobileL} {
  width: 80%;
  left: 10%;
  top: 5%;
  }

  @media ${devices.tablet} {
    width: 70%;
    left: 15%;
  }
`;
