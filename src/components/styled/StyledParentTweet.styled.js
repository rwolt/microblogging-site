import styled from "styled-components";
import { devices } from "./devices";

export const StyledParentTweet = styled.div`
  p {
    font-size: 1.5rem;
    padding: 10px 19px;
    margin: 0;
  }

  span {
    color: #7e7e7e;
    display: flex;
    align-items: center;
  }

  @media ${devices.tablet} {
    span#post-time {
      display: none;
    }
  }
`;
