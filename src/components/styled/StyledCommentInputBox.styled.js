import styled from "styled-components";
import { devices } from "./devices";

export const StyledCommentInputBox = styled.div`
  border-bottom: 1px solid #e5e5e5;

  #comment {
    margin-right: 10px;
  }

  @media ${devices.mobileS} {
    #comment {
      font-size: 1rem;
      height: auto;
    }
  }

  @media ${devices.mobileL} {
    #comment {
      font-size: 1.1rem;
    }
  }

  @media ${devices.tablet} {
    #comment {
      font-size: 1.3rem;
    }
  }
`;
