import styled from "styled-components";
import { devices } from "./devices";

export const StyledParentTweet = styled.div`
  p {
    font-size: 1.5rem;
    padding: 10px 19px;
    margin: 0;
  }

  span#post-timestamp {
    color: #7e7e7e;
    display: flex;
    align-items: center;
  }

  @media ${devices.mobileS} {
    span#post-full-date {
      display: none;
    }

    span#post-short-date {
      display: block;
    }

    span#post-time {
      display: none;
    }

    span#decoration {
      display: none;
    }
  }

  @media ${devices.mobileS} {
    #parent-tweet-header {
      height: 60px;
    }

    p {
      font-size: 1.2rem;
    }
  }

  @media ${devices.mobileL} {
    #parent-tweet-header {
      height: 30px;
    }

    p {
      font-size: 1.3rem;
    }
  }

  @media ${devices.tablet} {
    span#post-short-date {
      display: none;
    }

    span#post-full-date {
      display: block;
    }

    span#post-time {
      display: block;
    }

    span#decoration {
      display: block;
    }

    p {
      font-size: 1.5rem;
    }
  }
`;
