import styled from "styled-components";
import { devices } from "./devices";

export const ProfileBarButton = styled.div`
  color: #555;
  width: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 3px solid transparent;

  &#active {
    color: black;
    border-bottom: 3px solid mediumaquamarine;
  }

  @media ${devices.mobileS} {
    font-size: 0.65em;
  }

  @media (min-width: 365px) {
    font-size: 0.75em;
  }

  @media ${devices.mobileL} {
    font-size: 0.9em;
  }
`;
