import styled from "styled-components";
import { devices } from "./devices";

export const StyledPostCard = styled.div`
  display: flex;
  padding: 5px;
  align-items: flex-start;
  border-bottom: 1px solid #e5e5e5;
  position: relative;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }

  @media ${devices.mobileS} {
    #dot-spacer {
      display: none;
    }

    #postcard-date {
      position: absolute;
      top: 10px;
      right: 15px;
    }
  }

  @media ${devices.mobileL} {
    #dot-spacer {
      display: inline;
    }

    #postcard-date {
      position: static;
    }
  }
`;
