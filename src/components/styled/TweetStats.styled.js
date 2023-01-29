import styled from "styled-components";
import { devices } from "./devices";

export const StyledTweetStats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 15px 10px 70px;
  margin-top: 1ch;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;

  .counter {
    font-weight: 800;
    color: #000;
    margin-right: 0.5ch;
  }

  span {
    font-size: 1.1rem;
  }

  @media ${devices.mobileS} {
    span {
      font-size: 0.9rem;
    }
  }

  @media ${devices.mobileL} {
    span {
      font-size: 1.1rem;
    }
  }
`;
