import styled from "styled-components";
import { devices } from "./devices";

export const UserInfo = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & > a {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }

  & > a:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  p,
  & > a {
    margin: 0;
    padding: 5px;
  }

  & > span {
    display: flex;
    margin: 0;
    align-items: center;
    color: #555;
  }

  & > #user-handle {
    font-weight: normal;
    color: #289d8c;
  }


  @media ${devices.mobileS} {
      flex-direction: column;
      align-items: flex-start;
    
      & > #user-handle {
        padding-top: 0;
      }
      
      }
    }

    @media ${devices.mobileL} {
      flex-direction: row;
      align-items: center;
      
      & > #user-handle {
        padding-top: 5px;
      }
    }
  }
`;
