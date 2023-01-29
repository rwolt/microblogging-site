import styled from "styled-components";
import { devices } from "./devices";

export const StyledBigInteractionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 10px 15px 10px 70px;
  border-bottom: 1px solid #e5e5e5;


  .liked {
    color: #289d8c;
  }

  svg:hover {
    cursor: pointer;
  }

  @media ${devices.mobileS} {
    .big-icon {
      width: 16px;
      height: 16px;
    }

  @media ${devices.mobileL} {
    .big-icon {
      width: 20px;
      height: 20px;
    }
  } ;
`;
